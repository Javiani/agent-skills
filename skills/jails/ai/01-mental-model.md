# Jails mental model

Jails starts with HTML. JavaScript adds behavior to Custom Elements and connects component state to the existing presentation. A component owns behavior and local state; it does not have to own its markup. Self-contained widgets can export `template`.

## Design principles

- Preserve useful initial HTML, including content delivered by SSR/SSG before JavaScript runs.
- Prefer semantic elements, native forms, DOM events, and JavaScript modules.
- Keep state near its consumers. Share it when multiple consumers need it, using `jails.stdlib/store` or another framework-agnostic reactive store.
- Parent `state.set()` updates pass props to children; a child can use `effect` to access or adapt them.
- Define collaboration through props, events, or dependencies instead of reaching into another component's internals.
- Derive presentation values in `view` rather than storing redundant copies.
- Add abstractions when they solve a concrete behavior, reuse, or coordination problem.

## Conceptual flow

```text
HTML + registered module + dependencies
                  ↓
       Custom Element instance
                  ↓
         controller and model
                  ↓
       main: activate behavior
                  ↓
     event → handler → state.set
                           ↓
                  view, if provided
                           ↓
                   directives → DOM

Element removal → unmount → resource cleanup
```

This is a conceptual flow, not a complete runtime initialization order. The supplied documentation does not specify every ordering detail between model, template, controller, and mounting.

`state` belongs to a component instance. Registration and pub/sub use the shared API; multiple components do not imply independent Jails runtimes.

## Architecture boundaries

An *island* here means a bounded interactive region, not a Jails isolation or loading API. A coordinating root component is valid when it has a concrete responsibility. No mandatory application architecture is implied.

Read [implementation decisions](05-decisions.md) for boundaries and [component patterns](02-component-patterns.md) for implementation choices.
