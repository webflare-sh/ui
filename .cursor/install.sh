#!/usr/bin/env bash
set -euo pipefail

# Idempotent bootstrap for the @webflare/ui Bun workspace.
# Safe to run repeatedly and against cached/partial state.

cd "$(dirname "$0")/.."

# 1. Install Bun (the repo's package manager + build tool) if missing.
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
if ! command -v bun >/dev/null 2>&1; then
  curl -fsSL https://bun.sh/install | bash
fi

# Expose bun/bunx on the system PATH so every phase (install, start,
# terminals) and interactive shell can find it regardless of shell profile.
if command -v sudo >/dev/null 2>&1 && sudo -n true 2>/dev/null; then
  sudo ln -sf "$BUN_INSTALL/bin/bun" /usr/local/bin/bun
  sudo ln -sf "$BUN_INSTALL/bin/bunx" /usr/local/bin/bunx
fi

# 2. Install workspace dependencies from the committed lockfile.
bun install --frozen-lockfile

# 3. Build the publishable packages (preset, components, Nuxt module) and
#    assemble root dist/. The playground panda config and Nuxt module resolve
#    @webflare/ui exports from that dist. `build:nuxt` (prepack) already runs
#    `nuxt-module-build prepare`, so packages/nuxt/.nuxt/tsconfig.json is
#    generated here.
#
#    Do not run `dev:nuxt:prepare` on a clean tree: it calls assemble-dist
#    before packages/components/dist exists. After a real build it would also
#    stub the module (`nuxt-module-build build --stub`) and overwrite prepack
#    output.
bun run build

# 4. Generate playground Nuxt types (.nuxt) from the built package.
#    Run nuxi prepare only — not the full module `dev:prepare`, which stubs
#    the just-built module. Disable telemetry so nuxi cannot hang on the
#    first-run consent prompt in a non-interactive Cloud Agent install.
(cd packages/nuxt && NUXT_TELEMETRY_DISABLED=1 bunx nuxi prepare playground)

# 5. Generate the playground's Panda styled-system codegen so the dev server
#    can resolve `styled-system/*` imports.
(cd packages/nuxt/playground && bun run prepare)
