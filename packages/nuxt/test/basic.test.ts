import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch, useTestContext } from '@nuxt/test-utils/e2e'

const workspaceRoot = fileURLToPath(new URL('../../..', import.meta.url))

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('<div>basic</div>')
  })

  it('auto-imports WfButton from the module', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Publish')
    expect(html).toContain('btn')
  })

  it('does not inject compiled Panda CSS from the library', async () => {
    const html = await $fetch('/')
    expect(html).not.toContain('@layer reset')
    expect(html).not.toContain('@layer tokens')
    expect(html).not.toContain('@layer recipes')
  })

  it('allows linked icon CSS and excludes prebuilt vue chunks from unimport', () => {
    const nuxt = useTestContext().nuxt
    expect(nuxt).toBeDefined()

    const cssPath = nuxt?.options.css.find(entry =>
      typeof entry === 'string'
      && (entry.endsWith('style.css') || entry.endsWith('ui-components.css')),
    )
    expect(cssPath).toEqual(expect.any(String))
    if (typeof cssPath !== 'string') {
      return
    }

    expect(nuxt?.options.vite.server?.fs?.allow).toEqual(
      expect.arrayContaining([dirname(cssPath)]),
    )

    const publishedDist = join(workspaceRoot, 'dist')
    expect(nuxt?.options.vite.server?.fs?.allow).toEqual(
      expect.arrayContaining([publishedDist]),
    )

    const heroLeadPath = join(publishedDist, 'vue/HeroLead.js')
    const exclude = nuxt?.options.imports.transform?.exclude ?? []
    expect(exclude.some(pattern => pattern instanceof RegExp && pattern.test(heroLeadPath))).toBe(true)
  })
})
