# Distribution and ecosystem

Source labels: `web-components.md`, `standard-library.md`, and `demos.md`, plus supplemental links from the supplied documentation. External destinations are investigation targets; their contents were not incorporated or verified here.

## Distribution modes

**Logic Featured:** a behavior module that enhances consumer-supplied HTML. This is the default form, useful for behavior reused across presentations, such as form validation. The documentation suggests Vite for npm libraries; use the project's existing tooling rather than assuming an undocumented build setup.

**Fully Featured:** behavior plus embedded HTML through `template`, suitable for self-contained widgets. Preserve consumer content through `children` when it is part of the contract. Larger templates can be composed from separate functions.

In either mode, consumers install `jails-js`, import the complete module, register it, and call `start()`. Preparing a package does not itself publish it.

```js
import { html } from 'jails-js/html'

export const model = ({ elm }) => {
  return {
    counter: Number(elm.dataset.startAt || 0)
  }
}

export default function counter({ main, on, state }) {
  main(() => {
    on('click', '[data-add]', () => {
      state.set(currentState => {
        currentState.counter += 1
      })
    })
  })
}

export const template = ({ children }) => {
  // Preserve supplied content inside the widget's own markup.
  return html`
    <section>
      ${children}
      <p>Counter: {{ counter }}</p>
      <button type="button" data-add>+</button>
    </section>
  `
}
```

```html
<app-counter data-start-at="10">
  <h1>Counter</h1>
</app-counter>
```

This example includes helpers and imports omitted in the original and initializes the counter in the model. See [startup](components.md#installation-and-startup) for registration.

## Separate template for SSR

Export presentation separately from the controller when the server also needs it:

```js
// counter-template.js
import { html } from 'jails-js/html'

export const counterTemplate = ({ children = '' } = {}) => {
  // The default argument also supports server calls without options.
  return html`
    <section>
      ${children}
      <span html-inner="counter">0</span>
      <button type="button" data-add>+</button>
    </section>
  `
}
```

Astro integration illustrated by the supplied documentation:

```astro
---
import { counterTemplate } from './counter-template.js'
---
<app-counter>
  <Fragment set:html={counterTemplate()} />
</app-counter>
```

The server emits HTML; client-side component registration connects behavior. The source does not describe evaluating Jails directives on the server. The default argument fixes the original example's argument-free call to a destructuring function.

## Standard library and package names

The supplied standard-library document installs `jails.stdlib` and demonstrates:

```js
import { isVisible } from 'jails.stdlib/is-visible'

export const model = {}

export default async function lazyComponent({ main, elm }) {
  await isVisible(elm)

  main(() => {
    // Initialize behavior after the element becomes visible.
  })
}
```

Another example references `jails.std/form-validation`. Do not treat `jails.std` and `jails.stdlib` as interchangeable: verify the intended package and its exports before importing or installing. The supplied material does not document complete validation or masking APIs.

Supplied repository links:

- [Standard Library](https://github.com/jails-org/Std-Library)
- [Alternate Std repository](https://github.com/jails-org/Std)
- [Form validation](https://github.com/jails-org/Std/tree/main/form-validation)

For shared state, the author recommends `Store` from `jails.stdlib/store`, while allowing other framework-agnostic reactive stores. See the [store contract](store.md) and [communication guide](../ai/03-communication-patterns.md); a shared store is not mandatory for every component.

## Demo catalog

Inspect demos only when relevant. Titles do not establish their implementation or dependencies.

| Topic | Supplied demo |
| --- | --- |
| Full collection | [Jails organization](https://stackblitz.com/@Javiani/collections/jails-organization) |
| Hello World with Rive | [Hello World](https://stackblitz.com/edit/jails-hello-world) |
| TodoMVC | [TodoMVC](https://stackblitz.com/edit/jails-todomvc) |
| Form validation | [Form validation](https://stackblitz.com/edit/jails-form-validation) |
| Expense tracker | [Expense tracker](https://stackblitz.com/edit/jails-expense-tracker) |
| Simple blog | [Simple blog](https://stackblitz.com/edit/jails-chartjs-z8tukc) |
| Chart.js | [Chart.js](https://stackblitz.com/edit/jails-chartjs) |
| Swiper | [Swiper integration](https://jails-swiper-integration.stackblitz.io) |

Navigation metadata, embedded demo frames, and promotional images do not add framework API contracts.
