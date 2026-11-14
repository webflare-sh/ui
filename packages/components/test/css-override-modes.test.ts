import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../src/components/Button/Button.vue'
import { switchStyles } from '../src/internal/controls/switchStyles'
import { withCss } from '../src/internal/css'

// A `css` override must replace a property in every color mode. If a style
// writes its dark values as a whole `_dark` / `_osDark` block, the override
// only replaces the light value and the block's dark class survives the merge,
// then wins in dark mode on specificity.

/** Atomic classes that carry a dark-mode condition, as `property` → class names. */
function darkClasses(classes: string[]): Record<string, string[]> {
  const found: Record<string, string[]> = {}
  for (const name of classes) {
    const head = name.replace(/\[[^\]]*\]:/g, '')
    const underscore = head.indexOf('_')
    if (underscore < 0) continue
    const segments = head.slice(0, underscore).split(':')
    const property = segments.pop()!
    if (!segments.includes('dark') && !segments.includes('osDark')) continue
    ;(found[property] ??= []).push(name)
  }
  return found
}

describe('css overrides in dark mode', () => {
  it('Button secondary: an override replaces every mode', () => {
    const classes = mount(Button, {
      props: {
        label: 'A',
        color: 'secondary',
        css: {
          root: {
            'bg': 'red.500',
            'borderColor': 'red.500',
            'color': 'white',
            '& .btn-icon': { color: 'white' },
            '_hover': { backgroundColor: 'red.600' },
            '_active': { backgroundColor: 'red.700', borderColor: 'red.700' },
          },
        },
      },
    }).classes()

    expect(classes).toContain('bg_red.500')
    expect(classes).toContain('hover:bg-c_red.600')
    expect(classes).toContain('active:bg-c_red.700')
    expect(darkClasses(classes)).toEqual({})
  })

  it('Button transparent: an override replaces every mode', () => {
    const classes = mount(Button, {
      props: {
        label: 'A',
        color: 'transparent',
        css: {
          root: {
            _hover: { backgroundColor: 'red.600' },
            _active: { backgroundColor: 'red.700' },
          },
        },
      },
    }).classes()

    expect(classes).toContain('hover:bg-c_red.600')
    expect(classes).toContain('active:bg-c_red.700')
    // Only the label underline, which was not overridden, keeps a dark value.
    expect(Object.keys(darkClasses(classes))).toEqual(['td-c'])
  })

  it('Switch track: an override replaces every mode', () => {
    const classes = withCss(switchStyles.raw().track, {
      'bgColor': 'red.100',
      'borderColor': 'red.500',
      '_hover': { borderColor: 'red.600' },
      '&[data-state="checked"]': { bgColor: 'red.500' },
      '&[data-invalid]': { borderColor: 'red.700' },
    }).split(' ')

    expect(classes).toContain('bg-c_red.100')
    expect(classes).toContain('hover:bd-c_red.600')
    expect(darkClasses(classes)).toEqual({})
  })

  it('keeps the dark values when nothing is overridden', () => {
    const button = darkClasses(mount(Button, { props: { label: 'A', color: 'secondary' } }).classes())
    expect(Object.keys(button).sort()).toEqual(['bd-c', 'bg', 'bg-c', 'c'])

    const track = darkClasses(withCss(switchStyles.raw().track).split(' '))
    expect(Object.keys(track).sort()).toEqual(['bd-c', 'bg-c'])
  })
})
