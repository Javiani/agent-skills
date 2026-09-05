---
name: ui-clean-architecture
description: Apply the UI clean architecture defined in the knowledge/ documentation for screens, sections, constants, layouts, and shared abstractions without importing external architectural assumptions.
---

# UI Clean Architecture Skill

Source of truth: the files under `knowledge/`.

This skill is the operational translation of the architecture described in `knowledge/`. It follows the vocabulary and structure defined there without importing rules from other architectural schools or frameworks.

These instructions are the authority. When the documentation is silent, do not invent a rule. Prefer the simplest implementation compatible with the documented structure.

## Hard constraints

- Name every folder and file using `kebab-case`, including framework-independent source files. Framework conventions do not override this rule.
- The first level below an abstraction folder must use the abstraction's directory shape: components and services are directories for each abstraction with an `index` file. For example, use `components/catalog-header/index.tsx`, never `components/CatalogHeader.tsx`.
- External communication belongs in `services/<service-name>/index.ts`. Services are stateless and return promises of entities; do not place API/fetch functions beside a domain root or component.
- JSON adapters and application data models belong in `entities/<entity-name>.ts`. Keep transformation functions such as `mapShow` in the entity abstraction rather than in a service.
- Entity factories are the public API of their files: use a noun for the factory and a noun plus `Type` for its structure type. Prefer destructured defaults in the factory signature, and keep private transformation helpers below the exported factory.
- Entities are pure adaptation boundaries. They do not perform network communication or local persistence.
- Treat every screen/page as a `Domain`.
- A `Domain` is the highest-level component of the screen and must be imported/rendered by the framework according to the route.
- Each `Domain` must be `standalone`: it must know the required inputs and outputs needed for that screen to work independently.
- A `Domain` is the owner of its local `Components` and `Constants` when they exist only within that screen context.
- A `Domain` may use `Shared` abstractions when the abstraction is cross-domain and reused by different screens.
- `Components` are UI sections or atomic UI pieces; they are not a second architectural layer beyond that classification.
- `Section Components` must be stacked vertically to form the screen; they are not meant to directly reference other section components.
- `Atomic Components` are smaller and reusable, and may live beside a `Section Component` when they are only local, or in a shared area when reused by several domains.
- `Constants` must be centralized and exported; values and pure functions are grouped semantically, not fragmented by folder depth.
- give each Section Component its own entry point and one public component export
- `Layouts` store the boilerplate structure reused across screens, such as the shell of the HTML document and repeated layout wrappers.
- `Shared` stores abstractions used by multiple domains, following the same folder structure pattern used by domains.
- `Stores` persist state and coordinate communication between components within a screen, using `@javiani/onijs`.
- A Domain entry point exports one public root component; secondary UI components live in their own `components/<component-name>/index` entry points.
- Components that depend on shared store state consume it through the selected framework's store adapter, or through the framework-agnostic `@javiani/onijs` vanilla API when no framework adapter exists; do not drill store state through the Domain merely to reach descendants.
- Use props for explicit inputs, local composition, or derived values, not as a transport path for shared store state.

## Vocabulary to preserve

Use the architecture's own vocabulary consistently:

- `Domain`
- `Components`
- `Componentes de Seção` / `Section Components`
- `Componente Atômico` / `Atomic Components`
- `Constants`
- `Layouts`
- `Shared`
- `Stores`
- `standalone`

Do not replace these terms with terms from another architecture.

## Folder structure rules

Use the structure below as the default layout for the application:

```text
src/
  layouts/
  domains/
    <domain-name>/
      components/
        <component-name>/
          index[tsx,astro,svelte]
      constants/
      entities/
        <entity-name>.[ts,js]
      services/
        <service-name>/
          index.[ts,js]
      store/
        index.[ts,js]
      index[tsx,astro,svelte]
  shared/
    components/
    constants/
```

### Layouts

- Put the standard HTML document shell and reusable frame-level elements directly in `src/layouts/`.
- Do not create nested layout folders for layout variants.
- Keep layout code framework-aware only when the framework requires it, but do not let layout code become a new architectural abstraction.

### Domains

- Each domain is a screen or page.
- The screen folder is named after the domain.
- Domain code owns all feature-specific UI and local abstractions.
- A screen folder can contain:
  - `index` (the root component representing the domain)
  - `components/<component-name>/index` for section and atomic components local to that screen
  - `constants/` for screen-specific fixed values or pure functions
  - `entities/<entity-name>` for data adapters and models local to that screen
  - `services/<service-name>/index` for stateless external API or fetch integrations
  - `store/index` for the screen's state store when persistence or component coordination is required

- Keep detailed screen-block HTML in Section Components and let the Domain compose and coordinate them.
- Export only the Domain root component from the domain `index` file; move every secondary UI component to its own component entry point.
- Do not read shared store state in the Domain solely to pass it to descendants.

### Shared

- Put abstractions reused across screens in `src/shared/`.
- The folder structure mirrors the domain pattern and keeps cross-domain abstractions under one shared namespace.
- If a component, constant, or helper is needed by more than one `Domain`, it is a candidate for `Shared`.

### Entities

- Export the entity factory as the file's public API.
- Name entity factories with nouns and structure types with the noun plus `Type`.
- Declare default values directly in destructured factory parameters.
- Keep private sanitization, formatting, image conversion, and normalization helpers below the exported factory.
- Keep entity work framework-agnostic and limited to adapting raw payloads into application-shaped values.

### Services

- Put API, fetch, analytics, and other external communication in stateless services.
- Services may use entities to shape returned data, but must not perform data persistence.
- Service functions return `Promise<Entity>` or `Promise<Entity[]>`.

### Stores

- Use `@javiani/onijs` for screen state stores.
- A screen may have only one store, located at `store/index.ts`.
- Components capture system and user events and dispatch actions; the store keeps state in memory or a persistence mechanism such as session or local storage.
- A store exposes state through its store API, including subscriptions, dispatching actions, and reading current state.
- In React, use `@javiani/onijs/react` and `useStore()` in state-dependent components; do not use the vanilla subscriber to trigger React renders.
- In non-React applications, use the framework-agnostic `@javiani/onijs` API and connect `getState`, `dispatch`, and `subscribe` to the framework's own reactive mechanism.
- Keep `initialState` in a named constant and declare the actions object inline in the `Oni` or `createStore` call; do not extract actions into a separate constant.
- Filter subscriber side effects by the received action with `switch (action)` when only specific actions should trigger them.
- For asynchronous changes, prefer explicit action sequences for loading and loaded states. Side-effect actions are allowed when they simplify the architecture; alternatively, a component may call a service and pass the resulting promise to a store action.

### Constants

- Put constants in semantically named files.
- Keep files flat in `constants/` instead of over-fragmenting them into deep folder trees.
- Name exported values and pure functions in `SCREAMING_SNAKE_CASE`.
- Use constants for fixed system values and derivable values from `process.env` when needed.

### Naming and abstraction placement

- `CatalogHeader.tsx` is invalid because it violates `kebab-case` and the component directory convention. The valid shape is `components/catalog-header/index.tsx`.
- `movieApi.ts` is invalid as a domain-level service file. The valid shape is `services/movie-api/index.ts`.
- A `mapShow` function that adapts API JSON is an entity concern. The valid shape is `entities/show.ts`, imported by the service.
- Entities are the exception to the nested `index` rule: they are semantic files directly under `entities/`, while components and services use a named directory containing `index`.

## Decision rules for new work

### When creating a new screen

Context:
A new feature or route requires a screen.

Decision:
Check whether the screen is a standalone page with its own input/output requirements.

Action:
- Create a `Domain` folder under `src/domains/<domain-name>/`.
- Implement the root screen component in the domain `index` file.
- Compose the screen from section components that are stacked vertically.
- Let each state-dependent component consume shared screen state through the selected framework's store adapter, or through `@javiani/onijs` vanilla when no adapter exists.
- Pass only explicit component inputs and derived values; never transport shared store state through unrelated components with prop chains.

### When deciding what belongs inside a domain

Context:
A piece of UI or logic is needed only for one screen.

Decision:
Determine whether it is local to that screen's context.

Action:
- If it is local to that screen, place it under the corresponding `Domain`.
- If it is reused by more than one screen, move it to `Shared`.

### When deciding between section and atomic component

Context:
A UI part is being created.

Decision:
Ask whether it is a major horizontal section of the page or a smaller repeated unit.

Action:
- If it represents a distinct section with its own context and purpose, create a `Section Component`.
- If it is a smaller reusable piece such as a repeated item inside a section, create an `Atomic Component`.
- When the atomic component is only used inside one section, keep it alongside that section's folder.
- When it is reused elsewhere, move it to the shared structure.

### When reviewing a component relationship

Context:
A component imports another component.

Decision:
Determine whether the imported component is a sibling section or a child/atomic piece.

Action:
- A `Section Component` should not directly relate to another `Section Component` as a peer dependency.
- A section component may react to local user events and update local state.
- If a section needs shared screen state, consume it through the selected framework's store adapter, or through `@javiani/onijs` vanilla when no adapter exists; use props only for explicit local inputs or composition.
- Do not let section components become hidden routers for other sections.

### When creating or updating constants

Context:
Fixed values or pure functions are needed.

Decision:
Check whether they are local to a screen or shared across screens.

Action:
- If local to a screen, put them in the domain's `constants/`.
- If reused across screens, place them in `shared/constants/`.
- Keep naming in `SCREAMING_SNAKE_CASE`.

## Framework-specific conventions

Framework conventions such as `pages`, `app`, `routes`, or `page.tsx` may exist, but they are integration points, not architectural replacements.

The architecture remains the same even when a framework imposes a route file.

Example:

```tsx
// app/blog/page.tsx
import Blog from '@domain/blog'

export default async function Page() {
  const posts = await getPosts()
  return <Blog posts={posts} />
}
```

This route file is only the framework adapter. The actual screen composition lives in the `Domain` abstraction.

## Review checklist for architecture violations

Before approving a change, inspect these points:

- Does each screen live in a `Domain` folder and act as a standalone unit?
- Do all files and folders use `kebab-case`?
- Do components use `components/<component-name>/index` rather than component files directly under `components/`?
- Are external API/fetch functions under `services/<service-name>/index`?
- Are JSON mapping functions and data models under `entities/<entity-name>`?
- Do entity factories and structure types follow the documented noun and noun-plus-`Type` naming rules?
- Are entities pure adapters without network communication or persistence?
- Are external communication functions stateless services returning promises of entities?
- Does a screen use at most one `store/index` store when screen state persistence or component coordination is required?
- Does the store use `@javiani/onijs` and receive component-dispatched actions?
- Is the domain the highest-level screen component?
- Does each domain `index` file export only one public root component?
- Do state-dependent components consume shared state through the framework adapter instead of receiving it through prop drilling?
- Does a section component import another section component directly?
- Is a screen-specific abstraction placed in `Shared` when it is not truly cross-domain?
- Is a cross-domain abstraction kept in `Shared`?
- Are local constants inside the correct `Domain` or `Shared` location?
- Do constant names follow `SCREAMING_SNAKE_CASE`?
- Has a framework file been mistaken for the real structural abstraction?
- Are folder names and abstractions aligned with the domain/shared pattern?

## Forbidden practices

These are not allowed unless explicitly supported by the documented architecture:

- Do not infer architectural rules from known architecture schools or frameworks.
- Do not rename concepts to match Clean Architecture, DDD, or MVC terms.
- Do not treat a `Domain` as a generic business layer or a data layer.
- Do not create a new abstraction merely because it is considered a best practice.
- Do not place a cross-domain abstraction in a single screen folder if it is reused elsewhere.
- Do not let section components become peers of one another across the screen.
- Do not spread constants across fragmented folder structures.
- Do not put external communication or persistence inside entities.
- Do not create more than one store for a screen.
- Do not assume dependency rules that are not explicit in this skill or the source `knowledge/` files.

## Default implementation heuristic

If the architecture does not define a detail, choose the simplest implementation that preserves the documented structure:

- screen-level ownership stays with the `Domain`
- local support code stays close to that `Domain`
- reused abstractions move to `Shared`
- visual composition is assembled from `Section Components`
- repeated UI pieces become `Atomic Components`
- constants remain centralized and named consistently
- screen persistence and component coordination stay in the screen's single `@javiani/onijs` store

## Reference files

Use the source documentation for deeper details:

- `knowledge/index.md`
- `knowledge/domain/index.md`
- `knowledge/components/index.md`
- `knowledge/constants/index.md`
- `knowledge/entities/index.md`
- `knowledge/services/index.md`
- `knowledge/stores/index.md` when the screen uses shared state, persistence, or component coordination
- `knowledge/stores/index.md`

These files explain the architecture; this skill converts them into operational decisions for agents.
