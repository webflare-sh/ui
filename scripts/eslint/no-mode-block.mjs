// @ts-check

/**
 * Forbids color-mode condition blocks in Panda style objects, and requires
 * `_dark` and `_osDark` on one object to be the same value:
 *
 *   _dark: { bg: 'grey.800' }                          // reported (block)
 *   bg: { base: 'grey.100', _dark: 'grey.800' }        // reported (missing `_osDark`)
 *   bg: { base: 'grey.100', _dark: 'grey.800', _osDark: 'grey.700' } // reported (different)
 *   bg: { base: 'grey.100', _dark: 'grey.800', _osDark: 'grey.800' } // allowed
 *
 * `withCss` / `css()` merge style objects by key. A consumer override of `bg`
 * replaces the top-level `bg`, but the `bg` inside a `_dark` block is another
 * key: it survives the merge and wins in dark mode on specificity. Writing the
 * modes inside the property keeps one key per property, so an override
 * replaces it in every mode.
 *
 * A mode key is reported when its value is an object that contains a style
 * property anywhere below it. Nested conditions with plain values
 * (`bg: { base: 'x', _dark: { _hover: 'y' }, _osDark: { _hover: 'y' } }`) stay
 * allowed.
 *
 * `.dark` and OS dark must look the same, so `_dark` and `_osDark` are
 * compared as expressions: literals, identifiers, templates, calls, arrays,
 * and objects (properties in source order, including spreads). Parentheses
 * and `as` / `satisfies` are ignored. Any other form is compared as source
 * text. Raw `.dark` selectors and `_light` / `_osLight` are not paired.
 */

const MODE_CONDITIONS = new Set(['_dark', '_osDark', '_light', '_osLight'])
const MODE_SELECTOR = /\.(?:dark|light)\b|prefers-color-scheme/
// Breakpoint conditions such as `md`, `2xl`, `mdDown`, `smOnly`, `mdToLg`.
const BREAKPOINT = /^(?:\d*x?s|sm|md|lg|\d*xl)(?:Down|Only|To[A-Z0-9]\w*)?$/
const WRAPPERS = new Set([
  'ParenthesizedExpression',
  'TSAsExpression',
  'TSSatisfiesExpression',
  'TSTypeAssertion',
])

/** @param {import('estree').Property} property */
function keyName(property) {
  if (property.computed) return undefined
  if (property.key.type === 'Identifier') return property.key.name
  if (property.key.type === 'Literal' && typeof property.key.value === 'string') return property.key.value
  return undefined
}

/** @param {string} key */
function isCondition(key) {
  return key === 'base'
    || key.startsWith('_')
    || key.startsWith('@')
    || key.includes('&')
    || BREAKPOINT.test(key)
}

/** @param {string} key */
function isModeCondition(key) {
  return MODE_CONDITIONS.has(key)
    || ((key.includes('&') || key.startsWith('@')) && MODE_SELECTOR.test(key))
}

/**
 * True when the object sets a style property at any depth, i.e. it is a style
 * block rather than a map of conditions to values.
 *
 * @param {import('estree').ObjectExpression} object
 * @returns {boolean} Whether a style property appears below `object`.
 */
function containsStyleProperty(object) {
  return object.properties.some((member) => {
    if (member.type === 'SpreadElement') return true
    const key = keyName(member)
    if (key === undefined || !isCondition(key)) return true
    return member.value.type === 'ObjectExpression' && containsStyleProperty(member.value)
  })
}

/**
 * @param {import('estree').Node} node
 * @returns {import('estree').Node} The expression inside parentheses and `as` / `satisfies`.
 */
function unwrap(node) {
  let current = node
  while (WRAPPERS.has(current.type)) {
    const inner = /** @type {{ expression?: import('estree').Node }} */ (
      /** @type {unknown} */ (current)
    ).expression
    if (!inner) return current
    current = inner
  }
  return current
}

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Write color-mode conditions inside each property, and keep `_dark` equal to `_osDark`',
    },
    schema: [],
    messages: {
      block: 'Write the mode inside each property (`bg: { base: …, _dark: …, _osDark: … }`) instead of a `{{key}}: { … }` block. A `css` override replaces a property by key, so a value inside the block survives it and wins in that mode.',
      missing: '`{{key}}` needs an `{{other}}` with the same value, so `.dark` and OS dark look the same.',
      mismatch: '`_osDark` must be the same value as `_dark`, so `.dark` and OS dark look the same.',
    },
  },
  create(context) {
    /**
     * @param {import('estree').Node | null | undefined} left
     * @param {import('estree').Node | null | undefined} right
     * @returns {boolean} Whether both sides are missing, or are the same node.
     */
    function sameNode(left, right) {
      if (left == null || right == null) return left == null && right == null
      if (left.type === 'SpreadElement' || right.type === 'SpreadElement') {
        return left.type === 'SpreadElement'
          && right.type === 'SpreadElement'
          && sameValue(left.argument, right.argument)
      }
      return sameValue(left, right)
    }

    /**
     * @param {readonly (import('estree').Node | null | undefined)[]} left
     * @param {readonly (import('estree').Node | null | undefined)[]} right
     * @returns {boolean} Whether the lists have the same nodes in order.
     */
    function sameList(left, right) {
      if (left.length !== right.length) return false
      return left.every((item, index) => sameNode(item, right[index]))
    }

    /**
     * @param {import('estree').Node} left
     * @param {import('estree').Node} right
     * @returns {boolean} Whether the two expressions are the same value.
     */
    function sameValue(left, right) {
      const a = unwrap(left)
      const b = unwrap(right)
      if (a.type !== b.type) return false
      switch (a.type) {
        case 'Literal':
          return sameLiteral(a, /** @type {import('estree').Literal} */ (b))
        case 'Identifier':
          return a.name === /** @type {import('estree').Identifier} */ (b).name
        case 'TemplateLiteral':
          return sameTemplate(a, /** @type {import('estree').TemplateLiteral} */ (b))
        case 'CallExpression':
          return sameCall(a, /** @type {import('estree').CallExpression} */ (b))
        case 'ArrayExpression':
          return sameList(a.elements, /** @type {import('estree').ArrayExpression} */ (b).elements)
        case 'ObjectExpression':
          return sameObject(a, /** @type {import('estree').ObjectExpression} */ (b))
        default:
          return context.sourceCode.getText(a) === context.sourceCode.getText(b)
      }
    }

    /**
     * @param {import('estree').Literal} left
     * @param {import('estree').Literal} right
     * @returns {boolean} Whether the literals are the same value.
     */
    function sameLiteral(left, right) {
      const leftRegex = 'regex' in left ? left.regex : undefined
      const rightRegex = 'regex' in right ? right.regex : undefined
      if (leftRegex || rightRegex) {
        return !!leftRegex && !!rightRegex
          && leftRegex.pattern === rightRegex.pattern
          && leftRegex.flags === rightRegex.flags
      }
      return left.value === right.value
    }

    /**
     * @param {import('estree').TemplateLiteral} left
     * @param {import('estree').TemplateLiteral} right
     * @returns {boolean} Whether the templates have the same text and expressions.
     */
    function sameTemplate(left, right) {
      return left.quasis.length === right.quasis.length
        && left.quasis.every((quasi, index) => {
          const other = right.quasis[index]
          return other !== undefined
            && quasi.value.cooked === other.value.cooked
            && quasi.value.raw === other.value.raw
        })
        && sameList(left.expressions, right.expressions)
    }

    /**
     * @param {import('estree').CallExpression} left
     * @param {import('estree').CallExpression} right
     * @returns {boolean} Whether the calls have the same callee and arguments.
     */
    function sameCall(left, right) {
      return !!left.optional === !!right.optional
        && sameValue(left.callee, right.callee)
        && sameList(left.arguments, right.arguments)
    }

    /**
     * @param {import('estree').ObjectExpression} left
     * @param {import('estree').ObjectExpression} right
     * @returns {boolean} Whether the objects have the same properties in order.
     */
    function sameObject(left, right) {
      if (left.properties.length !== right.properties.length) return false
      return left.properties.every((member, index) => {
        const other = right.properties[index]
        if (other === undefined) return false
        if (member.type === 'SpreadElement' || other.type === 'SpreadElement') {
          return member.type === 'SpreadElement'
            && other.type === 'SpreadElement'
            && sameValue(member.argument, other.argument)
        }
        if (
          member.kind !== other.kind
          || member.method !== other.method
          || member.shorthand !== other.shorthand
          || member.computed !== other.computed
        ) return false
        if (member.computed) {
          if (!sameValue(member.key, other.key)) return false
        }
        else if (keyName(member) !== keyName(other)) return false
        return sameValue(member.value, other.value)
      })
    }

    /** @param {import('estree').Property} property */
    function checkBlock(property) {
      const key = keyName(property)
      if (key === undefined || !isModeCondition(key)) return
      if (property.value.type !== 'ObjectExpression' || !containsStyleProperty(property.value)) return
      context.report({ node: property.key, messageId: 'block', data: { key } })
    }

    /** @param {import('estree').ObjectExpression} object */
    function checkTwins(object) {
      /** @type {import('estree').Property | undefined} */
      let dark
      /** @type {import('estree').Property | undefined} */
      let osDark
      for (const member of object.properties) {
        if (member.type !== 'Property') continue
        const key = keyName(member)
        if (key === '_dark') dark = member
        else if (key === '_osDark') osDark = member
      }
      if (dark && osDark) {
        if (!sameValue(dark.value, osDark.value)) {
          context.report({ node: osDark.key, messageId: 'mismatch' })
        }
        return
      }
      const present = dark ?? osDark
      if (!present) return
      context.report({
        node: present.key,
        messageId: 'missing',
        data: {
          key: dark ? '_dark' : '_osDark',
          other: dark ? '_osDark' : '_dark',
        },
      })
    }

    const visitor = { Property: checkBlock, ObjectExpression: checkTwins }
    // In `.vue` files, also check style objects written in the template.
    const services = /** @type {{ defineTemplateBodyVisitor?: Function } | undefined} */ (context.sourceCode.parserServices)
    return services?.defineTemplateBodyVisitor
      ? services.defineTemplateBodyVisitor(visitor, visitor)
      : visitor
  },
}

export default {
  meta: { name: 'webflare' },
  rules: { 'no-mode-block': rule },
}
