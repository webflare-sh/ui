import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { WfUI } from '../src/plugin'
import * as components from '../src/vue-components'

const names = Object.keys(components)

/** The template of `ssr-all.vue`: every public component with the props it needs. */
const ssrAllTemplate = (() => {
  const source = readFileSync(resolve(import.meta.dirname, 'ssr-all.vue'), 'utf8')
  const match = source.match(/<template>([\s\S]*)<\/template>\s*$/)
  if (!match?.[1]) throw new Error('ssr-all.vue has no template')
  return match[1]
})()

/** Renames every component tag (`<CardRoot`, `</CardRoot`) to `<${prefix}CardRoot`. */
function withPrefix(template: string, prefix: string): string {
  const pattern = new RegExp(`<(/?)(${names.join('|')})(?=[\\s/>])`, 'g')
  return template.replace(pattern, `<$1${prefix}$2`)
}

function renderWithPlugin(template: string, options?: Parameters<NonNullable<typeof WfUI.install>>[1]) {
  const app = createSSRApp({ template })
  app.use(WfUI, options)
  return { app, render: () => renderToString(app) }
}

describe('WfUI plugin', () => {
  it('registers every component with the Wf prefix by default', () => {
    const { app } = renderWithPlugin('<div />')
    const registered = Object.keys(app._context.components).sort()

    expect(registered).toEqual(names.map(name => `Wf${name}`).sort())
    expect(registered).not.toContain('Button')
  })

  it('registers under a custom prefix', () => {
    const { app } = renderWithPlugin('<div />', { prefix: 'Acme' })

    expect(Object.keys(app._context.components).sort()).toEqual(names.map(name => `Acme${name}`).sort())
  })

  it('SSR-renders every component by its Wf name', async () => {
    const html = await renderWithPlugin(withPrefix(ssrAllTemplate, 'Wf')).render()

    expect(html).toContain('Publish')
    expect(html).toMatch(/<button[^>]*class="[^"]*\bbtn\b/)
    expect(html).toContain('type="password"')
    expect(html).not.toMatch(/<wf[a-z]/i)
  })

  it('SSR-renders every component with an empty prefix without recursing', async () => {
    const html = await renderWithPlugin(ssrAllTemplate, { prefix: '' }).render()

    expect(html).toContain('Publish')
    expect(html).toMatch(/<button[^>]*class="[^"]*\bbtn\b/)
  })

  it('renders native tags even when the app registers components with the same names', async () => {
    const hijack = { render: () => h('i', { 'data-hijacked': '' }) }
    const app = createSSRApp({
      template: `
        <div>
          <WfButton label="Save" />
          <WfButton label="Docs" to="/docs" />
          <WfCardRoot as="li">Card</WfCardRoot>
          <WfHeroLead headline="Hello" headline-tag="h2" />
          <WfPricingCardRoot title="Plan" price="10">
            <WfPricingCardHeader title="Plan" title-tag="h3" />
          </WfPricingCardRoot>
          <WfFieldSwitch name="alerts" label="Alerts" />
        </div>
      `,
    })
    for (const tag of ['Button', 'A', 'Li', 'Div', 'H2', 'H3', 'Label']) {
      app.component(tag, hijack)
    }
    app.use(WfUI)

    const html = await renderToString(app)

    expect(html).not.toContain('data-hijacked')
    expect(html).toMatch(/<button[^>]*>[\s\S]*Save/)
    expect(html).toMatch(/<a[^>]*href="\/docs"/)
    expect(html).toMatch(/<li[^>]*>[\s\S]*Card/)
    expect(html).toMatch(/<h2[^>]*>[\s\S]*Hello/)
    expect(html).toMatch(/<h3[^>]*>[\s\S]*Plan/)
    expect(html).toMatch(/<label[^>]*>[\s\S]*Alerts/)
  })
})
