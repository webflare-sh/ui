import { describe, it, expect } from 'vitest'
import WebflareResolverDefault, { WebflareResolver } from '../src/resolver'
import { componentNames } from '../src/generated/componentNames'
import * as components from '../src/vue-components'

describe('WebflareResolver', () => {
  it('lists exactly the exported components', () => {
    expect([...componentNames].sort()).toEqual(Object.keys(components).sort())
  })

  it('resolves Wf-prefixed tags to named imports from @webflare/ui', () => {
    const resolver = WebflareResolver()

    expect(resolver.type).toBe('component')
    expect(resolver.resolve('WfButton')).toEqual({ name: 'Button', from: '@webflare/ui' })
    expect(resolver.resolve('WfCardRoot')).toEqual({ name: 'CardRoot', from: '@webflare/ui' })
    expect(resolver.resolve('WfFieldInput')).toEqual({ name: 'FieldInput', from: '@webflare/ui' })
  })

  it('resolves every component under its prefixed name', () => {
    const resolver = WebflareResolver()

    for (const name of componentNames) {
      expect(resolver.resolve(`Wf${name}`)).toEqual({ name, from: '@webflare/ui' })
    }
  })

  it('ignores unknown names, unprefixed names, namespaces, and composables', () => {
    const resolver = WebflareResolver()

    for (const name of ['WfNope', 'Button', 'CardRoot', 'WfCard', 'WfuseFlyout', 'WfFieldControl', 'RouterLink']) {
      expect(resolver.resolve(name), name).toBeUndefined()
    }
  })

  it('takes a custom or empty prefix', () => {
    expect(WebflareResolver({ prefix: 'Acme' }).resolve('AcmeButton')).toEqual({ name: 'Button', from: '@webflare/ui' })
    expect(WebflareResolver({ prefix: 'Acme' }).resolve('WfButton')).toBeUndefined()
    expect(WebflareResolver({ prefix: '' }).resolve('Button')).toEqual({ name: 'Button', from: '@webflare/ui' })
  })

  it('is also the default export', () => {
    expect(WebflareResolverDefault).toBe(WebflareResolver)
  })
})
