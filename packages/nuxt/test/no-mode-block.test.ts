import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { ESLint } from 'eslint'

// Runs the repo's own ESLint config (parsers included) with only the
// `webflare/no-mode-block` rule, so other lint findings do not interfere.
const root = fileURLToPath(new URL('../../..', import.meta.url))
const ruleId = 'webflare/no-mode-block'

function createLinter() {
  return new ESLint({
    cwd: root,
    cache: false,
    ruleFilter: rule => rule.ruleId === ruleId,
    ignorePatterns: ['**/.nuxt/**', '**/.output/**'],
  })
}

/** The source line of each finding, or the message of a non-rule error such as a parse error. */
async function findings(code: string, filePath = 'packages/components/src/components/Example/styles.ts') {
  const [result] = await createLinter().lintText(code, { filePath })
  const lines = code.split('\n')
  return (result?.messages ?? []).map(message => message.ruleId === ruleId ? lines[message.line - 1]!.trim() : message.message)
}

describe('webflare/no-mode-block', () => {
  it('reports a `_dark` / `_osDark` block in a style object', async () => {
    const code = [
      `import { cva } from 'styled-system/css'`,
      `export const s = cva({ base: {`,
      `  bg: 'grey.100',`,
      `  _dark: { bg: 'grey.800' },`,
      `  _osDark: { bg: 'grey.800' },`,
      `} })`,
    ].join('\n')
    expect(await findings(code)).toEqual([
      `_dark: { bg: 'grey.800' },`,
      `_osDark: { bg: 'grey.800' },`,
    ])
  })

  it('reports blocks that only hold states, raw mode selectors, and spreads', async () => {
    const code = [
      `const shared = { bg: 'x' }`,
      `export const a = { _dark: { _hover: { bg: 'grey.700' } } }`,
      `export const b = { '_light': { '& .icon': { color: 'grey.800' } } }`,
      `export const c = { '.dark &': { color: 'white' } }`,
      `export const d = { '@media (prefers-color-scheme: dark)': { color: 'white' } }`,
      `export const e = { _osDark: { ...shared } }`,
    ].join('\n')
    expect(await findings(code)).toHaveLength(5)
  })

  it('allows the mode inside a property, nested conditions, and breakpoints', async () => {
    const code = [
      `export const s = {`,
      `  bg: { base: 'grey.100', _dark: 'grey.800', _osDark: 'grey.800' },`,
      `  _hover: { bg: { base: 'brand.100', _dark: 'grey.700', _osDark: 'grey.700' } },`,
      `  color: { base: 'x', _dark: { base: 'y', _hover: 'z', md: 'w' } },`,
      `  '&[data-state="checked"]': { bgColor: { base: 'primary', _dark: 'primary', _osDark: 'primary' } },`,
      `}`,
      `export const tokens = { value: { base: '{colors.white}', _dark: '{colors.grey.950}' } }`,
      `export const conditions = { dark: '.dark &, .dark&' }`,
    ].join('\n')
    expect(await findings(code)).toEqual([])
  })

  it('checks style objects in a Vue template', async () => {
    const code = [
      `<script setup lang="ts">`,
      `import { css } from 'styled-system/css'`,
      `</script>`,
      ``,
      `<template>`,
      `  <div :class="css({ _dark: { color: 'white' } })" />`,
      `</template>`,
    ].join('\n')
    expect(await findings(code, 'packages/nuxt/playground/pages/example.vue')).toEqual([
      `<div :class="css({ _dark: { color: 'white' } })" />`,
    ])
  })

  it('finds no blocks in the playground, which `bun run lint` does not cover', async () => {
    const results = await createLinter().lintFiles(['packages/nuxt/playground'])
    expect(results.length).toBeGreaterThan(10)
    const problems = results.flatMap(result => result.messages.map(message => `${result.filePath}:${message.line} ${message.message}`))
    expect(problems).toEqual([])
  })
})
