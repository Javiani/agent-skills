---
name: ui-clean-arch
description: Create frontend web applications or completely refactor existing applications using ui-clean-arch, with a domain per screen, Components, Store, Services, and Entities. Use when the user requests ui-clean-arch or invokes $ui-clean-arch. The separate ui-clean-architecture skill has its own rules; do not substitute this skill for it or impose it on unrelated work.
---

# ui-clean-arch

## Invocation and coexistence

Invoke this skill with `$ui-clean-arch`. The separate `$ui-clean-architecture` command selects a different skill with its own specification. Both skills coexist; neither replaces the other. Follow the explicitly selected skill's references without combining their rules. If a request leaves the choice ambiguous and the difference affects implementation, ask which skill to use.

Build the complete application with this architecture or fully migrate an existing application while preserving behavior and functionality. The architecture is UI-framework agnostic; of its four official abstractions, only Components may depend on that framework.

Read [the specification](references/architecture.md) before implementing. It records the author's decisions, examples, and choices left to the application. For recognizable Entity design, consult [the example](references/entity-example.js); its fields, strings, and currency are illustrative, not universal defaults.

## Procedure

1. Identify creation or refactoring. Inspect the project, framework, conventions, screens, integrations, and available checks. For refactoring, map existing behavior before restructuring.
2. Map each screen to a domain and its meaningful sections to structural Components. Identify local state, Store-coordinated behavior, integrations, and data adaptation. Keep exclusive resources in their domain; reserve shared for cross-domain reuse.
3. Implement or migrate the complete architecture. Use verifiable stages when useful, without presenting a partial migration as complete. Preserve functionality; architectural work does not authorize product changes.
4. Verify the boundaries and contracts below, run appropriate functional checks, and compare behavior with available references. Report verified outcomes and actual limitations; do not claim equivalence without evidence.

Ask when a product or behavior decision is missing. First search the context and code for answers. Resolve implementation details through context, these architectural rules, and application conventions. Do not repeat recorded questions or invent missing requirements.

## Readability as a premise

Prioritize understanding throughout the source: use consistent indentation, spacing, and line breaks that reveal logical blocks, contracts, and UI composition. Avoid compressing functions, control flow, large objects, or UI trees onto a single line. Separate steps visually and follow language/project conventions. Do not mandate a line limit or specific tool; generated or minified distribution artifacts are exceptions.

## Co-located types

In TypeScript code, keep type definitions out of implementation files and inline signatures. Extract named types and interfaces into a `types.ts` co-located with the context that owns them, and import them with `import type` where appropriate. Ordinary annotations referencing named or built-in types remain in the implementation.

The folder defines the reuse scope: `services/types.ts` holds contracts reusable by Services in that folder; `services/capability/types.ts` holds types specific to that grouping. Apply the same rule to Components, Store/actions, Entities, and auxiliary abstractions. Choose the closest owning context; do not collect unrelated types in a global file or create empty `types.ts` files. Type imports must respect the same layer and domain/shared dependency boundaries as other imports.

## Essential contracts

- **Components:** meaningful screen sections independent of responsive arrangement. Layout containers are not architectural abstractions. Components may manage events and state confined to the section without persistence. For persistence or propagation across Components, connect to Store actions and render the received state.
- **Store:** exactly one per screen. Actions receive current state and optional parameters and return the next state; they may await external capabilities. The Store executes actions and notifies listeners with the action and complete updated screen state. Support selective reactions through subscriptions or received information to avoid unnecessary rendering. Mutation, immutability, and subscription mechanisms depend on the library; the Store remains independent of the UI framework.
- **Services:** functions, never classes, with no retained state. They mediate external integrations such as fetch, localStorage, and backend APIs. Always receive a single object and return a Promise of an object or list of objects, including when wrapping synchronous APIs. The application defines the concrete result shape. Components, Stores, and actions do not access these integrations directly.
- **Entities:** pure, synchronous, stateless functions adapting and formatting data for semantic UI consumption. Receive one object with properties destructured and defaulted in the signature. May compose other Entities. Services normally apply them to retrieved objects or map them over lists. Handle null in the consuming Entity when the contract requires it; do not add indiscriminate validation. Property defaults do not replace explicit null.

Persistence means the requirement to retain the latest state through local or remote capabilities. If business rules allow losing state when returning to the screen or reloading, persistence is not required. Propagation across Components requires a Store even without persistence.

## Dependencies

Allow direct access to inner layers without mandatory traversal of intermediate layers:

| Source | May import |
| --- | --- |
| Components | Stores, Services, Entities |
| Stores and actions | Services, Entities |
| Services | Entities |
| Entities | No outer layer |

Forbid reverse dependencies. Allow same-layer composition described in the specification, including components, Service wrappers, and complementary Entities.

Domains may import shared. Never allow a domain to import another domain or shared to import or know about domains. A shared component receives props or a Store injected by its parent, which may be the screen index or a structural component.

## Organization

Placement depends on the framework; src is a suggestion. Routes follow framework conventions. Each screen is a domain:

```text
domain/
└── statement/
    ├── index.extension
    ├── components/
    │   └── cards/
    │       ├── index.extension
    │       ├── invoice.extension
    │       └── due-date.extension
    ├── store/
    │   ├── statement.extension
    │   └── actions.extension
    ├── services/
    │   └── capability/
    │       └── index.extension
    └── entities/
        └── entity/
            └── index.extension
shared/
├── components/
├── store/
├── services/
└── entities/
```

Scenario names and .extension are illustrative. Use the appropriate extension. Do not create empty folders or files solely to reproduce the tree.

- The domain index imports structural components and composes the screen. Each structural component has its own folder and index.
- Atomic extraction is optional. Within domains, extracted atomic components stay in their structural owner's folder. Do not promote them to the screen root or structural level. Another structural component in the same domain may import them for a strong reason; duplicating HTML for independent evolution is valid and may be preferable.
- Structural and atomic components may be at the same level in shared/components.
- Use singular store. Its file follows the domain name and imports actions. shared/store contains shareable actions, not a common state Store across screens.
- Services and Entities use a folder per grouping with index, allowing optional internal files and multiple complementary functions per file.
- Auxiliary folders such as constants and formatters are optional, not new official abstractions. Other auxiliary abstractions may depend on the framework without introducing that dependency into Stores, Services, or Entities.
- layouts/default.extension is an option for a recurring shell using headers, footers, or other shared components. Do not mandate that file or move screen-exclusive elements to shared.

## Final verification

Review source readability, including styles, markup, and tests; expand compressed sections before finishing. Review imports along both axes: layers and domain/shared. Check one Store per screen, shared actions without common state, complete-state notifications, integrations encapsulated in Services, and Entity purity. Check composition indices and exclusive/shared resource placement. Check that type definitions live in context-owned `types.ts` files, with reuse scope reflected by their folder and imports respecting architectural boundaries. Use application-appropriate functional checks to demonstrate preservation or requirement fulfillment. Structural validation of the skill package is not proof of correct application behavior.
