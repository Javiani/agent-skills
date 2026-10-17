---
name: jails
description: Build, modify, and debug Jails JavaScript (jails-js) components and applications, including HTML directives, state, events, shared stores, SSR/SSG integration, and distributable widgets. Use when working with Jails code; not for FreeBSD jails or process isolation.
---

# Jails

Add JavaScript behavior to Custom Elements and existing HTML. Preserve the project's separation between markup and behavior: enhance server-rendered HTML where appropriate, and export `template` when a widget needs to supply its own markup.

## When to apply

- Create, register, or modify Jails components and HTML directives.
- Connect component state, events, shared stores, or resource lifecycles.
- Debug Jails behavior or integrate widgets with SSR/SSG applications.

## How it works

1. Inspect the installed `jails-js` version, application entry point, nearby components, and project conventions. These references summarize supplied documentation without a version pin; resolve version-specific questions against installed exports, types, and implementation.
2. Read the [mental model](references/mental-model.md), read [component conventions](references/component-conventions.md) before creating or modifying components, then load only the other guides needed for the task from the table below.
3. Implement the smallest change that fits the existing architecture. Register the complete component module before `start()`.
4. Verify the affected behavior using available project commands and runtime. For UI changes, check relevant mounting, interaction, state-to-DOM updates, and cleanup. Report what was verified and any remaining limitations.

## Choose a reference

| Task | Read |
| --- | --- |
| Follow controller ordering, helper placement, model formatting, and module conventions | [Component conventions](references/component-conventions.md) |
| Create or register a component; define model, view, or template | [Component API](references/components.md) |
| Choose local-state, form, event, or lifecycle patterns | [Component patterns](references/component-patterns.md) |
| Choose props, events, dependencies, or shared state | [Communication patterns](references/communication-patterns.md) |
| Use helpers or debug lifecycle and event behavior | [Instance helpers](references/helpers.md) |
| Render lists, conditions, attributes, or third-party DOM | [Directives and rendering](references/templates.md) |
| Create or consume a shared store | [Store API and examples](references/store.md) |
| Organize a larger application or coordinate I/O and SSR/SSG | [Application architecture](references/application-architecture.md) |
| Decide boundaries or diagnose a missing update | [Implementation decisions](references/decisions.md) |
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

## Scope and provenance

The references preserve the supplied Jails documentation and the author's guidance on props and stores. Feature folders, services, and islands are optional application patterns, not framework requirements. Do not impose them on a project with suitable existing boundaries.

Original source labels: `index.md`, `reference/components.md`, `reference/api.md`, `reference/helpers.md`, `reference/template-system.md`, `web-components.md`, `standard-library.md`, and `demos.md`. These labels identify provenance, not files required to use this skill. The references are self-contained. External links are optional investigation targets, not verified dependencies or API guarantees.
