# is-visible

Wait for an element’s first intersection.

`isVisible(target, { root = null, rootMargin = '0px', threshold = 0 } = {})` returns a promise resolved with the entries array when an entry has `isIntersecting`. It then stops observing the target.

```js
import { isVisible } from 'jails.stdlib/is-visible'

const target = document.querySelector('[data-chart]')
if (target) {
    await isVisible(target, { rootMargin: '200px' })
    // Initialize content near the viewport.
}
```

This is a one-time wait, not a continuous subscription or a CSS visibility check. It exposes no disconnection/cancellation mechanism and may remain pending if the target never intersects. `threshold` is typed as a number, not an array. Use `IntersectionObserver` directly for interruptible lifecycles or continuous tracking.

## Sources

Based on the review of `src/is-visible/index.ts`, `index.js`, `index.d.ts`, and `src/is-visible/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
