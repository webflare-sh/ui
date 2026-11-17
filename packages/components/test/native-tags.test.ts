import { describe, it, expect } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Button from '../src/components/Button/Button.vue'
import CardRoot from '../src/components/Card/CardRoot.vue'
import FieldSwitch from '../src/components/Field/FieldSwitch.vue'
import HeroLead from '../src/components/Hero/HeroLead.vue'
import PricingCardHeader from '../src/components/PricingCard/PricingCardHeader.vue'
import PricingCardRoot from '../src/components/PricingCard/PricingCardRoot.vue'

/**
 * Components that choose their tag at runtime render it through Reka's
 * `Primitive` (`h(tag)`). A string `<component :is="'button'">` would resolve
 * against the app's global components first (`button` → `Button`), so an app's
 * own global `Button` would replace the native element, or recurse (#24).
 */
describe('native tags', () => {
  it('ignore app-level global components with the same names', async () => {
    const app = createSSRApp({
      components: { Button, CardRoot, FieldSwitch, HeroLead, PricingCardHeader, PricingCardRoot },
      template: `
        <div>
          <Button label="Save" />
          <Button label="Docs" to="/docs" />
          <CardRoot as="li">Card</CardRoot>
          <HeroLead headline="Hello" headline-tag="h2" />
          <PricingCardRoot title="Plan" price="10">
            <PricingCardHeader title="Plan" title-tag="h3" />
          </PricingCardRoot>
          <FieldSwitch name="alerts" label="Alerts" />
        </div>
      `,
    })
    const hijack = { render: () => h('i', { 'data-hijacked': '' }) }
    for (const tag of ['Button', 'A', 'Li', 'Div', 'H2', 'H3', 'Label']) {
      app.component(tag, hijack)
    }

    const html = await renderToString(app)

    expect(html).not.toContain('data-hijacked')
    expect(html).toMatch(/<button[^>]*class="[^"]*\bbtn\b[^>]*>[\s\S]*?Save/)
    expect(html).toMatch(/<a[^>]*href="\/docs"/)
    expect(html).toMatch(/<li[^>]*>[\s\S]*?Card/)
    expect(html).toMatch(/<h2[^>]*>[\s\S]*?Hello/)
    expect(html).toMatch(/<h3[^>]*>[\s\S]*?Plan/)
    expect(html).toMatch(/<label[^>]*>[\s\S]*?Alerts/)
  })

  it('do not recurse when an app registers the library Button as a global Button', async () => {
    const app = createSSRApp({ template: '<Button label="Publish" />' })
    app.component('Button', Button)

    const html = await renderToString(app)

    expect(html).toMatch(/^<button[^>]*class="[^"]*\bbtn\b/)
    expect(html).toContain('Publish')
  })
})
