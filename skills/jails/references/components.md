# Components and global API

Source labels: `index.md`, `reference/components.md`, and `reference/api.md` from the supplied documentation. Check installed exports and types for version-specific details.

## Installation and startup

Install `jails-js` with the project's package manager (`npm install jails-js` in the source example). The API is a singleton; do not create independent Jails runtime instances.

```js
import { register, start } from 'jails-js'
import * as example from './components/example.js'

// Register the full module so model, view, and template exports are retained.
register('my-component', example)
start()
```

- `register(name, module, dependencies?)` associates a module with a Custom Element and optionally injects dependencies.
- `start(target?)` starts registered components within the supplied root, defaulting to `document.body`. It can be called again; avoid unnecessary calls.
- `publish(name, data?)` and `subscribe(name, callback)` provide the same global pub/sub mechanism as component helpers.
- The source uses `jails.templateConfig({ tags: ['@{', '}'] })` to replace `{{` and `}}` when they conflict with SSR/SSG templates. Its import is omitted there; inspect installed exports before choosing a namespace or named import.

## Controller

The default export runs for each registered element instance. Destructure the instance helpers it uses. `main(callback)` registers initialization after mounting. The documented pattern allows handlers declared with `const` after registration of `main`; do not call them directly before initialization.

A controller may be `async`; `await` delays the rest of that controller, including any later initialization or handler registration. The documented TypeScript types are `Component`, `Model`, `View`, and `Template` from `jails-js`; verify their installed exports before use.

## Model

The component reference requires a controller and model. Export an explicit model even though some introductory examples omit it.

```js
// Each component instance starts with its own counter value.
export const model = { counter: 0 }
```

A model function can receive `elm`, `initialState`, and `dependencies`:

```js
export const model = ({ elm }) => {
  // Read configuration from the element being initialized.
  return {
    counter: Number(elm.dataset.counter || 0)
  }
}
```

`html-model="{ counter: 5 }"` supplies initial state and overrides model properties. The full precedence for model functions is not specified; inspect implementation when it affects the result.

## View

`view(state)` returns rendering data. Derive display values without storing redundant state; preserve original fields needed by the HTML.

```js
export const view = state => {
  // Preserve template inputs while deriving a display-only class.
  return {
    ...state,
    counterClass: state.counter > 10 ? 'bigger' : ''
  }
}
```

```html
<div html-class="counterClass">{{ counter }}</div>
```

## Template

`template({ elm, children })` supplies embedded HTML. Include `children` explicitly when the widget must preserve the consumer's original content.

```js
import { html, attributes } from 'jails-js/html'

export const template = ({ children }) => {
  // Keep the consumer's content inside the widget's own presentation.
  return html`
    <section ${attributes({ title: 'Counter' })}>
      ${children}
      <span html-inner="counter">0</span>
      <button type="button" data-add>+</button>
    </section>
  `
}
```

`html` is a tagged template; `attributes(object)` composes attributes. The supplied documentation does not specify their sanitization guarantees.

## Dependency injection

Pass a dependency object as the third argument to `register`, then read it through the controller's `dependencies` helper. For example, register `{ catalogService }` and access `dependencies.catalogService`; see the complete [application example](../ai/04-application-architecture.md).

Use injection when consumers supply implementations such as validation rules or adapters. Direct imports remain appropriate when they fit the existing architecture.
