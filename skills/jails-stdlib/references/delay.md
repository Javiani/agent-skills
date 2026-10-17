# delay

Wait while preserving a promise chain’s value.

`delay(milliseconds = 100)` returns `(data?) => Promise`, resolving with the same data after the interval.

```js
import { delay } from 'jails.stdlib/delay'

await delay(200)()
const value = await Promise.resolve({ ready: true }).then(delay(200))
```

This is a curried API: `await delay(200)` only awaits a function, not a timer. It provides no cancellation and does not turn rejections into success.

## Sources

Based on the review of `src/delay/index.ts`, `index.js`, `index.d.ts`, and `src/delay/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
