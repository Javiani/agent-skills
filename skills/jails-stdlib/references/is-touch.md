# is-touch

Check basic touch support.

`isTouch()` returns `'ontouchstart' in window`.

```js
import { isTouch } from 'jails.stdlib/is-touch'

const supportsTouch = isTouch()
```

This is a capability heuristic: it neither identifies mobile devices nor rules out mouse/keyboard input on hybrid devices. Do not use it to block alternative interactions. Requires `window`.

## Sources

Based on the review of `src/is-touch/index.ts`, `index.js`, `index.d.ts`, and `src/is-touch/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
