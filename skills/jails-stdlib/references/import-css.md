# import-css

Load a stylesheet on demand.

`importCss(url, options = null)` creates `<link rel="stylesheet">` in the head and returns a promise resolved by `load` or rejected by `error`. `options` exists in the code but is ignored.

```js
import { importCss } from 'jails.stdlib/import-css'

await importCss('/assets/gallery.css')
```

It does not return the link directly, deduplicate, remove resources, or provide a timeout. Cache the promise in the consuming service if the resource should load only once. Requires `document`.

## Sources

Based on the review of `src/import-css/index.ts`, `index.js`, `index.d.ts`, and `src/import-css/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
