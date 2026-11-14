/**
 * Flatten a Panda preset's tokens into `path -> { light, dark }` with every
 * `{category.path}` reference resolved. Used to snapshot a preset and to
 * compare one preset with another in tests.
 *
 * Token descriptions are dropped on purpose.
 */

export type ColorMode = 'light' | 'dark'

export interface FlatToken {
  /** `token` for theme.tokens, `semantic` for theme.semanticTokens, `theme` for breakpoints and containers. */
  kind: 'token' | 'semantic' | 'theme'
  light: string
  dark: string
}

export type FlatTokens = Record<string, FlatToken>

/**
 * Which condition keys give the value of each mode, in lookup order.
 * `base` is always the last fallback.
 */
export type ModeConditions = Record<ColorMode, string[]>

/** Any preset or config object. Only `theme.tokens`, `theme.semanticTokens`, and `theme.extend` are read. */
interface PresetLike {
  theme?: object
}

interface ThemeLike {
  tokens?: Record<string, unknown>
  semanticTokens?: Record<string, unknown>
  extend?: Record<string, unknown>
}

type RawValue = string | number | Record<string, unknown>

interface RawEntry {
  kind: FlatToken['kind']
  value: RawValue
}

const THEME_SCALES = ['breakpoints', 'containers'] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function walk(node: unknown, path: string[], kind: RawEntry['kind'], out: Map<string, RawEntry>) {
  if (!isRecord(node)) {
    return
  }

  if ('value' in node) {
    const value = node.value
    const tokenPath = path.filter(part => part !== 'DEFAULT').join('.')
    if (typeof value === 'string' || typeof value === 'number' || isRecord(value)) {
      out.set(tokenPath, { kind, value })
    }
    else if (Array.isArray(value)) {
      out.set(tokenPath, { kind, value: value.join(', ') })
    }
  }

  for (const [key, child] of Object.entries(node)) {
    if (key === 'value' || key === 'description' || key === 'type' || key === 'extensions' || key === 'deprecated') {
      continue
    }
    walk(child, [...path, key], kind, out)
  }
}

function pickMode(value: RawValue, keys: string[]): string {
  if (!isRecord(value)) {
    return String(value)
  }

  for (const key of [...keys, 'base']) {
    const candidate = value[key]
    if (typeof candidate === 'string' || typeof candidate === 'number') {
      return String(candidate)
    }
  }

  throw new Error(`No value for conditions ${[...keys, 'base'].join(', ')} in ${JSON.stringify(value)}`)
}

/**
 * Resolve `{category.path}` and `{colors.path/50}` references. An opacity
 * modifier resolves the way Panda writes it: a `color-mix()` with transparent.
 */
function resolve(
  raw: string,
  mode: ColorMode,
  lookup: (path: string, mode: ColorMode, seen: string[]) => string,
  seen: string[],
): string {
  return raw.replace(/\{([\w.-]+)(?:\/(\d+(?:\.\d+)?))?\}/g, (_match, path: string, alpha?: string) => {
    const resolved = lookup(path, mode, seen)
    return alpha === undefined ? resolved : `color-mix(in srgb, ${resolved} ${alpha}%, transparent)`
  })
}

export function flattenPreset(preset: PresetLike, conditions: ModeConditions): FlatTokens {
  const raw = new Map<string, RawEntry>()

  const theme = (preset.theme ?? {}) as ThemeLike
  for (const [category, scale] of Object.entries(theme.tokens ?? {})) {
    walk(scale, [category], 'token', raw)
  }
  for (const [category, scale] of Object.entries(theme.semanticTokens ?? {})) {
    walk(scale, [category], 'semantic', raw)
  }
  for (const scale of THEME_SCALES) {
    const values = theme.extend?.[scale]
    if (isRecord(values)) {
      for (const [name, value] of Object.entries(values)) {
        if (typeof value === 'string') {
          raw.set(`${scale}.${name}`, { kind: 'theme', value })
        }
      }
    }
  }

  const lookup = (path: string, mode: ColorMode, seen: string[]): string => {
    if (seen.includes(path)) {
      throw new Error(`Circular token reference: ${[...seen, path].join(' -> ')}`)
    }
    const entry = raw.get(path)
    if (!entry) {
      throw new Error(`Unknown token reference {${path}}${seen.length ? ` in ${seen.at(-1)}` : ''}`)
    }
    return resolve(pickMode(entry.value, conditions[mode]), mode, lookup, [...seen, path])
  }

  const flat: FlatTokens = {}
  for (const path of [...raw.keys()].sort()) {
    const entry = raw.get(path)!
    flat[path] = {
      kind: entry.kind,
      light: lookup(path, 'light', []),
      dark: lookup(path, 'dark', []),
    }
  }
  return flat
}

/** Lowercase hex colors so comparisons ignore letter case. */
export function normalizeValue(value: string): string {
  return value.replace(/#[0-9a-f]{3,8}\b/gi, hex => hex.toLowerCase())
}
