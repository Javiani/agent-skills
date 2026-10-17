# import-js

Load a classic script on demand.

`importJs(url, { async = true } = {})` creates a script in the head and returns a promise for `load`/`error`.

```js
import { importJs } from 'jails.stdlib/import-js'

await importJs('/assets/gallery.js')
```

This is not an ESM `import()`: it does not return exports, set `type="module"`, deduplicate, or remove scripts. Await each load when dependencies require ordering. The runtime accepts `async: false`, but the local type declares only `async?: true`; resolve this discrepancy in the project before providing a TypeScript example with `false`.

## Sources

Based on the review of `src/import-js/index.ts`, `index.js`, `index.d.ts`, and `src/import-js/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
