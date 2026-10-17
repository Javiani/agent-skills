# router

Map URLs to handlers.

Exports `Router`, an alias of Grapnel (dependency pinned to `0.6.4`) with no additional layer.

```js
import { Router } from 'jails.stdlib/router'

const router = new Router({ pushState: true })
router.get('/products/:id', (request) => console.log(request.params.id))
router.navigate('/products/42')
```

Without `pushState`, it uses hash routes. `get(path, ...middleware, callback)` registers handlers; middleware receives `(request, event, next)` and must call `next()` to continue. `root` and `hashBang` are Grapnel options. It does not render components or HTML automatically: connect the handler to the existing rendering mechanism. With pushState, the server must support direct access to routes. Consult the installed version’s source/README for events and removal; do not invent a `destroy` method.

## Sources

Based on the review of `src/router/index.ts`, `index.js`, `index.d.ts`, and `src/router/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
