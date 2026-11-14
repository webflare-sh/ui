/**
 * Add the changelog entry for the version in package.json, generated from the
 * conventional commits since the previous release tag.
 *
 *   bun run changelog          # prepend the entry to CHANGELOG.md
 *   bun run changelog --dry    # print the entry only
 *
 * The 0.1.0 entry is written by hand. This script refuses to run until a
 * `v0.1.0` tag exists, and the range always starts at a release tag that
 * already contains the imported history, so that history never shows up.
 *
 * It needs the full history: in a shallow clone the imported commit is
 * missing, and the script stops with git's error.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateMarkDown, getGitDiff, loadChangelogConfig, parseCommits } from 'changelogen'

/** Last commit of the imported history. Every release tag must contain it. */
export const IMPORTED_HEAD = 'a895222dc1f6b798c02792c530a79249f24000d1'

/** The first release. Its changelog entry is written by hand. */
export const FIRST_RELEASE = '0.1.0'

type Semver = [number, number, number]

function parseVersion(version: string): Semver | undefined {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(version)
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : undefined
}

function compareVersions(a: Semver, b: Semver): number {
  return a[0] - b[0] || a[1] - b[1] || a[2] - b[2]
}

function git(cwd: string, ...args: string[]): string {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
}

function isAncestor(cwd: string, ancestor: string, commit: string): boolean {
  try {
    git(cwd, 'merge-base', '--is-ancestor', ancestor, commit)
    return true
  }
  catch (error) {
    // Exit code 1 means "not an ancestor". Anything else is a git error, such
    // as a commit missing from a shallow clone.
    const { status, stderr } = error as { status?: number | null, stderr?: unknown }
    if (status === 1) return false
    const detail = String(stderr ?? '').trim()
    throw new Error(
      `git merge-base --is-ancestor ${ancestor} ${commit} failed${detail ? `: ${detail}` : ''}. `
      + 'A shallow clone does not have the imported history: run `git fetch --unshallow --tags` first.',
      { cause: error },
    )
  }
}

/**
 * The newest `vX.Y.Z` tag reachable from HEAD that is older than `version`
 * and not older than the first release.
 */
export function findPreviousReleaseTag(cwd: string, version: string, importedHead = IMPORTED_HEAD): string {
  const current = parseVersion(version)
  const first = parseVersion(FIRST_RELEASE)!
  if (!current) {
    throw new Error(`package.json version ${version} is not X.Y.Z`)
  }
  if (compareVersions(current, first) <= 0) {
    throw new Error(`The ${FIRST_RELEASE} changelog entry is written by hand. Bump package.json first.`)
  }

  const tags = git(cwd, 'tag', '--list', 'v*', '--merged', 'HEAD')
    .split('\n')
    .map(tag => ({ tag, version: parseVersion(tag) }))
    .filter((entry): entry is { tag: string, version: Semver } => entry.version !== undefined)
    .filter(entry => compareVersions(entry.version, first) >= 0 && compareVersions(entry.version, current) < 0)
    .sort((a, b) => compareVersions(b.version, a.version))

  const previous = tags[0]?.tag
  if (!previous) {
    throw new Error(`No release tag between v${FIRST_RELEASE} and v${version} is reachable from HEAD. Tag v${FIRST_RELEASE} first.`)
  }
  if (!isAncestor(cwd, importedHead, previous)) {
    throw new Error(`${previous} does not contain the imported history (${importedHead}). Refusing to generate.`)
  }
  return previous
}

async function main() {
  const rootDir = fileURLToPath(new URL('..', import.meta.url))
  const dry = process.argv.includes('--dry')
  const { version } = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8')) as { version: string }
  const from = findPreviousReleaseTag(rootDir, version)

  const config = await loadChangelogConfig(rootDir, { from, to: 'HEAD', newVersion: version })
  const commits = parseCommits(await getGitDiff(from, 'HEAD', rootDir), config)
  const markdown = await generateMarkDown(commits, config)

  if (dry) {
    console.log(markdown)
    return
  }

  const file = join(rootDir, 'CHANGELOG.md')
  const existing = existsSync(file) ? readFileSync(file, 'utf8') : '# Changelog\n\n'
  if (new RegExp(`^## v?${version.replaceAll('.', '\\.')}\\b`, 'm').test(existing)) {
    throw new Error(`CHANGELOG.md already has an entry for ${version}`)
  }
  const firstEntry = /^## /m.exec(existing)
  const updated = firstEntry
    ? `${existing.slice(0, firstEntry.index)}${markdown}\n\n${existing.slice(firstEntry.index)}`
    : `${existing.trimEnd()}\n\n${markdown}\n`
  writeFileSync(file, updated)
  console.log(`CHANGELOG.md: added ${version} (${from}...HEAD, ${commits.length} commits)`)
}

if (import.meta.main) {
  await main()
}
