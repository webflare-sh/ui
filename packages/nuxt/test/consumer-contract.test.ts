import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync, existsSync, symlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { describe, it, expect } from 'vitest'

const styleCssPath = fileURLToPath(new URL('../../../dist/style.css', import.meta.url))
const pandaLibPath = fileURLToPath(new URL('../../../dist/panda/lib.json', import.meta.url))
const pandaBuildinfoPath = fileURLToPath(new URL('../../../dist/panda/buildinfo.json', import.meta.url))
const rootDir = fileURLToPath(new URL('../../..', import.meta.url))
const rootPackagePath = join(rootDir, 'package.json')

function libFallbackInTarball(file: string, packedFiles: string[]): boolean {
  const packed = new Set(packedFiles)
  const normalized = file.replace(/^\.\//, '')
  const exact = [
    `package/${normalized}`,
    `package/dist/${normalized}`,
    `package/dist/panda/${normalized}`,
  ]
  if (!file.includes('*')) {
    return exact.some(path => packed.has(path))
  }

  return packedFiles.some((entry) => {
    if (!entry.startsWith('package/dist/')) {
      return false
    }
    return entry.endsWith('.js') || entry.endsWith('.mjs')
  })
}

function readBuiltVueModule(entryName: string): string {
  const entryDir = join(rootDir, 'packages/components/dist/vue')
  const entry = readFileSync(join(entryDir, `${entryName}.js`), 'utf8')
  const parts = [entry]

  for (const match of entry.matchAll(/from\s+["'](\.\.?\/[^"']+)["']/g)) {
    const specifier = match[1]
    if (!specifier) {
      continue
    }
    parts.push(readFileSync(join(entryDir, specifier), 'utf8'))
  }

  return parts.join('\n')
}

describe('consumer styling contract', () => {
  it('ships a panda lib manifest for designSystem consumers', () => {
    const manifest = JSON.parse(readFileSync(pandaLibPath, 'utf8')) as {
      name?: string
      schemaVersion?: number
      buildInfo?: string
      preset?: string
      files?: string[]
    }
    const buildinfo = JSON.parse(readFileSync(pandaBuildinfoPath, 'utf8')) as {
      atoms?: unknown[]
      styles?: { atomic?: unknown[] }
    }

    expect(manifest.name).toBe('@webflare/ui')
    expect(manifest.schemaVersion).toBe(1)
    expect(manifest.buildInfo).toBe('./buildinfo.json')
    expect(manifest.preset).toBe('./preset.mjs')
    expect(manifest.files?.length).toBeGreaterThan(0)
    expect(existsSync(join(rootDir, 'dist/panda/preset.mjs'))).toBe(true)

    const presetSource = readFileSync(join(rootDir, 'dist/panda/preset.mjs'), 'utf8')
    expect(presetSource).not.toMatch(/from\s+["']@pandacss\/preset-base["']/)
    expect(presetSource).not.toMatch(/presets:\s*\[\s*["']@pandacss\/preset-base["']/)

    const atomCount = buildinfo.atoms?.length ?? buildinfo.styles?.atomic?.length ?? 0
    expect(atomCount).toBeGreaterThan(0)
  })

  it('ships icon CSS only, not compiled Panda styles or preflight', () => {
    const css = readFileSync(styleCssPath, 'utf8')

    expect(css).toContain('.icon')
    expect(css).not.toContain('@layer reset')
    expect(css).not.toContain('@layer tokens')
    expect(css).not.toContain('@layer recipes')
    expect(css).not.toContain('@layer utilities')
  })
})

describe('published package contract', () => {
  const pkg = JSON.parse(readFileSync(rootPackagePath, 'utf8')) as {
    dependencies?: Record<string, string>
    peerDependencies: Record<string, string>
    peerDependenciesMeta?: Record<string, { optional?: boolean }>
    scripts: Record<string, string>
    files: string[]
    exports: Record<string, unknown>
  }

  it('does not install @nuxt/kit for Vue-only consumers', () => {
    expect(pkg.dependencies?.['@nuxt/kit']).toBeUndefined()
    expect(pkg.peerDependencies['@nuxt/kit']).toBeDefined()
    expect(pkg.peerDependenciesMeta?.['@nuxt/kit']?.optional).toBe(true)
  })

  it('declares required Vue peers', () => {
    expect(pkg.peerDependencies.vue).toBeDefined()
    expect(pkg.peerDependencies['reka-ui']).toBeDefined()
    expect(pkg.peerDependencies['@pandacss/dev']).toBeDefined()
    expect(pkg.peerDependencies['@pandacss/preset-base']).toBeUndefined()
    expect(pkg.dependencies?.['@pandacss/preset-base']).toMatch(/^\^2\.4/)
    expect(pkg.peerDependenciesMeta?.vue?.optional).toBeUndefined()
    expect(pkg.peerDependenciesMeta?.['reka-ui']?.optional).toBeUndefined()
  })

  it('keeps root scripts to orchestration and daily commands', () => {
    expect(Object.keys(pkg.scripts)).toEqual([
      'lint',
      'lint:fix',
      'build',
      'build:preset',
      'build:components',
      'build:nuxt',
      'panda:lib',
      'link:package',
      'watch:preset',
      'dev:components',
      'dev:nuxt',
      'dev:nuxt:prepare',
      'dev:nuxt:build',
      'test',
      'prepublishOnly',
      'clean',
      'typecheck',
    ])
    expect(pkg.scripts.test).toContain('link:package')
    expect(pkg.scripts.test).toContain('@webflare/ui-components')
  })

  it('builds packages before assembling dist in the cloud install script', () => {
    const install = readFileSync(join(rootDir, '.cursor/install.sh'), 'utf8')
    const buildIdx = install.indexOf('bun run build')
    const playgroundPrepareIdx = install.indexOf('nuxi prepare playground')
    const pandaPrepareIdx = install.indexOf('packages/nuxt/playground && bun run prepare')

    expect(buildIdx).toBeGreaterThan(-1)
    expect(install).not.toMatch(/^\s*bun run dev:nuxt:prepare\b/m)
    expect(install).toContain('NUXT_TELEMETRY_DISABLED=1')
    expect(playgroundPrepareIdx).toBeGreaterThan(buildIdx)
    expect(pandaPrepareIdx).toBeGreaterThan(buildIdx)

    const playgroundNuxtConfig = readFileSync(
      join(rootDir, 'packages/nuxt/playground/nuxt.config.ts'),
      'utf8',
    )
    expect(playgroundNuxtConfig).toContain('telemetry: false')
  })

  it('builds the Nuxt module without the playground', () => {
    expect(pkg.scripts['build:nuxt']).toContain('prepack')
    expect(pkg.scripts['build:nuxt']).not.toContain('dev:build')
    expect(pkg.scripts['build:nuxt']).not.toContain('dev:prepare')
    expect(pkg.scripts['dev:nuxt:build']).toContain('dev:build')
    expect(pkg.scripts['build:components']).toContain('dist/style.css')
    expect(pkg.scripts['build:components']).not.toContain('dist/panda.buildinfo.json')
    expect(pkg.scripts['panda:lib']).toContain('panda lib')
    expect(pkg.scripts['panda:lib']).toContain('--files \'./**/*.{js,mjs}\'')
    expect(pkg.scripts.build).toContain('rm -rf dist')
    expect(pkg.scripts.build).toContain('assemble-dist.ts')
    expect(pkg.scripts.build).toContain('panda:lib')

    const componentsPkg = JSON.parse(readFileSync(join(rootDir, 'packages/components/package.json'), 'utf8')) as {
      scripts: Record<string, string>
      exports: Record<string, unknown>
    }
    expect(componentsPkg.scripts['panda:buildinfo']).toBeUndefined()
    expect(componentsPkg.scripts.build).not.toContain('panda:buildinfo')
    expect(componentsPkg.exports['./panda.buildinfo.json']).toBeUndefined()

    const assembleDist = readFileSync(join(rootDir, 'scripts/assemble-dist.ts'), 'utf8')
    expect(assembleDist).toContain('rmSync(dest, { recursive: true, force: true })')
    expect(assembleDist).toContain('lstatSync')

    const nuxtPkg = JSON.parse(readFileSync(join(rootDir, 'packages/nuxt/package.json'), 'utf8')) as {
      scripts: Record<string, string>
      dependencies?: Record<string, string>
    }
    expect(nuxtPkg.scripts.prepack).toContain('nuxt-module-build prepare')
    expect(nuxtPkg.scripts.prepack).toContain('nuxt-module-build build')
    expect(nuxtPkg.dependencies?.['@webflare/design-preset']).toBeUndefined()
    expect(nuxtPkg.dependencies?.['@webflare/ui-components']).toBeUndefined()
  })

  it('playground dogfoods designSystem: \'@webflare/ui\'', () => {
    const pandaConfig = readFileSync(
      join(rootDir, 'packages/nuxt/playground/panda.config.ts'),
      'utf8',
    )
    const rootPandaConfig = readFileSync(join(rootDir, 'panda.config.ts'), 'utf8')

    expect(pandaConfig).toContain('designSystem: \'@webflare/ui\'')
    expect(pandaConfig).not.toContain('presets:')
    expect(pandaConfig).not.toContain('@webflare/ui/panda.buildinfo.json')
    expect(pandaConfig).not.toContain('@webflare/ui/design-preset')
    expect(pandaConfig).not.toContain('@webflare/ui/preset')
    expect(pandaConfig).not.toContain('require.resolve')
    expect(pandaConfig).not.toContain('@webflare/design-preset')
    expect(pandaConfig).not.toContain('node_modules/@webflare/ui/dist/panda.buildinfo.json')

    expect(rootPandaConfig).toContain('outdir: \'dist/styled-system\'')
    expect(rootPandaConfig).toContain('./packages/preset/src/index.ts')
    expect(rootPandaConfig).not.toContain('designSystem:')
  })

  it('resolves Nuxt vue entries through public package exports', () => {
    const moduleSrc = readFileSync(join(rootDir, 'packages/nuxt/src/module.ts'), 'utf8')

    expect(pkg.scripts.test).toContain('link:package')
    expect(pkg.exports['./nuxt-entries.json']).toBe('./dist/nuxt-entries.json')
    expect(pkg.exports['./vue/*']).toEqual({
      types: './dist/vue/*.d.ts',
      import: './dist/vue/*.js',
      require: './dist/vue/*.cjs',
      default: './dist/vue/*.js',
    })
    expect(pkg.exports['.']).toEqual({
      types: './dist/index.d.ts',
      import: './dist/index.js',
      require: './dist/index.cjs',
    })
    expect(pkg.exports['./design-preset']).toEqual({
      types: './dist/preset/index.d.ts',
      import: './dist/preset/index.js',
      require: './dist/preset/index.cjs',
    })
    expect(pkg.exports['./nuxt']).toEqual({
      types: './dist/nuxt/types.d.mts',
      import: './dist/nuxt/module.mjs',
      default: './dist/nuxt/module.mjs',
    })
    expect(pkg.exports['./preset']).toEqual({
      types: './dist/preset/index.d.ts',
      import: './dist/preset/index.js',
      require: './dist/preset/index.cjs',
    })
    expect(pkg.exports['./panda.buildinfo.json']).toBeUndefined()
    expect(pkg.exports['./panda/*']).toBe('./dist/panda/*')
    expect(pkg.exports['./css']).toBeDefined()
    expect(moduleSrc).toContain('@webflare/ui/nuxt-entries.json')
    expect(moduleSrc).toContain('filePath: \'@webflare/ui\'')
    expect(moduleSrc).toContain('from: \'@webflare/ui\'')
    expect(moduleSrc).not.toContain('@webflare/ui/vue/')
    expect(moduleSrc).toContain('@webflare/ui/panda/lib.json')
    expect(moduleSrc).not.toContain('@webflare/ui/panda.buildinfo.json')
    expect(moduleSrc).toContain('warnIfPandaSetupLooksMissing')
    expect(moduleSrc).toContain('@pandacss/dev/postcss')
    expect(moduleSrc).not.toContain('findFileFromModule')
    expect(moduleSrc).not.toContain('packages/components/dist/nuxt-entries.json')
  })

  it('emits per-component Vue entries for Nuxt auto-imports', () => {
    const buttonPath = join(rootDir, 'packages/components/dist/vue/Button.js')
    const accordionPath = join(rootDir, 'packages/components/dist/vue/AccordionRoot.js')
    const entriesPath = join(rootDir, 'packages/components/dist/nuxt-entries.json')

    expect(existsSync(buttonPath)).toBe(true)
    expect(existsSync(accordionPath)).toBe(true)
    expect(existsSync(entriesPath)).toBe(true)
    expect(existsSync(join(rootDir, 'packages/components/dist/vue/Button.d.ts'))).toBe(true)
    expect(existsSync(join(rootDir, 'dist/vue/Button.d.ts'))).toBe(true)
    expect(existsSync(join(rootDir, 'dist/vue/FieldInput.d.ts'))).toBe(true)
    expect(existsSync(join(rootDir, 'dist/vue/useFormData.d.ts'))).toBe(true)

    const buttonJs = readFileSync(buttonPath, 'utf8')
    const buttonModule = readBuiltVueModule('Button')
    expect(buttonJs).not.toContain('AccordionRoot')
    expect(buttonModule).toContain('@webflare/ui/css')
    expect(buttonModule).not.toContain('styled-system/')

    const entries = JSON.parse(readFileSync(entriesPath, 'utf8')) as {
      components: Record<string, string>
    }
    expect(entries.components.Button).toBe('Button')
    expect(entries.components.AlertRoot).toBe('AlertRoot')
    expect(entries.components.BadgeRoot).toBe('BadgeRoot')
    expect(entries.components.TabRoot).toBe('TabRoot')
    expect(entries.components.Alert).toBeUndefined()
    expect(entries.components.Badge).toBeUndefined()
    expect(entries.components.Tab).toBeUndefined()

    expect(existsSync(join(rootDir, 'packages/components/dist/vue/AlertRoot.js'))).toBe(true)
    expect(existsSync(join(rootDir, 'packages/components/dist/vue/Alert.js'))).toBe(false)
    expect(existsSync(join(rootDir, 'packages/components/dist/vue/BadgeRoot.js'))).toBe(true)
    expect(existsSync(join(rootDir, 'packages/components/dist/vue/Badge.js'))).toBe(false)
    expect(existsSync(join(rootDir, 'packages/components/dist/vue/TabRoot.js'))).toBe(true)
    expect(existsSync(join(rootDir, 'packages/components/dist/vue/Tab.js'))).toBe(false)
  })

  it('ships TypeScript types for Nuxt vue entries', () => {
    const entries = JSON.parse(readFileSync(join(rootDir, 'dist/nuxt-entries.json'), 'utf8')) as {
      components: Record<string, string>
      composables: string[]
    }
    const buttonDtsPath = join(rootDir, 'dist/vue/Button.d.ts')
    const fieldInputDtsPath = join(rootDir, 'dist/vue/FieldInput.d.ts')
    const useFormDataDtsPath = join(rootDir, 'dist/vue/useFormData.d.ts')

    expect(existsSync(buttonDtsPath)).toBe(true)
    expect(existsSync(fieldInputDtsPath)).toBe(true)
    expect(existsSync(useFormDataDtsPath)).toBe(true)
    const buttonDts = readFileSync(buttonDtsPath, 'utf8')
    const fieldInputDts = readFileSync(fieldInputDtsPath, 'utf8')
    const useFormDataDts = readFileSync(useFormDataDtsPath, 'utf8')
    expect(buttonDts).toMatch(/export \{ default \} from ['"]\.\.\/components\/Button\/Button\.vue['"]/)
    expect(fieldInputDts).toMatch(/export \{ default \} from ['"]\.\.\/components\/Field\/FieldInput\.vue['"]/)
    expect(useFormDataDts).toMatch(/export \{ useFormData \} from ['"]\.\.\/composables\/form['"]/)
    expect(buttonDts).not.toContain('../index')
    expect(fieldInputDts).not.toContain('../index')
    expect(useFormDataDts).not.toContain('../index')

    for (const entry of Object.values(entries.components)) {
      expect(existsSync(join(rootDir, 'dist/vue', `${entry}.d.ts`))).toBe(true)
    }
    for (const name of entries.composables) {
      expect(existsSync(join(rootDir, 'dist/vue', `${name}.d.ts`))).toBe(true)
    }

    const assembleDist = readFileSync(join(rootDir, 'scripts/assemble-dist.ts'), 'utf8')
    const viteConfig = readFileSync(join(rootDir, 'packages/components/vite.config.ts'), 'utf8')
    const componentsPkg = JSON.parse(readFileSync(join(rootDir, 'packages/components/package.json'), 'utf8')) as {
      scripts: Record<string, string>
    }
    expect(assembleDist).not.toContain('writeVueEntryTypeDeclarations')
    expect(viteConfig).not.toContain('writeVueEntryTypeDeclarations')
    expect(viteConfig).not.toContain('writeVueEntryModules')
    expect(viteConfig).toContain('src/vue/')
    expect(componentsPkg.scripts.build).toContain('generate:vue-entries')
    expect(componentsPkg.scripts.build).toContain('vue-tsc --emitDeclarationOnly')
    expect(componentsPkg.scripts['generate:vue-entries']).toContain('write-vue-entry-modules.ts')

    const require = createRequire(import.meta.url)
    const buttonJs = require.resolve('@webflare/ui/vue/Button')
    expect(buttonJs).toMatch(/dist\/vue\/Button\.cjs$/)
    expect(existsSync(buttonJs.replace(/\.cjs$/, '.d.ts'))).toBe(true)

    const dir = mkdtempSync(join(tmpdir(), 'webflare-ui-vue-types-'))

    try {
      const consumerFile = join(dir, 'consumer.ts')
      mkdirSync(join(dir, 'node_modules/@webflare'), { recursive: true })
      symlinkSync(rootDir, join(dir, 'node_modules/@webflare/ui'), 'dir')
      writeFileSync(join(dir, 'package.json'), JSON.stringify({
        name: 'webflare-ui-vue-types-consumer',
        private: true,
        type: 'module',
      }))
      writeFileSync(consumerFile, `
import Button from '@webflare/ui/vue/Button'
import FieldInput from '@webflare/ui/vue/FieldInput'
import { useFormData } from '@webflare/ui/vue/useFormData'

type PropsOf<C> = C extends abstract new (...args: never) => { $props: infer P } ? P : never

type ButtonLabel = PropsOf<typeof Button>['label']
type FieldInputLabel = PropsOf<typeof FieldInput>['label']
type FieldInputName = PropsOf<typeof FieldInput>['name']

const buttonLabel: ButtonLabel = 'Publish'
const fieldLabel: FieldInputLabel = 'Email'
const fieldName: FieldInputName = 'email'
const form = useFormData(null)

type ButtonLabelAcceptsString = string extends ButtonLabel ? true : false
type FieldLabelAcceptsString = string extends FieldInputLabel ? true : false
type ButtonLabelIsNullOnly = [ButtonLabel] extends [null | undefined] ? true : false

const _buttonLabelOk: ButtonLabelAcceptsString = true
const _fieldLabelOk: FieldLabelAcceptsString = true
const _buttonLabelNotNullOnly: ButtonLabelIsNullOnly = false

void buttonLabel
void fieldLabel
void fieldName
void form
void _buttonLabelOk
void _fieldLabelOk
void _buttonLabelNotNullOnly
`.trimStart())

      const compilerOptions: ts.CompilerOptions = {
        strict: true,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        target: ts.ScriptTarget.ESNext,
        noEmit: true,
        skipLibCheck: true,
        jsx: ts.JsxEmit.Preserve,
      }
      const host = ts.createCompilerHost(compilerOptions)
      const resolved = ts.resolveModuleName(
        '@webflare/ui/vue/Button',
        consumerFile,
        compilerOptions,
        host,
      )
      expect(resolved.resolvedModule?.resolvedFileName).toMatch(/dist\/vue\/Button\.d\.ts$/)

      const program = ts.createProgram([consumerFile], compilerOptions, host)
      const diagnostics = ts.getPreEmitDiagnostics(program)
        .filter(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error)
        .map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))

      expect(diagnostics).toEqual([])
    }
    finally {
      rmSync(dir, { recursive: true, force: true })
    }
    // Builds a TypeScript program over the published .d.ts graph; slow on busy CI runners.
  }, 30_000)

  it('does not minify vue lib identifiers that collide with Vue auto-imports', () => {
    const viteConfig = readFileSync(join(rootDir, 'packages/components/vite.config.ts'), 'utf8')
    expect(viteConfig).toMatch(/minify:\s*false/)

    const heroLead = readBuiltVueModule('HeroLead')
    expect(heroLead).toContain('defineComponent')
    expect(heroLead).not.toMatch(/\bh\s*=/)
  })

  it('emits Vue types with vue-tsc only', () => {
    const viteConfig = readFileSync(join(rootDir, 'packages/components/vite.config.ts'), 'utf8')
    const componentsPkg = JSON.parse(readFileSync(join(rootDir, 'packages/components/package.json'), 'utf8')) as {
      scripts: Record<string, string>
    }
    const rootPkg = JSON.parse(readFileSync(rootPackagePath, 'utf8')) as {
      devDependencies?: Record<string, string>
    }
    const indexDtsPath = join(rootDir, 'packages/components/dist/index.d.ts')

    expect(viteConfig).not.toContain('vite-plugin-dts')
    expect(rootPkg.devDependencies?.['vite-plugin-dts']).toBeUndefined()
    expect(componentsPkg.scripts.build).toContain('vue-tsc --emitDeclarationOnly')
    expect(componentsPkg.scripts.build).toContain('generate:vue-entries')
    expect(existsSync(indexDtsPath)).toBe(true)
    expect(existsSync(join(rootDir, 'packages/components/dist/vue/Button.d.ts'))).toBe(true)
    expect(existsSync(join(rootDir, 'packages/components/dist/AccordionRoot.d.ts'))).toBe(false)

    const indexDts = readFileSync(indexDtsPath, 'utf8')
    const vueComponentsDts = readFileSync(
      join(rootDir, 'packages/components/dist/vue-components.d.ts'),
      'utf8',
    )
    expect(indexDts).toContain('./vue-components')
    expect(indexDts).not.toContain('.vue.js')
    expect(indexDts).toContain('FieldOption')
    expect(indexDts).toContain('export { default as Alert }')
    expect(indexDts).toContain('export { default as Badge }')
    expect(indexDts).toContain('export { default as Tab }')
    expect(vueComponentsDts).toContain('AlertRoot')
    expect(vueComponentsDts).toContain('BadgeRoot')
    expect(vueComponentsDts).toContain('TabRoot')
    expect(vueComponentsDts).not.toMatch(/Alert as AlertRoot/)
    expect(vueComponentsDts).not.toMatch(/BadgeRoot as Badge/)
    expect(vueComponentsDts).not.toMatch(/Tab as TabRoot/)
    expect(indexDts).not.toMatch(/\bControlInput\b/)
    expect(indexDts).not.toMatch(/\bfieldContextKey\b/)
    expect(indexDts).not.toMatch(/export \{ default as Control \}/)
    expect(indexDts).not.toMatch(/\bControlSize\b/)
  })

  it('publishes from GitHub Actions with npm trusted publishing', () => {
    const workflow = readFileSync(
      join(rootDir, '.github/workflows/publish.yml'),
      'utf8',
    )

    expect(workflow).toContain('id-token: write')
    expect(workflow).toContain('npm publish --access public --ignore-scripts')
    expect(workflow).not.toContain('NPM_TOKEN')
    expect(workflow).not.toContain('_authToken')
    expect(workflow).not.toContain('bun publish')
  })

  it('runs lint, build, and test on pull requests', () => {
    const workflow = readFileSync(
      join(rootDir, '.github/workflows/ci.yml'),
      'utf8',
    )

    expect(workflow).toContain('pull_request')
    expect(workflow).toContain('bun run lint')
    expect(workflow).toContain('bun run build')
    expect(workflow).toContain('bun run test')
    expect(workflow).not.toContain('test:types')
  })

  it('reads the published package version from @webflare/ui/package.json', () => {
    const moduleSrc = readFileSync(join(rootDir, 'packages/nuxt/src/module.ts'), 'utf8')
    const builtModule = readFileSync(join(rootDir, 'dist/nuxt/module.mjs'), 'utf8')
    const rootPkg = JSON.parse(readFileSync(rootPackagePath, 'utf8')) as { version: string }

    expect(moduleSrc).toContain('@webflare/ui/package.json')
    expect(moduleSrc).not.toContain('new URL(\'../package.json\'')
    expect(builtModule).toContain('@webflare/ui/package.json')
    expect(rootPkg.version).toMatch(/^\d+\.\d+\.\d+/)
  })

  it('does not pack preset codegen folders', () => {
    expect(pkg.files).toEqual([
      'dist',
      'LICENSE',
      'README.md',
    ])
    expect(pkg.files.some(entry => entry.startsWith('packages/preset/css'))).toBe(false)
  })
})

describe('packed install exports', () => {
  it('resolves public subpaths from an installed tarball', () => {
    expect(existsSync(join(rootDir, 'dist/style.css'))).toBe(true)
    expect(existsSync(join(rootDir, 'dist/nuxt/module.mjs'))).toBe(true)

    const dir = mkdtempSync(join(tmpdir(), 'webflare-ui-pack-'))

    try {
      execFileSync('npm', ['pack', '--ignore-scripts', `--pack-destination=${dir}`], {
        cwd: rootDir,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      })

      const { version: packedVersion } = JSON.parse(readFileSync(rootPackagePath, 'utf8')) as { version: string }
      const tarball = join(dir, `webflare-ui-${packedVersion}.tgz`)
      expect(existsSync(tarball)).toBe(true)

      const packedFiles = execFileSync('tar', ['-tzf', tarball], { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean)

      expect(packedFiles).toContain('package/dist/style.css')
      expect(packedFiles).toContain('package/dist/panda/lib.json')
      expect(packedFiles).toContain('package/dist/panda/preset.mjs')
      expect(packedFiles).toContain('package/dist/panda/buildinfo.json')
      expect(packedFiles).toContain('package/dist/styled-system/css/index.js')
      expect(packedFiles).not.toContain('package/dist/panda.buildinfo.json')

      const packedLib = JSON.parse(execFileSync('tar', ['-xOf', tarball, 'package/dist/panda/lib.json'], {
        encoding: 'utf8',
      })) as { files?: string[] }
      expect(packedLib.files?.length).toBeGreaterThan(0)
      for (const file of packedLib.files ?? []) {
        expect(
          libFallbackInTarball(file, packedFiles),
          `packed tarball must contain panda lib fallback file ${file}`,
        ).toBe(true)
      }
      expect(packedFiles).toContain('package/dist/preset/index.js')
      expect(packedFiles).toContain('package/dist/nuxt/module.mjs')
      expect(packedFiles).toContain('package/dist/vue/Button.js')
      expect(packedFiles).toContain('package/dist/vue/Button.d.ts')
      expect(packedFiles).toContain('package/dist/vue/FieldInput.d.ts')
      expect(packedFiles).toContain('package/dist/vue/useFormData.d.ts')
      expect(packedFiles).toContain('package/dist/index.d.ts')
      expect(packedFiles).toContain('package/dist/nuxt-entries.json')
      expect(packedFiles).not.toContain('package/dist/AccordionRoot.d.ts')
      expect(packedFiles.some(file => file.startsWith('package/packages/'))).toBe(false)
      expect(packedFiles).not.toContain('package/dist/ui-components.css')
      expect(packedFiles).not.toContain('package/dist/panda.buildinfo.json.map')
      expect(packedFiles.some(file => file.endsWith('.d.ts.map'))).toBe(false)
      expect(packedFiles).not.toContain('package/dist/nuxt/runtime/server/tsconfig.json')
      expect(packedFiles.some(file => file.includes('packages/preset/types/csstype'))).toBe(false)
      expect(packedFiles.some(file => file.startsWith('package/packages/preset/css/'))).toBe(false)

      const packedModule = execFileSync('tar', ['-xOf', tarball, 'package/dist/nuxt/module.mjs'], {
        encoding: 'utf8',
      })
      expect(packedModule).toContain('@webflare/ui/package.json')

      const consumer = join(dir, 'consumer')
      mkdirSync(consumer)
      writeFileSync(join(consumer, 'package.json'), JSON.stringify({
        name: 'webflare-ui-consumer',
        private: true,
        type: 'module',
      }))

      execFileSync('npm', ['install', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund', tarball], {
        cwd: consumer,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      })

      const specifiers = [
        '@webflare/ui',
        '@webflare/ui/components',
        '@webflare/ui/design-preset',
        '@webflare/ui/preset',
        '@webflare/ui/nuxt',
        '@webflare/ui/nuxt-entries.json',
        '@webflare/ui/vue/Button',
        '@webflare/ui/style.css',
        '@webflare/ui/panda/lib.json',
        '@webflare/ui/css',
      ]
      writeFileSync(
        join(consumer, 'resolve.mjs'),
        `${specifiers.map(specifier => `console.log(${JSON.stringify(specifier)} + '\\t' + import.meta.resolve(${JSON.stringify(specifier)}))`).join('\n')}\n`,
      )

      const resolved = Object.fromEntries(
        execFileSync(process.execPath, ['resolve.mjs'], {
          cwd: consumer,
          encoding: 'utf8',
        })
          .trim()
          .split('\n')
          .map((line) => {
            const [specifier, url] = line.split('\t')
            return [specifier, url]
          }),
      ) as Record<string, string>

      expect(resolved['@webflare/ui']).toMatch(/index\.(js|cjs)$/)
      expect(resolved['@webflare/ui/components']).toMatch(/index\.(js|cjs)$/)
      expect(resolved['@webflare/ui/design-preset']).toMatch(/index\.(js|cjs)$/)
      expect(resolved['@webflare/ui/preset']).toMatch(/index\.(js|cjs)$/)
      expect(resolved['@webflare/ui/nuxt']).toMatch(/module\.mjs$/)
      expect(resolved['@webflare/ui/nuxt-entries.json']).toMatch(/nuxt-entries\.json$/)
      expect(resolved['@webflare/ui/vue/Button']).toMatch(/vue\/Button\.js$/)
      expect(resolved['@webflare/ui/style.css']).toMatch(/style\.css$/)
      expect(resolved['@webflare/ui/panda/lib.json']).toMatch(/panda\/lib\.json$/)
      expect(resolved['@webflare/ui/css']).toMatch(/styled-system\/css/)
    }
    finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }, 120_000)
})
