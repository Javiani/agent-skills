# Instance helpers

Source label: `reference/helpers.md`. These signatures combine declarations and overloads demonstrated by the supplied examples.

## Initialization and DOM

| Helper | Behavior |
| --- | --- |
| `main(callback)` | Runs initialization after mounting. |
| `elm` | The component's `HTMLElement`; use native DOM APIs, dataset, and local selectors. |
| `dataset(key)` / `dataset(target, key)` | Parses a component or target element's `data-*` value. For example, `data-config="{ name: 'Ana', age: 41 }"` produces an object. |
| `dependencies` | Object supplied as the third argument to `register`. |
| `innerHTML(html)` / `innerHTML(target, html)` | Updates component or target HTML with DOM diffing. |

## State

- `state.get()` returns the full current state object.
- `state.set(partialObject)` updates the supplied properties.
- `state.set(callback)` passes the current state object for property mutation.
- `state.set(...)` returns a promise. Await it before querying newly rendered elements or performing DOM-dependent work.
- `state.protected(['counter'])` prevents parent props from overwriting those child fields. Use only when local ownership requires protection.

Inside an asynchronous handler receiving `state`:

```js
await state.set(currentState => {
  currentState.isVisible = !currentState.isVisible
})

// DOM-dependent work can now read the updated presentation.
```

## Local events and attribute changes

`on(event, selector, callback)` delegates events through the component element, including after descendant replacement. `on(event, callback)` is also demonstrated for the component itself.

```js
on('click', '[data-item]', event => {
  // Match the delegated element even when its nested icon was clicked.
  const id = event.delegateTarget.dataset.item
  emit('item:selected', { id })
})
```

This fragment needs `on` and `emit` from its controller. For attribute changes, the documented overload is `on('[src]', 'iframe', callback)`, whose callback receives `{ target, value, attribute }`. It observes changes on the component and its children.

`off(event, callback)` removes the matching listener; retain the callback reference if later removal is needed.

## Communication

| Need | API |
| --- | --- |
| Notify an ancestor | `emit(event, data?)`, using bubbling Custom Events. |
| Trigger on the component element | `trigger(event, data)` |
| Trigger from a descendant | `trigger(event, selector, data)` |
| Global, sibling, or separate-tree communication | `publish(event, data?)` and `subscribe(event, callback)` |

Emitted-event handlers receive `(event, data)` in the supplied examples; subscription callbacks receive data directly. Inspect installed types for other payload forms. Although the original `emit` prose mentions siblings, its described bubbling mechanism reaches ancestors; use pub/sub for direct sibling communication.

`subscribe` returns an unsubscribe function. Global and component APIs share the pub/sub mechanism. See [resource lifecycle](../ai/02-component-patterns.md#resource-lifecycle) for a complete component that unsubscribes on unmount.

## Lifecycle and external libraries

- `effect(callback)` receives props when the parent updates through `state.set()`. It can adapt or compose them before the child updates and may be synchronous or asynchronous. It is not a generic observer of local state.
- `unmount(callback)` runs when the element is removed. Release subscriptions, timers, external listeners, and library instances created by the component.

```js
effect(props => {
  // Adapt only incoming values that this component needs to transform.
  props.count += 1
})
```

For Chart.js, the supplied example finds a canvas through `elm`, creates a chart, and updates chart data on input. For Swiper, protect its DOM with `html-static`. Verify external library APIs against installed versions before reproducing integrations.

## Imperative child access: advanced use

`query(selector)` returns an array of promises for Jails elements, not one promise of an array. Await each element before using it. The author advises against this pattern for most projects: prefer props, events, and stores unless imperative integration is necessary.

The following fragment belongs in a controller receiving `query` and `main`:

```js
const children = query('form-validation')

main(async () => {
  for (const pending of children) {
    const child = await pending
    // Access only the child's documented public API here.
  }
})
```

The source mentions public methods without documenting how to expose them. Do not invent an exposure API.
