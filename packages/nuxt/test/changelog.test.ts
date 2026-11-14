import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { findPreviousReleaseTag, IMPORTED_HEAD } from '../../../scripts/changelog.ts'

describe('imported head', () => {
  it('is a full SHA, so a later object cannot make it ambiguous', () => {
    expect(IMPORTED_HEAD).toMatch(/^[0-9a-f]{40}$/)
  })

  it('is the commit the token snapshot was taken from', () => {
    const snapshot = JSON.parse(readFileSync(new URL('./fixtures/tokens/imported-tokens.json', import.meta.url), 'utf8')) as { source: { commit: string } }
    expect(IMPORTED_HEAD.startsWith(snapshot.source.commit)).toBe(true)
  })
})

describe('changelog range', () => {
  let dir: string
  let shallow: string | undefined
  let importedHead: string

  const git = (...args: string[]) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' }).trim()
  const commit = (message: string) => {
    git('commit', '--allow-empty', '-q', '-m', message)
    return git('rev-parse', 'HEAD')
  }

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'webflare-ui-changelog-'))
    git('init', '-q', '-b', 'master')
    git('config', 'user.email', 'test@example.com')
    git('config', 'user.name', 'Test')
    git('config', 'commit.gpgsign', 'false')
    git('config', 'tag.gpgsign', 'false')
    commit('feat: imported work')
    git('tag', 'v0.5.0')
    importedHead = commit('feat!: last imported commit')
    commit('feat!: rename')
  })

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
    if (shallow) rmSync(shallow, { recursive: true, force: true })
    shallow = undefined
  })

  it('refuses to run for the hand-written first release', () => {
    expect(() => findPreviousReleaseTag(dir, '0.1.0', importedHead)).toThrow(/written by hand/)
  })

  it('refuses to run before v0.1.0 exists', () => {
    expect(() => findPreviousReleaseTag(dir, '0.1.1', importedHead)).toThrow(/Tag v0\.1\.0 first/)
  })

  it('ignores imported tags older than the first release', () => {
    git('tag', 'v0.4.0', importedHead)
    expect(() => findPreviousReleaseTag(dir, '0.1.1', importedHead)).toThrow(/Tag v0\.1\.0 first/)
  })

  it('starts at v0.1.0 for 0.1.1', () => {
    git('tag', 'v0.1.0')
    commit('fix: something')
    expect(findPreviousReleaseTag(dir, '0.1.1', importedHead)).toBe('v0.1.0')
  })

  it('starts at the previous release tag, not at v0.1.0', () => {
    git('tag', 'v0.1.0')
    commit('fix: something')
    git('tag', 'v0.1.1')
    commit('feat: more')
    git('tag', 'v0.2.0')
    commit('fix: later')
    expect(findPreviousReleaseTag(dir, '0.2.1', importedHead)).toBe('v0.2.0')
    expect(findPreviousReleaseTag(dir, '0.2.0', importedHead)).toBe('v0.1.1')
  })

  it('refuses a release tag that does not contain the imported history', () => {
    git('checkout', '-q', '--orphan', 'other')
    commit('chore: unrelated root')
    git('tag', 'v0.1.0')
    expect(() => findPreviousReleaseTag(dir, '0.1.1', importedHead)).toThrow(/does not contain the imported history/)
  })

  it('reports a shallow clone as a git error, not as a tag without the imported history', () => {
    git('tag', 'v0.1.0')
    shallow = mkdtempSync(join(tmpdir(), 'webflare-ui-changelog-shallow-'))
    // A file:// URL, because --depth is ignored for a plain local path.
    execFileSync('git', ['clone', '-q', '--depth', '1', pathToFileURL(dir).href, shallow])
    const run = () => findPreviousReleaseTag(shallow!, '0.1.1', importedHead)
    expect(run).toThrow(/failed: .*Not a valid commit name.*shallow clone/s)
    expect(run).not.toThrow(/does not contain the imported history/)
  })

  it('reports an unknown imported head as a git error', () => {
    git('tag', 'v0.1.0')
    const run = () => findPreviousReleaseTag(dir, '0.1.1', '0'.repeat(40))
    expect(run).toThrow(/git merge-base --is-ancestor 0{40} v0\.1\.0 failed: .*Not a valid commit name/s)
    expect(run).not.toThrow(/does not contain the imported history/)
  })
})
