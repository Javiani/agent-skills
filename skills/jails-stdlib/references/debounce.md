# debounce

Wait for a pause in frequent events.

`debounce(fn, timeout = 250)` returns a function that resets its timer on every call and invokes `fn` with the latest arguments after the pause.

```js
import { debounce } from 'jails.stdlib/debounce'

const searchAfterPause = debounce((value) => console.log(value), 300)
input.addEventListener('input', (event) => searchAfterPause(event.target.value))
```

Use `input`, not `oninput`, with `addEventListener`. Pass the captured value: reading the event much later may observe a different DOM state. The wrapper does not return the result of `fn`, provide `cancel`/`flush`, or preserve dynamic `this`. Removing the listener does not cancel a scheduled timer; use an implementation with cancellation if this matters on unmount.

## Sources

Based on the review of `src/debounce/index.ts`, `index.js`, `index.d.ts`, and `src/debounce/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
