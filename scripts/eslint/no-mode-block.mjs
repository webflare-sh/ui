// @ts-check

/**
 * Forbids color-mode condition blocks in Panda style objects:
 *
 *   _dark: { bg: 'grey.800' }                          // reported
 *   bg: { base: 'grey.100', _dark: 'grey.800', … }     // allowed
 *
 * `withCss` / `css()` merge style objects by key. A consumer override of `bg`
 * replaces the top-level `bg`, but the `bg` inside a `_dark` block is another
 * key: it survives the merge and wins in dark mode on specificity. Writing the
 * modes inside the property keeps one key per property, so an override
 * replaces it in every mode.
 *
 * A mode key is reported when its value is an object that contains a style
 * property anywhere below it. Nested conditions with plain values
 * (`bg: { base: 'x', _dark: { _hover: 'y' } }`) stay allowed.
 */

const MODE_CONDITIONS = new Set(['_dark', '_osDark', '_light', '_osLight'])
const MODE_SELECTOR = /\.(?:dark|light)\b|prefers-color-scheme/
// Breakpoint conditions such as `md`, `2xl`, `mdDown`, `smOnly`, `mdToLg`.
const BREAKPOINT = /^(?:\d*x?s|sm|md|lg|\d*xl)(?:Down|Only|To[A-Z0-9]\w*)?$/

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

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Write color-mode conditions inside each property instead of as a `_dark` / `_osDark` block',
    },
    schema: [],
    messages: {
      block: 'Write the mode inside each property (`bg: { base: …, _dark: …, _osDark: … }`) instead of a `{{key}}: { … }` block. A `css` override replaces a property by key, so a value inside the block survives it and wins in that mode.',
    },
  },
  create(context) {
    /** @param {import('estree').Property} property */
    function check(property) {
      const key = keyName(property)
      if (key === undefined || !isModeCondition(key)) return
      if (property.value.type !== 'ObjectExpression' || !containsStyleProperty(property.value)) return
      context.report({ node: property.key, messageId: 'block', data: { key } })
    }

    const visitor = { Property: check }
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
