# cancelable

Ignore stale asynchronous results.

`cancelable(fn)` returns a `(...args) => Promise` function. `fn` must return a promise. Only the latest call resolves or rejects its outer promise.

```js
import { cancelable } from 'jails.stdlib/cancelable'

const search = cancelable((term) =>
    fetch(`/api/search?q=${encodeURIComponent(term)}`).then((response) => response.json())
)
search('jails').then((data) => console.log(data)).catch(console.error)
```

It does not cancel the request or its side effects. Promises from superseded calls remain pending: do not pass all of them to `Promise.all` or rely on their `finally` handlers for cleanup. It does not preserve the caller’s `this`. A synchronous exception from `fn` rejects immediately, outside the stale-result filter. Use a separate cancellation mechanism to abort I/O.

## Sources

Based on the review of `src/cancelable/index.ts`, `index.js`, `index.d.ts`, and `src/cancelable/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
