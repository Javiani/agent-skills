# mfe

Embed remote applications and share shell configuration.

`mfe({ timeout = 5000 } = {})` returns `render(target, uri)` and `renderJS({ target, tag, src })`.

```js
import { mfe, Shell } from 'jails.stdlib/mfe'

const shell = Shell({ apiBase: '/api' })
const microfrontend = mfe()
const target = document.querySelector('[data-mfe]')
await microfrontend.renderJS({ target, tag: 'remote-app', src: '/remote-app.js' })
```

`renderJS` replaces the target’s contents with the custom element and loads an asynchronous script in the head. It resolves with the target on load and rejects with `{ type: 'error', message }` on a loading error. It does not confirm that the application has finished mounting.

`render(target, uri)` fetches a full HTML document, injects CSS/styles into the head, writes the body into the target, and executes scripts sequentially. The URI must be absolute. External CSS and scripts are resolved against it, but image/body URLs and URLs inside inline CSS are not normalized. Remote fetches require CORS. It neither checks HTTP status nor isolates/sanitizes content.

Critical README discrepancies: `timeout` is unused; the first render resolves without the target after a fixed 1000 ms timer. CSS errors are absorbed by `allSettled`; errors in the script sequence may leave the outer promise pending. The cache stores target queues, not a ready document: calls for the same URI only enqueue the target and return without readiness; calls after the initial load do not render immediately. Failures do not clear this cache. Do not promise timeouts, retries, or a working cache. Implement required guarantees separately or choose another solution.

`Shell(config = {})` stores configuration in `window.___Shell___`. Later calls create a new object combining new and previous configuration, with previous values taking precedence. `Shell()` reads the current configuration, but is neither an event channel nor a reactive object; earlier references may become stale. It works within the same window, not across iframes.

Injected resources are not removed automatically. Reserve the remote application’s DOM, for example with `html-static` in Jails, and define external application teardown separately.

## Sources

Based on the review of `src/mfe/index.ts`, `index.js`, `index.d.ts`, and `src/mfe/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
