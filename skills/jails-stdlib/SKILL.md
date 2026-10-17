---
name: jails-stdlib
description: Build and adapt JavaScript and Jails integrations using jails.stdlib modules for shared state, forms, routing, resource loading, remote applications, and event utilities. Use when importing jails.stdlib, selecting a library module, or debugging an existing integration.
---

# jails.stdlib

Use existing modules when their contracts meet the project's needs. The library also provides utilities independent of Jails; only `form-validation` requires the Jails component contract.

## When to apply

- Select a jails.stdlib module for an application feature.
- Implement or review imports and integrations with the library.
- Debug lifecycle, asynchronous behavior, or API discrepancies in an existing integration.

## How it works

1. Check the installed dependency and version, nearby imports, runtime environment, and project architecture. These references describe jails.stdlib 2.2.3; dependency contracts may change.
2. Select a module from the table below and read only its reference for imports, API, examples, limitations, and discrepancies between the README and implementation.
3. Import from public subpaths: `import { debounce } from 'jails.stdlib/debounce'`. The package.json provides no aggregate root export. Do not import internal `src` paths or UMD files in a bundled project.
4. Integrate with the existing lifecycle and state/DOM ownership. In Jails components, explicitly connect stores to `state.set`, unsubscribe on unmount, and reserve DOM managed by external applications according to project conventions. Follow the Jails skill when available; standalone utilities do not require it.
5. Verify affected behavior in the project: success, failure, and resource disposal where applicable. Explain limitations relevant to the use case; do not claim capabilities the module lacks.

If the package is absent and adopting it is part of the request, add `jails.stdlib` using the project's package manager and lockfile. Avoid unnecessary version or architecture changes.

## Module reference

| Task | Public subpath | Reference |
| --- | --- | --- |
| Ignore stale asynchronous results | `cancelable` | [cancelable](references/cancelable.md) |
| Wait for a pause in frequent events | `debounce` | [debounce](references/debounce.md) |
| Wait while preserving a chain's value | `delay` | [delay](references/delay.md) |
| Limit scroll and other event frequency | `throttle` | [throttle](references/throttle.md) |
| Read the current URL's query parameters | `querystring` | [querystring](references/querystring.md) |
| Persist JSON locally or for a session | `storage` | [storage](references/storage.md) |
| Fetch HTML without rendering it | `import-html` | [import-html](references/import-html.md) |
| Load a stylesheet on demand | `import-css` | [import-css](references/import-css.md) |
| Load a classic script on demand | `import-js` | [import-js](references/import-js.md) |
| Check basic touch support | `is-touch` | [is-touch](references/is-touch.md) |
| Wait for an element's first intersection | `is-visible` | [is-visible](references/is-visible.md) |
| Load images near the viewport | `lazyload-image` | [lazyload-image](references/lazyload-image.md) |
| Map URLs to handlers | `router` | [router](references/router.md) |
| Exchange events between windows or iframes | `channel` | [channel](references/channel.md) |
| Share state and named transitions | `store` | [store](references/store.md) |
| Validate and mask forms in Jails | `form-validation` | [form-validation](references/form-validation.md) |
| Render remote pages into a region and restore content | `outlet` | [outlet](references/outlet.md) |
| Embed remote applications and share shell configuration | `mfe` | [mfe](references/mfe.md) |
| Activate a third-party snippet at a chosen point | `third-party` | [third-party](references/third-party.md) |

## Essential contracts

- Most modules use browser APIs. Do not execute access to window/document/location/storage on the server; initialize during the project's browser phase. `delay`, `debounce`, `throttle`, and `cancelable` do not require DOM; `Store` is framework agnostic.
- Source and the JavaScript actually imported take precedence over conflicting README examples. Inspect the installed artifact when they differ; some distributed modules bundle dependencies.
- Imports are named, except for the default `form-validation` controller. Import that module as a namespace to register the controller together with its other exports.
- Do not assume cancellation, deduplication, retries, timeouts, cleanup, HTTP validation, or automatic mounting unless the reference provides them.
- Prefer a module when its contract meets the need. If a limitation prevents a solution, use a native API or a small adaptation with explicit ownership; do not force guarantees the library does not implement.

## Common combinations

- Search as you type: `debounce` detects the pause; `cancelable` filters stale results. Debouncing alone does not prevent an older request from overwriting results.
- Persistent shared state: `Store` manages transitions; `storage` saves only the necessary snapshot. Restore before creating the store and decide which actions should persist.
- Remote-page navigation: `Router` selects the route; `Outlet` renders content. Assess effects on the head, assets, and readiness before connecting them.
- Heavy content near the viewport: `isVisible` waits for the first intersection; `importCss`/`importJs` load resources. Prefer `Lazyload` for images.

## Provenance and maintenance

The 19 references were built from TypeScript source, distributed JavaScript, declarations, and READMEs in the library's `src` folders. Dependency aliases were checked against installed dependencies: Grapnel 0.6.4, Oni 1.0.9, and vanilla-lazyload types. Source paths are relative to the library repository; this skill does not depend on an absolute local path. When updating the library, review the references and documented discrepancies rather than treating this snapshot as a guarantee for future versions.
