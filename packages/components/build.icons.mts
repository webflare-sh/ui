import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { locate } from '@iconify/json'
import type { IconifyJSON } from '@iconify/types'
import { getIconsCSS } from '@iconify/utils'

/** Icons bundled into `@webflare/ui/style.css`, per Iconify set prefix. */
const icons: Record<string, string[]> = {
  ph: [
    'arrow-left',
    'arrow-left-bold',
    'arrow-right',
    'arrow-right-bold',
    'arrow-up',
    'arrow-up-bold',
    'arrow-down',
    'arrow-down-bold',
    'caret-down',
    'caret-down-bold',
    'caret-up',
    'caret-up-bold',
    'caret-left',
    'caret-left-bold',
    'caret-right',
    'caret-right-bold',
    'check-bold',
    'check-circle',
    'check-circle-bold',
    'circle-wavy-warning',
    'circle-wavy-warning-bold',
    'info',
    'info-bold',
    'warning',
    'warning-bold',
    'x',
    'x-bold',
    'lock-simple-bold',
    'lock-simple-open-bold',
  ],
}

let code = ''
for (const [prefix, names] of Object.entries(icons)) {
  const iconSet = JSON.parse(await readFile(locate(prefix), 'utf8')) as IconifyJSON
  code += getIconsCSS(iconSet, names, {
    iconSelector: '.icon-{name}',
    commonSelector: '.icon',
  })
}

const outFile = fileURLToPath(new URL('./src/styles/icons.css', import.meta.url))
await writeFile(outFile, code, 'utf8')
console.log(`Saved ${code.length} bytes of icon CSS to ${outFile}`)
