# third-party

Activate a third-party snippet at a chosen point in the application flow.

`thirdParty(name)` finds `script[data-name=NAME]` and returns `Promise<HTMLScriptElement>`.

```html
<script type="text/third-party" data-name="metrics" src="/assets/metrics.js">
    window.metricsReady = true;
</script>
```

```js
import { thirdParty } from 'jails.stdlib/third-party'

const metrics = thirdParty('metrics')
await metrics
```

The inert type prevents initial execution. With src, it creates a new asynchronous script, awaits load, executes inline text through `new Function`, and resolves with the new script. Without src, it executes text through `eval` in a timer and resolves with the original. The actual order with src is library first, inline text afterward, unlike the README description.

A missing script rejects with `{ error: 'ThirdPartyScriptError', message }`. There is no onerror handler for src or exception handling for inline code: the promise may remain pending. Repeated calls repeat loading/execution; cache the promise if execution must happen only once. The name is interpolated into a selector without quotes/escaping: use simple identifiers. CSP may block scripts/eval/Function; choose an integration compatible with the project’s policy. Do not assume user consent; activate at the point authorized by the existing flow.

## Sources

Based on the review of `src/third-party/index.ts`, `index.js`, `index.d.ts`, and `src/third-party/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
