# throttle

Limit the frequency of scroll and other events.

`throttle(fn, wait = 100)` returns a function that executes only when **more** than `wait` ms have elapsed since the previous execution. The clock starts when the wrapper is created.

```js
import { throttle } from 'jails.stdlib/throttle'

const onScroll = throttle(() => console.log(window.scrollY), 100)
window.addEventListener('scroll', onScroll)
// On teardown: window.removeEventListener('scroll', onScroll)
```

Calls during the first interval are discarded. It does not schedule a trailing execution, return results, preserve `this`, or provide `cancel`. It is unsuitable when the last event must always be processed.

## Sources

Based on the review of `src/throttle/index.ts`, `index.js`, `index.d.ts`, and `src/throttle/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
