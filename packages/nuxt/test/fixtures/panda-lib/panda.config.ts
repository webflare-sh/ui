import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  designSystem: '@webflare/ui',
  include: ['./src/**/*.{js,ts,vue}'],
  outdir: 'styled-system',
})
