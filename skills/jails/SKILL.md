---
name: jails
description: Build, modify, and debug Jails JavaScript (jails-js) components and applications, including HTML directives, state, events, shared stores, SSR/SSG integration, and distributable widgets. Use when working with Jails code; not for FreeBSD jails or process isolation.
---

# Jails

Add JavaScript behavior to Custom Elements and existing HTML. Preserve the project's separation between markup and behavior: enhance server-rendered HTML where appropriate, and export `template` when a widget needs to supply its own markup.

## Workflow

1. Inspect the installed `jails-js` version, application entry point, nearby components, and project conventions. These references summarize supplied documentation without a version pin; resolve version-specific questions against installed exports, types, and implementation.
2. Read the [mental model](ai/01-mental-model.md), then load only the guides needed for the task from the table below.
3. Implement the smallest change that fits the existing architecture. Register the complete component module before `start()`.
4. Verify the affected behavior using available project commands and runtime. For UI changes, check relevant mounting, interaction, state-to-DOM updates, and cleanup. Report what was verified and any remaining limitations.

## Choose a reference

| Task | Read |
| --- | --- |
| Create or register a component; define model, view, or template | [Component API](references/components.md) |
| Choose local-state, form, event, or lifecycle patterns | [Component patterns](ai/02-component-patterns.md) |
| Choose props, events, dependencies, or shared state | [Communication patterns](ai/03-communication-patterns.md) |
| Use helpers or debug lifecycle and event behavior | [Instance helpers](references/helpers.md) |
| Render lists, conditions, attributes, or third-party DOM | [Directives and rendering](references/templates.md) |
| Create or consume a shared store | [Store API and examples](references/store.md) |
| Organize a larger application or coordinate I/O and SSR/SSG | [Application architecture](ai/04-application-architecture.md) |
| Decide boundaries or diagnose a missing update | [Implementation decisions](ai/05-decisions.md) |
| Package widgets, share SSR templates, or inspect ecosystem examples | [Distribution and ecosystem](references/ecosystem.md) |

## Essential rules

- Export a default controller and an explicit `model`; `view` and `template` are optional. Register a namespace import (`import * as component`) to retain all exports.
- Destructure every helper used by the controller. Do not reproduce missing helper declarations from abbreviated examples.
- The callback passed to `state.set` receives the entire state object. An object argument updates only the supplied properties. Await its promise when subsequent work requires the updated DOM.
- Delegated handlers use `event.delegateTarget` for the matched element, including clicks on its descendants.
- Use `emit` for child-to-ancestor DOM events and `publish`/`subscribe` for siblings or separate trees. Bubbling does not deliver events directly to siblings.
- Parent `state.set()` updates pass props to children. A child's `effect` callback can access or adapt incoming props; it is optional and is not a generic local-state observer.
- Prefer `Store` from `jails.stdlib/store` when shared state is needed. Respect an existing framework-agnostic reactive store. Explicitly connect its snapshot and subscription to component state, and unsubscribe on unmount.
- Keep DOM owned by another library inside `html-static`. Release resources created by the component in `unmount`.
- Do not infer two-way binding, Shadow DOM, automatic store subscriptions, event replay, or undocumented APIs. Inspect the installed implementation when additional capabilities matter.
- Use consistent indentation, descriptive names, explanatory comments, and readable multiline functions and control flow in generated code and examples.

## Component organization conventions

- Declare the exported default controller with a function declaration. Declare the component's exported `model` constant after that function.
- Inside the controller, declare the values needed for initialization immediately before registering its `main` callback. Do not declare variables inside the callback passed to `main`.
- Keep the `main` callback declarative and explicit: register event handlers first, then call the needed component helpers in order (for example, a route guard followed by field restoration). Do not reduce it to a single delegation to a generic initialization helper.
- Do not declare variables or write branching logic inside the `main` callback. Extract conditions such as redirect guards into named arrow helpers and call those helpers directly from `main`.
- Declare component-specific helpers as arrow-function constants inside the default controller, immediately after the `main` registration. Keep handlers, validation, and application rules in the component's scope instead of at module scope.
- Above `main`, declare only variables holding plain values or values returned by an external function call (for example `const timers = new Set()` or `const observer = createObserver()`). Never declare functions there, including arrow functions or wrappers whose argument is an inline callback such as `throttle(() => ...)`. All function-valued constants, including those returned by `throttle`/`debounce` wrapping an inline callback, go below `main`:

  ```js
  export default function siteNav({ main, state, unmount }) {

    main(() => {
      window.addEventListener('scroll', updateScrolled)
      unmount(() => window.removeEventListener('scroll', updateScrolled))
    })

    const updateScrolled = throttle(() => {
      state.set({ scrolled: isPastThreshold() })
    }, 50)
  }
  ```
- Use the controller's closure instead of forwarding values as helper parameters. Declare values used by multiple helpers before `main` and reuse them directly; declare a value inside the helper when only that helper needs it. Avoid passing component state, the root element, or step context through redundant helper arguments.
- Do not define utility functions, constants, or data tables in the component file. Implementation details (patterns, timings, labels, thresholds, data builders, pure helpers) belong in external modules with semantic, domain-based names (for example `pixel-cells.js`, `flash-timing.js`, `submit-feedback.js`), imported by the component. Never name modules `utils`, `helpers`, or `common`. Keep closure-bound helpers inside their controller, following the component ordering above.
- Always write `export const model` across multiple lines, one property per line, even for a single property; never as a one-liner. Do not put logic (`map`, ternaries, calls with inline callbacks) inside the model; call an imported factory instead (for example `cells: createPixelCells()`).
- Write `state.set({ ... })` across multiple lines, one property per line, unless the object has a single property.
- Leave one blank line immediately after the opening line of the exported default `function` declaration.
- The exported default controller is the only place the `function` keyword may appear in a component file; use arrow functions for everything else, including callbacks and helpers (declare helpers as `const` so they are available when `main` runs).
- Jails invokes the `main` callback after mounting. This allows helpers declared immediately after `main(...)` to be called safely by its callback without moving component behavior outside the component scope.

## Scope and provenance

The references preserve the supplied Jails documentation and the author's guidance on props and stores. Feature folders, services, and islands are optional application patterns, not framework requirements. Do not impose them on a project with suitable existing boundaries.

Original source labels: `index.md`, `reference/components.md`, `reference/api.md`, `reference/helpers.md`, `reference/template-system.md`, `web-components.md`, `standard-library.md`, and `demos.md`. These labels identify provenance, not files required to use this skill. The references are self-contained. External links are optional investigation targets, not verified dependencies or API guarantees.
