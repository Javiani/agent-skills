# store

Share state and named transitions.

Exports `Store` from the `@javiani/onijs` default export and its types; the distributed JavaScript also bundles Oni. Contract observed in installed dependency `1.0.9` and this module’s JavaScript:

- `Store(initialState, actions)` is a factory, called without `new`.
- Actions receive `(state, payload, { getState, subscribe, dispatch })` and return a partial object or nothing. Merging is shallow.
- `getState()` returns the live object. `subscribe(callback)` does not publish an initial snapshot; it returns an unsubscribe function and notifies with `(state, { action, payload })`.
- `dispatch(name, payload?)` returns a promise of the state; `Actions` maps names to themselves; `destroy()` clears subscribers.

```js
import { Store } from 'jails.stdlib/store'

export const cart = Store({ count: 0 }, {
    ADD: (state, { amount = 1 }) => ({ count: state.count + amount })
})
const unsubscribe = cart.subscribe((snapshot) => console.log(snapshot.count))
await cart.dispatch('ADD', { amount: 2 })
unsubscribe()
```

In Jails, send the initial snapshot to `state.set`, connect the subscription to `state.set`, and unsubscribe on unmount; there is no automatic connection. Do not destroy a shared store when unmounting a single consumer.

Initial state is cloned through JSON: avoid non-serializable data. `async` actions return promises that are not awaited/merged as results: perform I/O in a service or dispatch a second synchronous action. Do not assume awaiting dispatch waits for requests started inside the action. Reentrant dispatch during a flush may leave its promise pending in this implementation; do not await nested dispatch. `subscribe` accepts a function; the object pattern matching shown in Oni’s README is not implemented in this version.

## Sources

Based on the review of `src/store/index.ts`, `index.js`, `index.d.ts`, and `src/store/README.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
