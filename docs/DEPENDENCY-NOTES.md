# Dependency Notes

- `node_modules` can lag the lockfile after dependency edits; run `npm ci` before trusting `npm ls` output for dependency triage.
- `whatwg-encoding` is deprecated at its latest published release. It is removable only when upstream packages stop depending on it.
- The UUID override chain keeps `@sanity/uuid` at `~3.0.2` and `typeid-js`'s nested `uuid` at `~11.1.0` because `@sanity/preview-url-secret` pins `@sanity/uuid@3.0.2` exactly, while `typeid-js` uses CommonJS `require("uuid")` with `.v7`, `.stringify`, and `.parse`, all still exported by uuid 11.
