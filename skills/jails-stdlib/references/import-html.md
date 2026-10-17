# import-html

Fetch HTML without rendering it.

`importHtml(url, config?)` accepts `fetch` options and returns `Promise<{ response, html }>`.

```js
import { importHtml } from 'jails.stdlib/import-html'

const { response, html } = await importHtml('/fragment.html')
if (!response.ok) throw new Error(`HTTP ${response.status}`)
```

It does not check `response.ok`, insert DOM, or execute scripts. The promise resolves to a single object, not two arguments. Pass an `AbortSignal` through `config` when needed. Before rendering, establish DOM ownership and content trust; the module does not sanitize HTML.

## Sources

Based on the review of `src/import-html/index.ts`, `index.js`, `index.d.ts`, and `src/import-html/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
