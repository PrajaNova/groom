
---
name: Next.js Development Guide
description:
  use this skill for any developmtmet task this ui porject
---


# Next.js Development Guide=

## Codebase structure

### Monorepo Overview

This is a pnpm monorepo containing the Next.js framework and related packages.

```
next.js/
├── packages/           # Published npm packages
├── turbopack/          # Turbopack bundler (Rust) - git subtree
├── crates/             # Rust crates for Next.js SWC bindings
├── test/               # All test suites
├── examples/           # Example Next.js applications
├── docs/               # Documentation
└── scripts/            # Build and maintenance scripts
```

### Core Package: `packages/next`

The main Next.js framework lives in `packages/next/`. This is what gets published as the `next` npm package.

**Source code** is in `packages/next/src/`.

**Key entry points:**

- Dev server: `src/cli/next-dev.ts` → `src/server/dev/next-dev-server.ts`
- Production server: `src/cli/next-start.ts` → `src/server/next-server.ts`
- Build: `src/cli/next-build.ts` → `src/build/index.ts`

**Compiled output** goes to `packages/next/dist/` (mirrors src/ structure).

### Other Important Packages

- `packages/create-next-app/` - The `create-next-app` CLI tool
- `packages/next-swc/` - Native Rust bindings (SWC transforms)
- `packages/eslint-plugin-next/` - ESLint rules for Next.js
- `packages/font/` - `next/font` implementation
- `packages/third-parties/` - Third-party script integrations

### README files

Before editing or creating files in any subdirectory (e.g., `packages/*`, `crates/*`), read all `README.md` files in the directory path from the repo root up to and including the target file's directory. This helps identify any local patterns, conventions, and documentation.

**Example:** Before editing `turbopack/crates/turbopack-ecmascript-runtime/js/src/nodejs/runtime/runtime-base.ts`, read:

- `turbopack/README.md` (if exists)
- `turbopack/crates/README.md` (if exists)
- `turbopack/crates/turbopack-ecmascript-runtime/README.md` (if exists)
- `turbopack/crates/turbopack-ecmascript-runtime/js/README.md` (if exists - closest to target file)

## Build Commands

```bash
# Build the Next.js package
pnpm --filter=next build

# Build all JS code
pnpm build

# Build all JS and Rust code
pnpm build-all

# Run specific task
pnpm --filter=next exec taskr <task>
```

## Fast Local Development

For iterative development, default to watch mode + skip-isolate for the inner loop (not full builds), with exceptions noted below.

**Default agent rule:** If you are changing Next.js source or integration tests, start `pnpm --filter=next dev` in a separate terminal session before making edits (unless it is already running). If you skip this, explicitly state why (for example: docs-only, read-only investigation, or CI-only analysis).

**1. Start watch build in background:**

```bash
# Auto-rebuilds on file changes (~1-2s per change vs ~60s full build)
# Keep this running while you iterate on code
pnpm --filter=next dev
```

**2. Run tests fast (no isolation, no packing):**

```bash
# NEXT_SKIP_ISOLATE=1 - skip packing Next.js for each test (~100s faster)
# NEXT_TEST_MODE=<mode> - run dev or start based on the context provided
# testheadless - runs headless with --runInBand (no worker isolation overhead)
NEXT_SKIP_ISOLATE=1 NEXT_TEST_MODE=<dev|start> pnpm testheadless test/path/to/test.ts
```

**3. When done, kill the background watch process (if you started it).**

**For type errors only:** Use `pnpm --filter=next types` (~10s) instead of `pnpm --filter=next build` (~60s).

After the workspace is bootstrapped, prefer `pnpm --filter=next build` when edits are limited to core Next.js files. Use full `pnpm build-all` for branch switches/bootstrap, before CI push, or when changes span multiple packages.

**Always run a full bootstrap build after switching branches:**

```bash
git checkout <branch>
pnpm build-all   # Sets up outputs for dependent packages (Turborepo dedupes if unchanged)
```

**When NOT to use NEXT_SKIP_ISOLATE:** Drop it when testing module resolution changes (new require() paths, new exports from entry-base.ts, edge route imports). Without isolation, the test uses local dist/ directly, hiding resolution failures that occur when Next.js is packed as a real npm package.

## Bundler Selection

Turbopack is the default bundler for both `next dev` and `next build`. To force webpack:

```bash
next build --webpack        # Production build with webpack
next dev --webpack          # Dev server with webpack
```

There is no `--no-turbopack` flag.

## Testing

```bash
# Run specific test file (development mode with Turbopack)
pnpm test-dev-turbo test/path/to/test.test.ts

# Run tests matching pattern
pnpm test-dev-turbo -t "pattern"

# Run development tests
pnpm test-dev-turbo test/development/
```

**Test commands by mode:**

- `pnpm test-dev-turbo` - Development mode with Turbopack (default)
- `pnpm test-dev-webpack` - Development mode with Webpack
- `pnpm test-start-turbo` - Production build+start with Turbopack
- `pnpm test-start-webpack` - Production build+start with Webpack

**Other test commands:**

- `pnpm test-unit` - Run unit tests only (fast, no browser)
- `pnpm testheadless <path>` - Run tests headless without rebuilding (faster iteration when build artifacts are already up to date)
- `pnpm new-test` - Generate a new test file from template (interactive)

**Generate tests non-interactively (for AI agents):**

Generating tests using `pnpm new-test` is mandatory.

```bash
# Use --args for non-interactive mode (forward args to the script using `--`)
# Format: pnpm new-test -- --args <appDir> <name> <type>
# appDir: true/false (is this for app directory?)
# name: test name (e.g. "my-feature")
# type: e2e | production | development | unit

pnpm new-test -- --args true my-feature e2e
```

**Analyzing test output efficiently:**

Never re-run the same test suite with different grep filters. Capture output once to a file, then read from it:

```bash
# Run once, save everything
HEADLESS=true pnpm test-dev-turbo test/path/to/test.ts > /tmp/test-output.log 2>&1

# Then analyze without re-running
grep "●" /tmp/test-output.log            # Failed test names
grep -A5 "Error:" /tmp/test-output.log   # Error details
tail -5 /tmp/test-output.log             # Summary
```

## Writing Tests

**Test writing expectations:**

- **Use `pnpm new-test` to generate new test suites** - it creates proper structure with fixture files

- **Use `retry()` from `next-test-utils` instead of `setTimeout` for waiting**

  ```typescript
  // Good - use retry() for polling/waiting
  import { retry } from 'next-test-utils'
  await retry(async () => {
    const text = await browser.elementByCss('p').text()
    expect(text).toBe('expected value')
  })

  // Bad - don't use setTimeout for waiting
  await new Promise((resolve) => setTimeout(resolve, 1000))
  ```

- **Do NOT use `check()` - it is deprecated. Use `retry()` + `expect()` instead**

  ```typescript
  // Deprecated - don't use check()
  await check(() => browser.elementByCss('p').text(), /expected/)

  // Good - use retry() with expect()
  await retry(async () => {
    const text = await browser.elementByCss('p').text()
    expect(text).toMatch(/expected/)
  })
  ```

- **Prefer real fixture directories over inline `files` objects**

  ```typescript
  // Good - use a real directory with fixture files
  const { next } = nextTestSetup({
    files: __dirname, // points to directory containing test fixtures
  })

  // Avoid - inline file definitions are harder to maintain
  const { next } = nextTestSetup({
    files: {
      'app/page.tsx': `export default function Page() { ... }`,
    },
  })
  ```

## Linting and Types

```bash
pnpm lint              # Full lint (types, prettier, eslint, ast-grep)
pnpm lint-fix          # Auto-fix lint issues
pnpm prettier-fix      # Fix formatting only
pnpm types             # TypeScript type checking
```

## PR Status (CI Failures and Reviews)

When the user asks about CI failures, PR reviews, or the status of a PR, run the pr-status script:

```bash
node scripts/pr-status.js           # Auto-detects PR from current branch
node scripts/pr-status.js <number>  # Analyze specific PR by number
```

This generates analysis files in `scripts/pr-status/`.

General triage rules (always apply; `$pr-status-triage` skill expands on these):

- Prioritize blocking failures first: build, lint, types, then tests.
- Assume failures are real until disproven; use "Known Flaky Tests" as context, not auto-dismissal.
- Reproduce with the same CI mode/env vars (especially `IS_WEBPACK_TEST=1` when present).
- For module-resolution/build-graph fixes, verify without `NEXT_SKIP_ISOLATE=1`.

For full triage workflow (failure prioritization, mode selection, CI env reproduction, and common failure patterns), use the `$pr-status-triage` skill:

- Skill file: `.agents/skills/pr-status-triage/SKILL.md`

**Use `$pr-status-triage` for automated analysis** - see `.agents/skills/pr-status-triage/SKILL.md` for the full step-by-step workflow.

**CI Analysis Tips:**

- Prioritize CI failures over review comments
- Prioritize blocking jobs first: build, lint, types, then test jobs
- Common fast checks:
  - `rust check / build` → Run `cargo fmt -- --check`, then `cargo fmt`
  - `lint / build` → Run `pnpm prettier --write <file>` for prettier errors
  - test failures → Run the specific failing test path locally

**Run tests in the right mode:**

```bash
# Dev mode (Turbopack)
pnpm test-dev-turbo test/path/to/test.ts

# Prod mode
pnpm test-start-turbo test/path/to/test.ts
```

## PR Descriptions

When writing PR descriptions, you MUST include the following HTML comment at the bottom of the description:

```
<!-- NEXT_JS_LLM_PR -->
```

## Key Directories (Quick Reference)

See [Codebase structure](#codebase-structure) above for detailed explanations.

- `packages/next/src/` - Main Next.js source code
- `packages/next/src/server/` - Server runtime (most changes happen here)
- `packages/next/src/client/` - Client-side runtime
- `packages/next/src/build/` - Build tooling
- `test/e2e/` - End-to-end tests
- `test/development/` - Dev server tests
- `test/production/` - Production build tests
- `test/unit/` - Unit tests (fast, no browser)

## Development Tips

- The dev server entry point is `packages/next/src/cli/next-dev.ts`
- Router server: `packages/next/src/server/lib/router-server.ts`
- Use `DEBUG=next:*` for debug logging
- Use `NEXT_TELEMETRY_DISABLED=1` when testing locally

### `NODE_ENV` vs `__NEXT_DEV_SERVER`

Both `next dev` and `next build --debug-prerender` produce bundles with `NODE_ENV=development`. Use `process.env.__NEXT_DEV_SERVER` to distinguish between them:

- `process.env.NODE_ENV !== 'production'` — code that should exist in dev bundles but be eliminated from prod bundles. This is a build-time check.
- `process.env.__NEXT_DEV_SERVER` — code that should only run with the dev server (`next dev`), not during `next build --debug-prerender` or `next start`.

## Secrets and Env Safety

Always treat environment variable values as sensitive unless they are known test-mode flags.

- Never print or paste secret values (tokens, API keys, cookies) in chat responses, commits, or shared logs.
- Mirror CI env **names and modes** exactly, but do not inline literal secret values in commands.
- If a required secret is missing locally, stop and ask the user rather than inventing placeholder credentials.
- Never commit local secret files; if documenting env setup, use placeholder-only examples.
- When sharing command output, summarize and redact sensitive-looking values.

## Specialized Skills

Use skills for conditional, deep workflows. Keep baseline iteration/build/test policy in this file.

- `$pr-status-triage` - CI failure and PR review triage with `scripts/pr-status.js`
- `$flags` - feature-flag wiring across config/schema/define-env/runtime env
- `$dce-edge` - DCE-safe `require()` patterns and edge/runtime constraints
- `$reac
