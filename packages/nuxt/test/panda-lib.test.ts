import { execFileSync, spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const rootDir = fileURLToPath(new URL('../../..', import.meta.url))
const fixtureDir = fileURLToPath(new URL('./fixtures/panda-lib', import.meta.url))
const pandaBin = join(rootDir, 'node_modules/.bin/panda')
const rootPackagePath = join(rootDir, 'package.json')

function runPanda(args: string[], cwd: string) {
  return spawnSync(pandaBin, args, {
    cwd,
    encoding: 'utf8',
    env: process.env,
  })
}

function linkWorkspacePanda(consumerDir: string) {
  const source = join(rootDir, 'node_modules/@pandacss')
  const targetParent = join(consumerDir, 'node_modules')
  mkdirSync(targetParent, { recursive: true })
  const target = join(targetParent, '@pandacss')
  if (!existsSync(target)) {
    symlinkSync(source, target, 'dir')
  }
}

describe('panda lib consumer fixture', () => {
  const dir = mkdtempSync(join(tmpdir(), 'webflare-ui-panda-lib-'))
  const consumer = join(dir, 'consumer')
  let tarball = ''

  beforeAll(() => {
    expect(existsSync(join(rootDir, 'dist/panda/lib.json'))).toBe(true)
    expect(existsSync(pandaBin)).toBe(true)

    execFileSync('npm', ['pack', '--ignore-scripts', `--pack-destination=${dir}`], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    const { version } = JSON.parse(readFileSync(rootPackagePath, 'utf8')) as { version: string }
    tarball = join(dir, `webflare-ui-${version}.tgz`)
    expect(existsSync(tarball)).toBe(true)

    mkdirSync(consumer)
    writeFileSync(join(consumer, 'package.json'), JSON.stringify({
      name: 'webflare-ui-panda-lib-consumer',
      private: true,
      type: 'module',
    }))
    cpSync(join(fixtureDir, 'panda.config.ts'), join(consumer, 'panda.config.ts'))
    mkdirSync(join(consumer, 'src'), { recursive: true })
    cpSync(join(fixtureDir, 'src/app.ts'), join(consumer, 'src/app.ts'))

    execFileSync('npm', ['install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', tarball], {
      cwd: consumer,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    linkWorkspacePanda(consumer)
  }, 120_000)

  afterAll(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it('hydrates component CSS from designSystem only, without re-declared style objects', () => {
    const appSrc = readFileSync(join(consumer, 'src/app.ts'), 'utf8')
    const pandaConfig = readFileSync(join(consumer, 'panda.config.ts'), 'utf8')

    expect(appSrc).toContain('@webflare/ui/vue/Button')
    expect(appSrc).toContain('@webflare/ui/vue/CardRoot')
    expect(appSrc).toContain('@webflare/ui/vue/FieldInput')
    expect(appSrc).not.toMatch(/\bcva\s*\(/)
    expect(appSrc).not.toMatch(/\bsva\s*\(/)
    expect(appSrc).not.toMatch(/\bcss\s*\(/)
    expect(pandaConfig).toContain('designSystem: \'@webflare/ui\'')
    expect(pandaConfig).not.toContain('presets:')
    expect(pandaConfig).not.toContain('@webflare/ui/preset')
    expect(pandaConfig).not.toContain('@webflare/ui/design-preset')
    expect(pandaConfig).not.toContain('panda.buildinfo')
    expect(pandaConfig).not.toContain('include: [\'@webflare/ui')

    const result = runPanda(['cssgen', '--outfile', 'styles.css'], consumer)
    const output = `${result.stdout}\n${result.stderr}`
    expect(result.status, output).toBe(0)
    expect(output).not.toMatch(/design_system_in_include/)
    expect(output).not.toMatch(/design_system_manifest_not_found/)
    expect(output).not.toMatch(/design_system_manifest_not_exported/)

    const css = readFileSync(join(consumer, 'styles.css'), 'utf8')
    expect(css.length).toBeGreaterThan(1000)
    expect(css).toMatch(/d_inline[-_]flex/)
    expect(css).toMatch(/bg-c_primary/)
    // Every cva variant is extracted from the published JS, including ones
    // the app never renders.
    expect(css).toContain('w_37\\%')
    expect(css).toMatch(/\.bd-c_danger\\\.subtle/)
    expect(css).toMatch(/--colors-surface/)
  }, 120_000)

  it('re-extracts published JS when buildinfo is stale', () => {
    const installedRoot = join(consumer, 'node_modules/@webflare/ui')
    const buildinfoPath = join(installedRoot, 'dist/panda/buildinfo.json')
    expect(existsSync(buildinfoPath)).toBe(true)
    writeFileSync(buildinfoPath, '{ "this": "is-not-valid-panda-buildinfo" }\n')

    const result = runPanda(['cssgen', '--outfile', 'styles.stale.css'], consumer)
    const output = `${result.stdout}\n${result.stderr}`
    expect(result.status, output).toBe(0)
    expect(output).toMatch(/design_system_buildinfo_stale/)

    const css = readFileSync(join(consumer, 'styles.stale.css'), 'utf8')
    expect(css.length).toBeGreaterThan(1000)
    expect(css).toMatch(/d_inline[-_]flex/)
    expect(css).toMatch(/bg-c_primary/)
  }, 120_000)

  it('generates css overrides passed through css.raw, not bare objects', () => {
    writeFileSync(join(consumer, 'src/overrides.ts'), `import { css } from '../styled-system/css'

export const alertCss = { root: css.raw({ letterSpacing: '0.37em' }) }
export const plainObject = { root: { letterSpacing: '0.41em' } }
`)
    expect(runPanda(['codegen'], consumer).status).toBe(0)

    const result = runPanda(['cssgen', '--outfile', 'styles.overrides.css'], consumer)
    const output = `${result.stdout}\n${result.stderr}`
    expect(result.status, output).toBe(0)

    const css = readFileSync(join(consumer, 'styles.overrides.css'), 'utf8')
    // This is why the docs require css.raw() for `css` prop values.
    expect(css).toContain('letter-spacing: 0.37em')
    expect(css).not.toContain('letter-spacing: 0.41em')
  }, 120_000)
})
