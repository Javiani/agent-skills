---
name: ui-clean-architecture
description: Enforces the UI Clean Architecture described in references/knowledge/ for screen-oriented front-end implementations.
---

# UI Clean Architecture Skill

## Source of truth

Use `references/knowledge/` as the only source of architectural truth.

This skill compiles the knowledge in `references/knowledge/` into agent behavior. It does not reinterpret the architecture through Clean Architecture, DDD, Hexagonal Architecture, MVC, or any other known approach.

When a rule is unclear, do not invent one; keep the implementation minimal and aligned with the documented structure.

## Architectural invariants

1. Keep the project split into `layouts/`, `domains/`, and `shared/`.
2. Within each domain or shared abstraction, preserve the documented sub-structures for `components/`, `constants/`, `entities/`, and `services/` when applicable.
3. At the first level of each abstraction, `components/` and `services/` use semantic folders containing an `index` file, while `constants/` and `entities/` remain semantic flat files directly inside their folders.
4. Use kebab-case for folder and file names without exception.
5. Treat each domain as a standalone screen/page abstraction.
6. A domain must know its required inputs and outputs.
7. Section components are standalone and must not directly depend on sibling section components.
8. Components handle local UI events and local state.
9. Constants are exported; use `SCREAMING_SNAKE_CASE`.
10. Entities are factory-style adapters that transform raw payloads into application-shaped data.
11. Services are stateless functions that perform external communication and return entities or arrays of entities.
12. Framework files such as `page.tsx`, `app/.../page.*`, or equivalent route files act as integrators, not as the architecture itself.
13. Shared abstractions are only for cross-domain reuse.
14. A Domain entry point exports one public root component; secondary UI components live in their own `components/<component-name>/index` entry points.
15. Components that depend on shared store state consume it through the selected framework's store adapter, or through the framework-agnostic `@javiani/onijs` vanilla API when no framework adapter exists; do not drill store state through the Domain merely to reach descendants.
16. Use props for explicit inputs, local composition, or derived values, not as a transport path for shared store state.
17. Keep layouts and domains focused on composition with minimal structural HTML; extract detailed markup into components.
18. Prefer Section Components that group a meaningful horizontal context. Split them into smaller components only when those parts are needed for reuse by other components in the system.
19. Apply the code readability standard to all project code and every code snippet: consistent indentation, explanatory comments, clear naming and structure, and no compressed one-liners.

## Code readability

Apply this requirement to all code written, modified, reviewed, or presented as an example, regardless of architectural layer or language. Follow the readability standard in `references/knowledge/index.md`: use consistent indentation, include comments explaining intent and relevant decisions, and prefer explicit multiline blocks over one-liners. Keep names descriptive and separate logical steps so the code is easy to follow. Comments should clarify purpose, behavior, or constraints rather than merely repeat the syntax.

## Required reading before implementation

Before creating or modifying architecture-aware code, inspect the relevant architectural concepts in `references/knowledge/`:

- `references/knowledge/index.md` for the project structure and framework integration rules
- `references/knowledge/domain/index.md` for domain responsibilities and standalone screen behavior
- `references/knowledge/components/index.md` for section/atomic component boundaries and behavior
- `references/knowledge/constants/index.md` for constant organization and naming rules
- `references/knowledge/entities/index.md` for entity factory/adaptation rules
- `references/knowledge/services/index.md` for stateless service responsibilities and return contracts
- `references/knowledge/stores/index.md` for store contracts, framework adapters, and state subscription rules when the screen uses shared state

If the task involves a screen, domain, shared abstraction, reusable component, constant, entity, or service, load the relevant section before deciding the implementation.

## Decision flow

Use this sequence for every implementation task:

1. Identify affected architecture concepts.
2. Determine whether the task changes a `layout`, `domain`, `shared`, `component`, `constant`, `entity`, or `service`.
3. Check the relevant `references/knowledge/` guidance before editing code.
4. Choose the implementation that respects the architecture without inventing new architectural rules.
5. Validate the result against the known invariants.

## Structure rules

### Layouts
When creating or modifying a layout:
- keep only the standard HTML shell, minimal structural wrappers, and frame-level composition in `layouts/`
- extract detailed frame markup into components, preferably cohesive Section Components such as headers and footers; import and compose them in the layout
- do not blur layout concerns into domain logic
- preserve the architecture's separation between layout shell and domain page composition
- store layouts as flat files (e.g., `default.tsx`, `admin.tsx`) without deep nested folders

### Domains
When creating or modifying a domain:
- treat the domain as a standalone screen or page
- include all required components, constants, entities, and services needed for that screen
- let the domain know its required inputs and outputs
- keep domain-local abstractions in the domain unless they are reused across domains
- use the framework route or page integration layer to resolve route parameters, load required context, and render the domain
- keep detailed HTML in Section Components and let the Domain compose and coordinate them
- export only the Domain root component from the domain `index` file; move every secondary UI component to its own component entry point
- do not read shared store state in the Domain solely to pass it to descendants

### Shared
When creating or modifying a shared abstraction:
- only place it in `shared/` if it is reused across domains
- mirror the same structural discipline as the domain abstraction, including shared `components/`, `constants/`, `entities/`, and `services/` when applicable
- do not move domain-local code into shared just because it is reusable in one screen

### Components
When creating or modifying a component:
- default to a Section Component that keeps contextually related elements together as a meaningful horizontal block
- extract smaller atomic components only for concrete reuse by other components; file length, isolated HTML elements, or speculative reuse alone do not justify splitting a section
- if it is a section component, keep it purpose-specific and standalone, folder-organized under `components/` with a semantic folder name and an `index` entry point
- give each Section Component its own entry point and one public component export
- if it is an atomic component used only within one section component, place it in a subfolder within that section component's folder
- if an atomic component is used by multiple section components within the same domain, place it as a sibling folder alongside the section components
- if an atomic component is used across multiple domains, place it in `shared/components/`
- section components must not directly depend on sibling section components
- components react to user events and update local state when needed
- components that depend on shared screen state use the framework's store adapter locally, or the framework-agnostic `@javiani/onijs` vanilla API when no adapter exists
- pass explicit inputs to children when needed, but do not prop-drill shared store state through the Domain or unrelated intermediate components

### Entities
When creating or modifying an entity:
- use a factory-style entity function and its corresponding typed structure
- name the entity with a noun (for example, `Movie`) and its structure with the noun plus `Type` (for example, `MovieType`)
- expose the factory function as the public API of the entity file
- declare raw-payload defaults directly in the factory signature with destructuring
- keep private transformation helpers below the exported factory function
- keep raw-to-application mapping logic inside the entity abstraction
- adapt JSON payloads into the application's shape without mixing adaptation rules into a component or service
- keep entities framework-agnostic and free of network communication or local persistence
- store entity files semantically in `entities/` as standalone files rather than nesting them in component folders

### Services
When creating or modifying a service:
- keep the service stateless and focused on external communication
- return `Promise<Entity>` or `Promise<Entity[]>` as documented
- place service logic under a contextual `services/<service-name>/index` pattern in the relevant domain or shared scope
- treat HTTP or API calls as service concerns, not domain or component concerns

### Stores

- Use `@javiani/onijs` for screen state stores.
- Keep at most one store per screen and place it at `store/index.ts` within that screen's domain.
- In React, use `@javiani/onijs/react` and `useStore()` in state-dependent components; do not use the vanilla subscriber to trigger React renders.
- In non-React applications, use the framework-agnostic `@javiani/onijs` API and connect `getState`, `dispatch`, and `subscribe` to the framework's own reactive mechanism.
- Keep `initialState` in a named constant and declare the actions object inline in the `Oni` or `createStore` call; do not extract actions into a separate constant.
- Name every action in `SCREAMING_SNAKE_CASE` and pass payloads as objects with named properties, including single-value payloads.
- Keep actions pure by default. An action may use the third-argument `{ dispatch }` helper to make an asynchronous transition explicit by dispatching another action.
- Never perform local or session persistence inside an action. Register persistence outside the actions with `store.subscribe`.
- Filter subscriber side effects by the received action with `switch (action)` when only specific actions should trigger them.

### Constants
When creating or modifying constants:
- centralize values in exported constants
- use `SCREAMING_SNAKE_CASE` for all constant names (variables and functions)
- prefer pure derived values or fixed values over scattered literals
- accept `process.env`-based values when the architecture requires system constants
- keep constants semantically grouped in dedicated files rather than in component directory nesting
- store constants as flat files (e.g., `environment.ts`, `api.ts`) directly inside `constants/`, without deep nested folder structures

This matches the architecture's rule that `constants/` and `entities/` remain flat semantic files at the first level of each abstraction, while `components/` and `services/` use semantic folders with an `index` file.

## Operational guidance

### Create a feature
When creating a feature for a screen:
1. Determine whether it is a domain, a section component, an atomic component, an entity, a service, or a constant.
2. Place it according to its scope: domain-local or shared.
3. Compose the screen from the domain root.
4. Keep section boundaries independent and stacked top-to-bottom.
5. Use framework route files only to integrate the domain into the page lifecycle.
6. Let each state-dependent component consume shared screen state through the selected framework's store adapter, or through `@javiani/onijs` vanilla when no adapter exists.
7. Pass only explicit component inputs and derived values; never transport shared store state through unrelated components with prop chains.

### Modify an existing feature
Before modifying a feature:
1. Identify the domain or shared abstraction the feature belongs to.
2. Check whether the change affects a local component, a shared component, an entity, a service, or a constant.
3. Preserve the architecture's domain boundary and section independence.
4. Do not relocate local screen logic into shared abstractions unless the architecture explicitly supports reuse across domains.

### Refactor code
When refactoring:
1. Maintain the legal structure: layouts, domains, shared, components, constants, entities, and services.
2. Prefer reducing duplication without changing architectural ownership.
3. Keep domains standalone.
4. Keep section-to-section coupling forbidden.
5. Do not preserve a confusing structure just because it works in one framework.

### Review a pull request
Review for architecture adherence by checking:
- Is all code consistently indented, clearly structured, and accompanied by explanatory comments, with compressed one-liners expanded into readable blocks?
- Is the structure still `layouts` / `domains` / `shared`?
- Are the documented sub-structures still respected for components, constants, entities, and services when applicable?
- Is each screen still a domain with clear inputs and outputs?
- Does each domain `index` file export only one public root component?
- Do state-dependent components consume shared state through the framework adapter instead of receiving it through prop drilling?
- Do layouts and domains compose components with only minimal structural HTML?
- Do Section Components keep related elements together, with smaller components extracted only for concrete reuse by other components?
- Are section components still isolated from sibling sections?
- Are constants still centralized and properly named?
- Are framework route files used as integrations rather than as the architecture definition?

### Integrate an external API or system value
When integrating external systems:
1. Determine whether the integration is a constant, an entity, a service, a shared abstraction, or a domain requirement.
2. Do not invent an architectural layer that the knowledge does not define.
3. Keep framework route conventions at the boundary only.
4. Preserve the screen/domain responsibility model.

## Forbidden actions

Never:
- rename the architecture into Clean Architecture, DDD, Hexagonal Architecture, or another external methodology
- treat a framework convention as a top-level architectural rule
- move section dependencies into sibling section components
- create domain logic that is not owned by the domain
- scatter constants across component folders in a deep nested structure
- convert example code into a mandatory standard unless the knowledge explicitly says so
- invent missing architectural rules to fill gaps, including undocumented state-persistence or data-fetching layers

## Framework-agnostic rule

The architecture is independent from frameworks. A route file may follow the framework's route convention, but the architecture still remains: layouts, domains, shared, components, constants, entities, services.

When a framework is swapped:
- keep the same architecture
- change only the route integration or page wrapper mechanism
- do not reinterpret the architecture to fit the framework's conventions

## Quick reference

- `layouts/`: page shell and reusable cross-screen frame
- `domains/`: screens/pages with local dependencies and composition
- `shared/`: cross-domain reusable abstractions
- `components/`: section and atomic UI blocks
- `constants/`: exported fixed and derived values in `SCREAMING_SNAKE_CASE`
- `entities/`: raw-to-application data adapters and typed page models
- `services/`: stateless external communication and API functions

## Supporting material

For detailed rule tracing and architecture-model context, see:
- `references/architecture/extracted-rules.md`
- `references/architecture/architecture-model.md`
- `references/architecture/uncertainties.md`
- `references/architecture/architecture-reference.md`
