# Component organization conventions

Read this reference before creating or modifying a Jails component. These are author conventions, not additional runtime APIs.

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
