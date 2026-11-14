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
    // The unpaired `_dark` and `_osDark` lines are also missing their twin.
    expect(await findings(code)).toEqual([
      `export const a = { _dark: { _hover: { bg: 'grey.700' } } }`,
      `export const a = { _dark: { _hover: { bg: 'grey.700' } } }`,
      `export const b = { '_light': { '& .icon': { color: 'grey.800' } } }`,
      `export const c = { '.dark &': { color: 'white' } }`,
      `export const d = { '@media (prefers-color-scheme: dark)': { color: 'white' } }`,
      `export const e = { _osDark: { ...shared } }`,
      `export const e = { _osDark: { ...shared } }`,
    ])
  })

  it('allows the mode inside a property, nested conditions, and breakpoints', async () => {
    const code = [
      `export const s = {`,
      `  bg: { base: 'grey.100', _dark: 'grey.800', _osDark: 'grey.800' },`,
      `  _hover: { bg: { base: 'brand.100', _dark: 'grey.700', _osDark: 'grey.700' } },`,
      `  color: { base: 'x', _dark: { base: 'y', _hover: 'z', md: 'w' }, _osDark: { base: 'y', _hover: 'z', md: 'w' } },`,
      `  '&[data-state="checked"]': { bgColor: { base: 'primary', _dark: 'primary', _osDark: 'primary' } },`,
      `}`,
      `export const tokens = { value: { base: '{colors.white}', _dark: '{colors.grey.950}', _osDark: '{colors.grey.950}' } }`,
      `export const conditions = { dark: '.dark &, .dark&' }`,
    ].join('\n')
    expect(await findings(code)).toEqual([])
  })

  it('reports a missing twin and a `_dark` value that differs from `_osDark`', async () => {
    const code = [
      `export const missingOs = { bg: { base: 'grey.100', _dark: 'grey.800' } }`,
      `export const missingDark = { bg: { base: 'grey.100', _osDark: 'grey.800' } }`,
      `export const literals = { bg: { base: 'grey.100', _dark: 'grey.800', _osDark: 'grey.700' } }`,
      `export const nested = { color: { _dark: { base: 'y', _hover: 'z' }, _osDark: { base: 'y', _hover: 'w' } } }`,
      `export const order = { color: { _dark: { base: 'y', md: 'w' }, _osDark: { md: 'w', base: 'y' } } }`,
    ].join('\n')
    expect(await findings(code)).toEqual([
      `export const missingOs = { bg: { base: 'grey.100', _dark: 'grey.800' } }`,
      `export const missingDark = { bg: { base: 'grey.100', _osDark: 'grey.800' } }`,
      `export const literals = { bg: { base: 'grey.100', _dark: 'grey.800', _osDark: 'grey.700' } }`,
      `export const nested = { color: { _dark: { base: 'y', _hover: 'z' }, _osDark: { base: 'y', _hover: 'w' } } }`,
      `export const order = { color: { _dark: { base: 'y', md: 'w' }, _osDark: { md: 'w', base: 'y' } } }`,
    ])
  })

  it('allows the same literal, object, or identifier under `_dark` and `_osDark`', async () => {
    const code = [
      `const dark = 'grey.800'`,
      `const color = 'token(colors.black/45)'`,
      `export const literals = { bg: { base: 'grey.100', _dark: 'grey.800', _osDark: 'grey.800' } }`,
      `export const nested = { color: { _dark: { base: 'y', _hover: 'z', md: 'w' }, _osDark: { base: 'y', _hover: 'z', md: 'w' } } }`,
      `export const names = { bg: { base: 'grey.100', _dark: dark, _osDark: dark } }`,
      `export const calls = { bg: { _dark: token('grey.800'), _osDark: token('grey.800') } }`,
      `export const lists = { bg: { _dark: ['a', 'b'], _osDark: ['a', 'b'] } }`,
      'export const templates = { shadow: { _dark: `0 0 ${color}`, _osDark: `0 0 ${color}` } }',
      `export const wrapped = { bg: { _dark: ('grey.800' as const), _osDark: 'grey.800' satisfies string } }`,
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
      `<div :class="css({ _dark: { color: 'white' } })" />`,
    ])
  })

  it('finds no mode blocks or mismatched twins in the playground, which `bun run lint` does not cover', async () => {
    const results = await createLinter().lintFiles(['packages/nuxt/playground'])
    expect(results.length).toBeGreaterThan(10)
    const problems = results.flatMap(result => result.messages.map(message => `${result.filePath}:${message.line} ${message.message}`))
    expect(problems).toEqual([])
  })
})
