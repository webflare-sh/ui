import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AccordionRoot from '../src/components/Accordion/AccordionRoot.vue'
import AlertRoot from '../src/components/Alert/AlertRoot.vue'
import CardHeader from '../src/components/Card/CardHeader.vue'
import HeroLead from '../src/components/Hero/HeroLead.vue'
import ListRoot from '../src/components/List/ListRoot.vue'
import TabRoot from '../src/components/Tab/TabRoot.vue'

const markup = 'Hello <em>world</em>'

/**
 * Content props render as HTML. Sanitizing untrusted strings is
 * the consuming app's job.
 */
describe('HTML content', () => {
  it('Accordion items', () => {
    const items = [{ id: 'a', title: markup, content: markup }]
    // Closed items do not mount their content, so only the title is in the DOM.
    expect(mount(AccordionRoot, { props: { items } }).findAll('em')).toHaveLength(1)
  })

  it('CardHeader title and subtitle', () => {
    expect(mount(CardHeader, { props: { title: markup, subtitle: markup } }).findAll('em')).toHaveLength(2)
  })

  it('HeroLead headline and description', () => {
    expect(mount(HeroLead, { props: { headline: markup, description: markup } }).findAll('em')).toHaveLength(2)
  })

  it('List items', () => {
    expect(mount(ListRoot, { props: { items: [{ content: markup }, { content: markup }] } }).findAll('em')).toHaveLength(2)
  })

  it('Tab labels', () => {
    const items = [{ value: 'a', label: markup }, { value: 'b', label: markup }]
    expect(mount(TabRoot, { props: { items } }).findAll('em')).toHaveLength(2)
  })
})

describe('css overrides', () => {
  it('AlertRoot applies slot overrides from the css map', () => {
    const wrapper = mount(AlertRoot, {
      props: {
        messages: [{ title: 'T', description: 'D' }],
        css: { root: { marginTop: '4px' }, title: { letterSpacing: '1px' } },
      },
    })
    expect(wrapper.classes()).toContain('d_flex')
    expect(wrapper.classes()).toContain('mt_4px')
    expect(wrapper.find('.ls_1px').exists()).toBe(true)
  })
})
