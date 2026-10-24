---
name: ui-clean-architecture
description: Implement, refactor, and review screen-oriented front-end applications using UI Clean Architecture. Use when organizing layouts, screen domains, shared components, entities, services, constants, or screen stores, or when checking an application against this architecture.
---

# UI Clean Architecture

Organize front-end applications around standalone screens, cohesive UI sections, and explicit ownership of state, data adaptation, and external communication.

## When to apply

- Implement a screen or feature using UI Clean Architecture.
- Refactor an existing application into layouts, domains, and shared abstractions.
- Review component boundaries, store consumption, or architectural responsibilities.
- Maintain this skill against its source documentation.

## How it works

1. Inspect the affected screens, routes, framework, existing abstractions, and user flows. Identify the requested scope before changing structure.
2. Read the [architecture overview](references/knowledge-overview.md) and only the relevant knowledge references in the table below before deciding the implementation.
3. Read the [implementation guide](references/implementation-guide.md) for the applicable creation, modification, refactoring, or review workflow and detailed code conventions.
4. Assign each responsibility to its documented owner. Keep framework route files as integration boundaries and preserve user-visible behavior during refactoring.
5. Check the result against the invariants below and the applicable source rules. Run relevant project checks; report changes, verification, and unresolved ambiguities.

## Source of truth

The knowledge references below are the only source of architectural truth. Preserve this architecture's terminology and framework independence. Do not reinterpret it through Clean Architecture, DDD, Hexagonal Architecture, MVC, or another methodology. When a rule is unclear, keep the implementation minimal and report the ambiguity instead of inventing a rule.

The implementation guide operationalizes those sources. Auxiliary architecture summaries are supporting material; if a summary or historical uncertainty conflicts with current knowledge, follow the knowledge reference.

## Reference guide

| Task | Read |
| --- | --- |
| Project structure, layouts, shared scope, type ownership, or framework integration | [Architecture overview](references/knowledge-overview.md) |
| Screen responsibilities, inputs/outputs, and domain composition | [Domains](references/knowledge-domain.md) |
| Section/atomic boundaries, component placement, and local behavior | [Components](references/knowledge-components.md) |
| Constant naming, grouping, and file organization | [Constants](references/knowledge-constants.md) |
| Raw-payload adaptation and typed factory contracts | [Entities](references/knowledge-entities.md) |
| Stateless external communication and return contracts | [Services](references/knowledge-services.md) |
| Shared screen state, framework adapters, actions, or persistence | [Stores](references/knowledge-stores.md) |
| Implementation conventions, feature work, refactoring, or review | [Implementation guide](references/implementation-guide.md) |
| Trace summarized rules to their sources | [Extracted rules](references/extracted-rules.md) |
| Inspect the supporting architecture model | [Architecture model](references/architecture-model.md) |
| Consult the supporting architecture summary | [Architecture reference](references/architecture-reference.md) |
| Investigate previously recorded gaps against current knowledge | [Historical uncertainties](references/uncertainties.md) |
| Update this skill from its knowledge sources | [Skill maintenance](references/update-skill.md) |

Inspect the affected project's own `types.ts` files when changing application-owned types. Use the owning abstraction for local types and the nearest common parent for shared types.

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
20. Place application-owned TypeScript types in `types.ts` inside the specific abstraction that uses them. When multiple abstractions consume the same type, place it in `types.ts` at their nearest common parent; do not move all types to the Domain or Shared root by default.

21. Keep a store's `initialState` as a simple in-memory default. Read persisted state outside the store and dispatch a restoration action from the screen component or another integration point; keep restoration validation and state transitions in that action, and persistence writes outside actions.
22. Keep actions focused and readable. Extract complex validation or transformation into module-level arrow-function helpers below the store and subscriber declarations, and never return a helper call directly from an action. The action receives the helper's named values and explicitly composes the returned state, spreading `state` and listing each property it changes.
23. Add one blank line immediately before and after each action definition in the actions object.

## Present results

Describe the affected screens and abstractions, the concrete changes, and the checks performed. For reviews, identify actionable deviations and their source rules. For skill maintenance, report changed files, any changed architectural rules, and unresolved contradictions.
