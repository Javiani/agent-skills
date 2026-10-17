# lazyload-image

Load images near the viewport.

Exports `Lazyload` (with this capitalization), an alias of the `vanilla-lazyload` default export with no custom adapter. The declared dependency is `^19.1.3`; check the installed version for additional options.

```js
import { Lazyload } from 'jails.stdlib/lazyload-image'

const images = new Lazyload({ elements_selector: 'img[data-src]' })
// After inserting new images: images.update()
// When disposing of the instance: images.destroy()
```

```html
<img data-src="/images/product.webp" alt="Product" width="640" height="480">
```

Create the instance after the relevant DOM exists. `update` and `destroy` belong to the dependency. Consult its installed types and README for callbacks, containers, backgrounds, and cleanup behavior. Do not confuse the exported `Lazyload` with `LazyLoad` in the dependency’s examples.

## Sources

Based on the review of `src/lazyload-image/index.ts`, `index.js`, `index.d.ts`, and `src/lazyload-image/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
