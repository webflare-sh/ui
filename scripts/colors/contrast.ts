/**
 * Contrast check for the color roles in both modes. Warning only: it reports,
 * it never fails a build.
 *
 * Colors are measured as they appear: a translucent color (hex with alpha, an
 * opacity modifier, or a `color-mix()` whose weights sum below 100%) is
 * composited over the background it sits on.
 */
import type { ColorMode, FlatTokens } from '../tokens'

export interface Rgba { r: number, g: number, b: number, a: number }

export interface ContrastPair {
  /** What the pair is, e.g. "body text". */
  label: string
  /** Token path or color expression of the foreground, or one per mode. */
  fg: string | Record<ColorMode, string>
  /** Token path of the background. */
  bg: string
  /** Optional token path under `bg` when the background itself is translucent. */
  under?: string
  /** Minimum ratio: 4.5 for text, 3 for borders and focus rings. */
  min: number
}

export interface ContrastResult extends ContrastPair {
  mode: ColorMode
  ratio: number
  ok: boolean
}

function parseHex(hex: string): Rgba {
  let h = hex.slice(1)
  if (h.length === 3 || h.length === 4) h = [...h].map(c => c + c).join('')
  const n = (i: number) => Number.parseInt(h.slice(i, i + 2), 16)
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 }
}

/** Split on top-level commas. */
function splitArgs(input: string): string[] {
  const out: string[] = []
  let depth = 0
  let current = ''
  for (const char of input) {
    if (char === '(') depth++
    if (char === ')') depth--
    if (char === ',' && depth === 0) {
      out.push(current.trim())
      current = ''
      continue
    }
    current += char
  }
  out.push(current.trim())
  return out
}

/** Mix in sRGB with premultiplied alpha, as CSS `color-mix()` does. */
function mix(a: Rgba, pa: number, b: Rgba, pb: number): Rgba {
  const sum = pa + pb
  const wa = pa / sum
  const wb = pb / sum
  const alpha = a.a * wa + b.a * wb
  const channel = (ca: number, cb: number) => alpha === 0 ? 0 : (ca * a.a * wa + cb * b.a * wb) / alpha
  return {
    r: channel(a.r, b.r),
    g: channel(a.g, b.g),
    b: channel(a.b, b.b),
    // Weights below 100% scale the alpha.
    a: alpha * Math.min(1, sum / 100),
  }
}

/** Parse a resolved color value: hex, `transparent`, `rgb()`, or `color-mix()`. */
export function parseColor(value: string): Rgba {
  const v = value.trim()
  if (v === 'transparent') return { r: 0, g: 0, b: 0, a: 0 }
  if (v.startsWith('#')) return parseHex(v)
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(v)
  if (rgb) {
    const alpha = rgb[4] === undefined ? 1 : rgb[4].endsWith('%') ? Number.parseFloat(rgb[4]) / 100 : Number(rgb[4])
    return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]), a: alpha }
  }
  const colorMix = /^color-mix\(\s*in [\w-]+\s*,(.*)\)$/s.exec(v)
  if (colorMix) {
    const [first, second] = splitArgs(colorMix[1]!).map((part) => {
      const weight = /\s([\d.]+)%$/.exec(part)
      return { color: parseColor(weight ? part.slice(0, weight.index) : part), weight: weight ? Number(weight[1]) : undefined }
    })
    const pa = first!.weight ?? (second!.weight === undefined ? 50 : 100 - second!.weight)
    const pb = second!.weight ?? 100 - pa
    return mix(first!.color, pa, second!.color, pb)
  }
  throw new Error(`Cannot parse color: ${value}`)
}

/** Composite a translucent color over an opaque background. */
export function over(fg: Rgba, bg: Rgba): Rgba {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  }
}

function luminance({ r, g, b }: Rgba): number {
  const lin = (c: number) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function contrastRatio(a: Rgba, b: Rgba): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

/** Pairs every role is measured on. */
export const contrastPairs: ContrastPair[] = [
  { label: 'body text', fg: 'colors.neutral', bg: 'colors.surface', min: 4.5 },
  { label: 'body text on a raised panel', fg: 'colors.neutral', bg: 'colors.surface.raised', min: 4.5 },
  { label: 'body text on a muted section', fg: 'colors.neutral', bg: 'colors.surface-muted', min: 4.5 },
  { label: 'secondary copy', fg: 'colors.text.muted', bg: 'colors.surface', min: 4.5 },
  { label: 'secondary copy on a muted section', fg: 'colors.text.muted', bg: 'colors.surface-muted', min: 4.5 },
  { label: 'quiet text', fg: 'colors.neutral.light', bg: 'colors.surface', min: 4.5 },
  { label: 'placeholder', fg: 'colors.input-color', bg: 'colors.input-bg', min: 4.5 },
  { label: 'primary as text', fg: 'colors.primary', bg: 'colors.surface', min: 4.5 },
  { label: 'label on a primary button', fg: 'colors.grey.800', bg: 'colors.primary', min: 4.5 },
  { label: 'active tab label', fg: 'colors.neutral.inverse', bg: 'colors.primary', min: 4.5 },
  { label: 'accent text', fg: 'colors.accent-text', bg: 'colors.accent-subtle', under: 'colors.surface', min: 4.5 },
  { label: 'danger text', fg: 'colors.danger', bg: 'colors.surface', min: 4.5 },
  { label: 'success text', fg: 'colors.success', bg: 'colors.surface', min: 4.5 },
  { label: 'warning text', fg: 'colors.warning', bg: 'colors.surface', min: 4.5 },
  { label: 'info text', fg: 'colors.info', bg: 'colors.surface', min: 4.5 },
  { label: 'danger badge', fg: { light: 'colors.danger.text', dark: 'colors.white' }, bg: 'colors.danger.subtle', under: 'colors.surface', min: 4.5 },
  { label: 'success badge', fg: { light: 'colors.success.text', dark: 'colors.white' }, bg: 'colors.success.subtle', under: 'colors.surface', min: 4.5 },
  { label: 'warning badge', fg: { light: 'colors.warning.text', dark: 'colors.white' }, bg: 'colors.warning.subtle', under: 'colors.surface', min: 4.5 },
  { label: 'info badge', fg: { light: 'colors.info.text', dark: 'colors.white' }, bg: 'colors.info.subtle', under: 'colors.surface', min: 4.5 },
  { label: 'field border', fg: 'colors.border', bg: 'colors.surface', min: 3 },
  { label: 'input border', fg: 'colors.input-border', bg: 'colors.input-bg', min: 3 },
  { label: 'hovered field border', fg: 'colors.border.hover', bg: 'colors.surface', min: 3 },
  { label: 'divider', fg: 'colors.border.subtle', bg: 'colors.surface', min: 3 },
  { label: 'focus ring (primary at 30%)', fg: 'color-mix(in srgb, {colors.primary} 30%, transparent)', bg: 'colors.surface', min: 3 },
]

function lookup(tokens: FlatTokens, expression: string, mode: ColorMode): string {
  if (tokens[expression]) return tokens[expression][mode]
  return expression.replace(/\{([\w.-]+)\}/g, (_match, path: string) => {
    const token = tokens[path]
    if (!token) throw new Error(`Unknown token ${path}`)
    return token[mode]
  })
}

export function checkContrast(tokens: FlatTokens, pairs: ContrastPair[] = contrastPairs): ContrastResult[] {
  const results: ContrastResult[] = []
  for (const mode of ['light', 'dark'] as const) {
    const page = parseColor(lookup(tokens, 'colors.surface', mode))
    for (const pair of pairs) {
      const under = pair.under ? over(parseColor(lookup(tokens, pair.under, mode)), page) : page
      const bg = over(parseColor(lookup(tokens, pair.bg, mode)), under)
      const fgExpression = typeof pair.fg === 'string' ? pair.fg : pair.fg[mode]
      const fg = over(parseColor(lookup(tokens, fgExpression, mode)), bg)
      const ratio = Math.round(contrastRatio(fg, bg) * 100) / 100
      results.push({ ...pair, mode, ratio, ok: ratio >= pair.min })
    }
  }
  return results
}
