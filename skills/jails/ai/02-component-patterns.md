# Component patterns

Choose patterns by the component's responsibility. Organization advice does not introduce runtime APIs. See [component exports](../references/components.md) and [helpers](../references/helpers.md) for contracts.

## Local state

Use `model` and `state.set` for one instance's expansion, selection, or loading state. Avoid an independent local copy of shared data that must stay consistent across consumers. Read with `state.get`; do not assume direct mutations of its result notify the view.

```js
export const model = { expanded: false }

export default function disclosure({ main, on, state }) {
  main(() => {
    on('click', '[data-toggle]', () => {
      // Each instance owns its expansion state.
      state.set(currentState => {
        currentState.expanded = !currentState.expanded
      })
    })
  })
}
```

```html
<app-disclosure>
  <button type="button" data-toggle html-aria-expanded="expanded">
    Details
  </button>
  <div html-if="expanded">Additional content</div>
</app-disclosure>
```

A global `expanded` variable would incorrectly couple independent instances.

## Derived presentation

Use `view` for formatting and calculated display values. Preserve fields needed by the template. Keep HTTP calls, external effects, and independently editable values out of `view`.

```js
export const model = { quantity: 1, unitPrice: 20 }

export const view = state => {
  // Derive the total so every price or quantity update stays consistent.
  return {
    ...state,
    total: state.quantity * state.unitPrice
  }
}
```

Do not manually synchronize `total` in each handler. Calculations reused outside the UI can live in ordinary functions called by the view.

## Initialization from HTML

Use a model function for per-element configuration, `dataset` for parsed values, and `html-model` for initial state. Avoid reading decorative text or a global element to configure every instance.

```js
export const model = ({ elm }) => {
  // Read configuration from this instance rather than a global element.
  return {
    counter: Number(elm.dataset.startAt || 0)
  }
}
```

```html
<app-counter data-start-at="10"></app-counter>
```

Validate conversions against accepted inputs. The full precedence between a model function and `initialState` is unspecified; inspect the installed implementation if the distinction matters.

## Delegated events

Use `on` in `main` for descendant events, including descendants replaced by rendering. The following handler belongs inside a controller receiving `on` and `emit`:

```js
on('click', '[data-product-id]', event => {
  // The matched button remains the source even if its icon was clicked.
  const productId = event.delegateTarget.dataset.productId
  emit('product:selected', { productId })
})
```

Do not rebuild button listeners after every state update or assume `event.target` matches the delegated selector. Verify helper scope before observing targets outside the component tree.

## Browser-owned form state

When values are only needed on submission, preserve fields with `html-static` and read them with native APIs. Use reactive state instead when the UI must respond to each edit or control the displayed value.

```html
<app-search>
  <form>
    <label>
      Search
      <input name="query" html-static>
    </label>
    <button type="submit">Search</button>
  </form>
</app-search>
```

```js
export const model = {}

export default function search({ main, on, emit }) {
  main(() => {
    on('submit', 'form', event => {
      event.preventDefault()

      // Read native form values only when the user submits.
      const data = new FormData(event.delegateTarget)
      emit('search:requested', {
        query: String(data.get('query') || '')
      })
    })
  })
}
```

`html-model` initializes component state; it is not two-way input binding. Preserve a working native HTTP submission when interception is unnecessary.

## Resource lifecycle

Pair global subscriptions, timers, external listeners, and library instances with cleanup in `unmount`. Pure functions without resources need no cleanup infrastructure.

```js
export const model = { items: [] }

export default function results({ main, subscribe, state, unmount }) {
  let unsubscribe

  main(() => {
    unsubscribe = subscribe('catalog:results', items => {
      state.set({ items })
    })
  })

  unmount(() => {
    // Disconnect this instance when its element leaves the DOM.
    unsubscribe?.()
  })
}
```

For third-party DOM libraries, also mark their region `html-static` and dispose of instances through their own APIs.

## Consumer markup or embedded template

Enhance consumer HTML when behavior is reused across different presentations. Export `template` when a distributed widget supplies its own UI; do not move existing static HTML into JavaScript without a product need.

```js
import { html } from 'jails-js/html'

export const template = ({ children }) => {
  // Preserve consumer content as part of this widget's contract.
  return html`
    <section>
      ${children}
      <span html-inner="counter">0</span>
    </section>
  `
}
```

This export is a fragment of a component module with a controller and model. See [distribution and SSR](../references/ecosystem.md) for complete integration guidance.
