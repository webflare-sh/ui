import { defineComponent, h, ref } from 'vue'
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { joinUrl, parseUrlValue, sanitizeHostPathInput } from '../src/internal/controls/urlUtils'
import { useFormData } from '../src/composables/form'

describe('URL utilities', () => {
  it.each([
    ['https://example.com/a', 'https', 'example.com/a'],
    ['HTTP://example.com', 'http', 'example.com'],
    ['//example.com', 'https', 'example.com'],
    ['example.com', 'https', 'example.com'],
    ['  https://example.com  ', 'https', 'example.com'],
    ['', 'https', ''],
    [null, 'https', ''],
  ] as const)('parses %j', (value, protocol, hostPath) => {
    expect(parseUrlValue(value)).toEqual({ protocol, hostPath })
  })

  it('uses the default protocol when the value has none', () => {
    expect(parseUrlValue('example.com', 'http')).toEqual({ protocol: 'http', hostPath: 'example.com' })
  })

  it('strips a pasted scheme and reports it', () => {
    expect(sanitizeHostPathInput('  http://example.com')).toEqual({ protocol: 'http', hostPath: 'example.com' })
    expect(sanitizeHostPathInput('//example.com')).toEqual({ hostPath: 'example.com' })
  })

  it('leaves input without a scheme untouched, including whitespace', () => {
    expect(sanitizeHostPathInput(' example.com')).toEqual({ hostPath: ' example.com' })
  })

  it('joins protocol and host, and returns empty for an empty host', () => {
    expect(joinUrl('https', ' example.com ')).toBe('https://example.com')
    expect(joinUrl('https', '   ')).toBe('')
  })
})

describe('useFormData', () => {
  function mountForm() {
    let api!: ReturnType<typeof useFormData>
    const Form = defineComponent({
      setup() {
        const form = ref<HTMLFormElement | null>(null)
        // Called in setup, before the form exists: must still work later.
        api = useFormData(form)
        return () => h('form', { ref: form }, [h('input', { name: 'email', value: 'a@b.c' })])
      },
    })
    const wrapper = mount(Form, { attachTo: document.body })
    return { wrapper, api: () => api }
  }

  it('reads the form current values at call time', () => {
    const { wrapper, api } = mountForm()

    expect(api().getJson()).toEqual({ email: 'a@b.c' })

    wrapper.get('input').element.value = 'changed@b.c'
    expect(api().getJson()).toEqual({ email: 'changed@b.c' })
    expect(api().getFormData()?.get('email')).toBe('changed@b.c')

    wrapper.unmount()
  })

  it('accepts a plain element and returns null without one', () => {
    const form = document.createElement('form')
    form.innerHTML = '<input name="q" value="x">'
    expect(useFormData(form).getJson()).toEqual({ q: 'x' })
    expect(useFormData(null).getJson()).toBeNull()
    expect(useFormData(() => undefined).getFormData()).toBeNull()
  })
})
