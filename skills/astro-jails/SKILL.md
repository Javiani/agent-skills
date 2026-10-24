---
name: astro-jails
description: "Create or extend Astro applications using the Astro + Jails architecture: thin routes, feature screens in domain, services and normalizers in shared, layouts, and progressive behavior with Jails. Use when the user requests this architecture or the same structure as the Astro Movies reference application."
---

# Feature-oriented Astro + Jails

Reproduce the reference application's boundaries, organization, and contracts while adapting its subject matter to the requested product. The reference is a server-rendered MPA; `domain` organizes Astro screens rather than a pure Clean Architecture domain. Do not add repositories, use cases, DI containers, React, or an SPA router unless the product explicitly needs them.

## Before implementing

Read [the architecture](references/architecture.md) for the tree, responsibilities, actual flows, and limitations. Read [implementation patterns](references/patterns.md) when creating files. The [diagram](references/diagram.md) shows dependencies and execution; its visual version is [architecture.svg](assets/architecture.svg).

To compare implementation details, inspect individual files in `assets/reference-app/`. This snapshot contains only `src/`, `package.json`, `tsconfig.json`, and `astro.config.mjs`; it is a code reference, not a starter to copy wholesale. It does not depend on the original project's path and contains no credentials or installed dependencies.

## Required companion skills: `jails` and `jails-stdlib`

Before writing or changing any browser behavior (controllers, directives, state, events, stores, forms, routing, lazy loading, debounce, storage, etc.), load and follow these skills; this skill defines structure only.

- [jails](../jails/SKILL.md): read its mental model and component conventions before creating or modifying any `index.ts` controller or `app-*` component; follow its best practices for state, events, directives, and shared stores.
- [jails-stdlib](../jails-stdlib/SKILL.md): before hand-writing a utility, check whether a `jails.stdlib` module already covers it (`debounce`, `throttle`, `delay`, `store`, `channel`, `storage`, `querystring`, `router`, `form-validation`, `lazyload-image`, `is-visible`, `is-touch`, `import-css/html/js`, `cancelable`, `outlet`, `mfe`, `third-party`). Read only the matching module reference and import from public subpaths (`jails.stdlib/<module>`). Prefer reuse over custom code; add the dependency if missing.
- Check installed versions of `jails-js` and `jails.stdlib` before relying on any API. The reference snapshot lists `jails.stdlib` as a dependency without using it; this is not a reason to avoid it.
- When the references conflict, the Astro structure here wins for file placement; the `jails`/`jails-stdlib` skills win for component and library API usage.

## Architectural contract

- `src/pages/`: file-based routing entry points. Import and render a screen from `domain`. For detail routes that reuse the same screen, read parameters, call the service, and pass its result through props.
- `src/domain/<feature>/index.astro`: screen composing a layout and components; may call services in its frontmatter for screen-specific queries. Keep exclusive components nearby in `components/<name>/index.astro`.
- `src/layouts/default.astro`: HTML document, metadata, global styles, bootstrap, navigation, footer, and slot. Each screen applies the layout once.
- `src/shared/services/<provider>/http.ts`: HTTP transport. `index.ts` exposes asynchronous query functions and applies normalizers before returning data.
- `src/shared/entities/<provider>/`: synchronous factory functions normalizing payloads into presentation objects. They do not fetch or access the DOM; they return plain objects without requiring classes.
- `src/shared/components/<name>/index.astro`: UI shared across screens or a global shell component. For interactions, place the Jails controller in a sibling `index.ts`; static components do not need one.
- `src/shared/main.ts`: imports `register` and `start` from Jails, registers `app-main`, exports both functions, and starts the application when the DOM is ready. `shared/application.ts` coordinates global behavior.
- Use absolute imports `domain/...`, `shared/...`, and `layouts/...` resolved from `src`; use relative imports for internal details and sibling controllers.

## Creating the next application

1. Map the new product's features and data provider onto the reference tree. Keep structural names; replace names such as `movies` and `tmdb` with the requested concepts. Reuse a detail screen when its presentation contract is the same.
2. Configure Astro for SSR, Tailwind through Vite, and Jails for browser behavior. Netlify is the reference adapter; adapt it to the chosen deployment target. Snapshot versions document the source, not future compatibility: check installed versions or official documentation before selecting alternatives. Do not copy Vite flags without a reason.
3. Define the normalized object consumed by components. Centralize defaults, dates, names, image paths, and collections in the entity. Components must consume each field in the format returned by the normalizer.
4. Implement transport → service → entity; then screen → components → route. Keep query URLs and secrets on the server; document only variable names with dummy values in `.env.sample`.
5. For interactions (after consulting `jails` and `jails-stdlib`, reusing stdlib modules where they fit), register `app-<name>` in the component's Astro script and associate it with the matching tag. Use local state, delegated events, and publish/subscribe as shown in the patterns. Do not put authenticated API queries in browser controllers.
6. Preserve MPA navigation through ordinary links. The reference loader and navigation delay are optional effects, not architectural foundations. Preserve modified clicks, downloads, anchors, and external destinations if intercepting navigation.
7. Verify the tree, imports, build, and affected flows. Test normalization with representative payloads and missing data; check that image URLs are not prefixed twice. For modals, verify opening, closing, Escape, backdrop clicks, and content cleanup. Do not claim browser validation when only the build ran.

Deliver the application with the same distribution of responsibilities and explain necessary adaptations. Do not reproduce historical bugs documented in the reference. Do not automatically reproduce branding, copy, language, movie catalogs, or credentials.
