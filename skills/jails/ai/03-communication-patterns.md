# Communication patterns

Identify the data owner, allowed writers, and consumers before choosing a channel. DOM relationships and data lifetime determine the appropriate mechanism.

## Choose a mechanism

| Need | Prefer | Boundary |
| --- | --- | --- |
| One instance's interaction | Local `state` | Does not automatically create shared state. |
| Child reports an action to an ancestor | `emit` and `on` | Bubbling reaches ancestors, not siblings directly. |
| Parent supplies child data | Parent `state.set()`; optional child `effect` | The effect accesses or adapts incoming props; it does not enable propagation. |
| Consumer supplies a capability | `register(..., dependencies)` | Injection is not notification. |
| Separate trees announce a fact | `publish` and `subscribe` | Persistence and replay are not documented. |
| Multiple consumers need current state | `jails.stdlib/store` | Other framework-agnostic reactive stores using events or signals are also suitable. |
| Caller needs a result or error | Function or service returning a value or promise | A service is an application abstraction, not a Jails helper. |

## Child announces intent; ancestor decides

Use an explicit event and payload when the ancestor owns the corresponding state or operation. Keep an interaction local when coordination adds no benefit.

Child module, `product-choice.js`:

```js
export const model = {}

export default function choice({ main, on, emit }) {
  main(() => {
    on('click', '[data-product-id]', event => {
      // Report intent without reaching into the ancestor's state.
      emit('product:selected', {
        productId: event.delegateTarget.dataset.productId
      })
    })
  })
}
```

Ancestor module, `catalog.js`:

```js
export const model = { selectedId: null }

export default function catalog({ main, on, state }) {
  main(() => {
    on('product:selected', (event, payload) => {
      // The ancestor owns the selection and decides how to apply it.
      state.set({ selectedId: payload.productId })
    })
  })
}
```

```html
<app-catalog>
  <product-choice>
    <button type="button" data-product-id="p1">Select product</button>
  </product-choice>
  <p>
    Selection: <span html-inner="selectedId"></span>
  </p>
</app-catalog>
```

Register both modules. The second handler argument follows the supplied documentation; check installed types if they differ. Do not have the child modify an ancestor's DOM or private properties.

## Global notification

Use pub/sub for independent regions reacting to a fact, not as durable storage, a function return value, or a broadcast of every local change. Keep payloads small and stable; unsubscribe in `unmount`.

```js
// An application-defined event; the consumer can retrieve the current cart.
publish('cart:updated', { cartId: 'active' })
```

No replay is promised. A late subscriber needs a current snapshot from the data owner plus subsequent notifications. Define snapshot/subscription coordination in that owner's contract.

## Inject a capability

Inject small interfaces when consumers need to replace services, validation rules, or adapters. Direct imports remain valid when replacement is unnecessary.

```js
// The application provides catalogService; it is not a Jails API.
register('product-list', productList, { catalogService })
```

Read `dependencies.catalogService` in the controller and call its documented methods. Do not pass `elm` into a data service so it can control component DOM, or hide uncontrolled global mutation behind injection.

## Parent-to-child props

Keep coordinated data in its owning parent and update it with `state.set()`. Use a child `effect` only to access, transform, or compose incoming props. Do not centralize unrelated UI state or use props to connect unrelated trees.

Parent module, `parent-counter.js`:

```js
export const model = { count: 0 }

export default function parentCounter({ main, on, state }) {
  main(() => {
    on('click', '[data-increment]', () => {
      // Updating parent state also supplies the new prop to children.
      state.set(currentState => {
        currentState.count += 1
      })
    })
  })
}
```

Child module, `child-counter.js`:

```js
export const model = { count: 0 }

export default function childCounter({ effect }) {
  effect(props => {
    // Demonstrates access to incoming props; omit if only rendering them.
    console.log('Count received from parent:', props.count)
  })
}
```

```html
<parent-counter>
  <button type="button" data-increment>Increment</button>
  <child-counter>
    <span html-inner="count">0</span>
  </child-counter>
</parent-counter>
```

Register both modules before `start()`. Prefer `view` for derived presentation. Avoid querying children imperatively to write their state or broadcasting props through global events. Use `state.protected` only when an incoming prop must not overwrite local state.

## Framework-agnostic reactive store

Use a store when multiple components need to read and observe the same data, particularly outside a simple parent/child relationship. Avoid stores for instance-only state, derived presentation, or notifications that need no retained data.

The author's preference is `Store` from `jails.stdlib/store`. Preserve another framework-agnostic reactive store if it already fits the project. Jails does not automatically subscribe to stores or signals: connect reads and notifications to `state.set`, obtain an initial snapshot, and release observations in `unmount`.

```text
Component action → operation owned by the store
                              ↓
                         shared state
                              ↓
                   event or signal notification
                              ↓
               consumer projection via state.set()
```

Define the store's scope, write operations, and lifetime. Two instances of a feature may need separate stores. Each component retains only its required projection and local UI state, not an independently writable copy of shared data.

Read the [store reference](../references/store.md) for creation, dispatch, static imports, injection, and action filtering. `subscribe` returns per-subscription cleanup. `clear()` removes every subscription and belongs to intentional store-wide shutdown, not individual consumer unmounting.
