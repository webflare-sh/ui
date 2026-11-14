import { defineConfig } from '@pandacss/dev'
import config from './panda.config'

// Used only by `bun run check:colors`. `strictTokens` changes the generated
// TypeScript types, so the components are type-checked against this output.
export default defineConfig({
  ...config,
  strictTokens: true,
  outdir: '.cache/strict-tokens/styled-system',
})
