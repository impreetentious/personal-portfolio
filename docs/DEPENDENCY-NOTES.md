# Dependency notes

The dependency tree is verified from a clean `npm ci`. These overrides exist for compatibility or transitive security fixes that upstream packages have not yet released together.

- `skills@1.5.22`, pulled by the Sanity CLI, requires Node 22.20 or newer. The same minimum is enforced by `package.json`; `.nvmrc` and CI use Node 22.22.0.
- `@sanity/uuid` remains on the compatible 3.0.x line. `typeid-js` receives `uuid` 11 because it uses CommonJS APIs that remain available on that line.
- `@module-federation/dts-plugin` 2.8.2 updates its nested archive and HTTP clients without changing the surrounding Sanity workbench API.
- `minimatch` 3 and 10 receive the patched `brace-expansion` releases appropriate to their incompatible CommonJS APIs.
- `dompurify`, `nanoid`, `postcss`, `sharp`, and `smol-toml` are pinned to patched transitive releases.
- `@vercel/frameworks` still declares `js-yaml` 3 and calls the removed `safeLoad` API. The override supplies `js-yaml` 5.2.3, while `patches/@vercel+frameworks+3.29.0.patch` changes that single call to `load`, the safe replacement in modern js-yaml. `patch-package` reapplies the change after every install.

Re-run `npm audit --audit-level=high`, `npm ls --all`, and the full verification suite when changing any override.
