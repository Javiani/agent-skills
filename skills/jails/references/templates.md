# Directives and rendering

Source labels: `reference/template-system.md`, with examples from `index.md` and `reference/components.md`.

Directives and `{{ expression }}` interpolation evaluate JavaScript expressions against view data. Do not import directive conventions from other frameworks.

| Feature | Semantics |
| --- | --- |
| `{{ counter }}` | Interpolates a template expression. |
| `html-if="show"` | Conditionally renders content; false content is absent, not merely hidden by CSS. |
| `html-for="item in list"` | Iterates arrays or objects, exposing `$index` and `$key`. |
| `html-inner="name"` | Fills an element from an expression, allowing fallback content before JavaScript. |
| `html-model="{ counter: 5 }"` | Supplies initial component state, overriding model properties; not two-way input binding. |
| `html-class="loading ? 'is-loading' : ''"` | Uses the generic `html-*` attribute-expression family. |
| `html-src="imageUrl"` | Defers applying `src` until JavaScript processes the directive. |
| `html-static` | Excludes the node and descendants from diffing updates. |
| `<template>` | Hides dynamic content in initial HTML until Jails processes it. |

## Conditions and lists

```html
<user-list>
  <ul>
    <li html-for="item in list">
      <span html-if="item.show">{{ $index }}: {{ item.name }}</span>
    </li>
  </ul>
</user-list>
```

Here a false condition removes the `span`, not its `li`. Place the condition at the intended level. Verify combinations of directives on the same node because their precedence is not documented.

## Initial HTML and SSR/SSG

Provide a readable fallback when possible:

```html
<strong html-inner="name">Guest</strong>
```

Hide content that only makes sense with dynamic data:

```html
<my-component>
  <h1>Server-rendered content</h1>
  <template>
    <p html-if="userData">Hello, {{ userData.name }}!</p>
  </template>
</my-component>
```

Jails processes this `<template>` usage; it does not require a custom renderer. For conflicting server delimiters, see `templateConfig` in the [component reference](components.md).

## Attributes and forms

The `html-*` family accepts JavaScript expressions. For literal strings, use a string expression such as `html-title="'Hello'"` or a normal static attribute.

Documented boolean attributes are `selected`, `checked`, `readonly`, `disabled`, and `autoplay`. Their `html-` variants are removed when the expression is falsy; the string `'false'` is not false.

```html
<button type="submit" html-disabled="loading">Submit</button>
```

`html-static` lets the browser retain `input`, `textarea`, and `select` values without state synchronization. Choose this only when Jails does not need to update that DOM reactively.

## Third-party DOM ownership

```html
<app-carousel>
  <input type="number" min="1" value="1" html-static>
  <p>Page: {{ page }}</p>
  <div class="swiper" html-static>
    <!-- The carousel library owns this region. -->
  </div>
</app-carousel>
```

The documented handler calls `swiper.slideTo(page - 1)` on input and updates `state.set({ page })`. Keep reactive text outside the static region. Dispose of the external instance on unmount through its own API.
