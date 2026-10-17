# outlet

Render remote pages into a region and restore its content.

`Outlet({ target })` captures the initial HTML and a clone of the head, marking current scripts/links/styles with `im-preserve`. Uses Idiomorph (`^0.7.2`).

```js
import { Outlet } from 'jails.stdlib/outlet'

const target = document.querySelector('[data-outlet]')
const outlet = Outlet({ target })
await outlet.render('https://remote.example/page')
await outlet.render() // Restore the head and initial content.
```

`render(url?)` fetches a full document, moves scripts/links/styles from the body into the remote head, morphs the head, and replaces the target’s HTML. It resolves with the target after `allSettled` for added scripts; script failure does not imply rejection, and CSS is not awaited. HTTP status is not checked. The URL must be absolute (`new URL(path)` without a base). It rewrites src/href values starting with `/` to the remote origin, but does not normalize all relative paths or body resources.

`renderJS(name, path)` places `<name>` in the target and adds a script with `name="outlet-script"`; it resolves with the target on load and rejects with a generic string on error. `renderJS()` restores the content and removes the first marked script; it throws if none exists. Do not accumulate calls assuming deduplication.

This integration changes the global head and executes remote scripts without isolation, sanitization, or its own unmount handling. Use trusted content, appropriate CORS, and explicit target ownership (in Jails, an `html-static` region where appropriate). Script loading does not guarantee that the remote application has mounted; establish a readiness signal if needed. The correct export is `Outlet`, not `Oultet`.

## Sources

Based on the review of `src/outlet/index.ts`, `index.js`, `index.d.ts`, and `src/outlet/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
