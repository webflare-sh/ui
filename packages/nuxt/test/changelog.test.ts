import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { findPreviousReleaseTag } from '../../../scripts/changelog.ts'

describe('changelog range', () => {
  let dir: string
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
})
