# ui-clean-arch — architecture specification

## Readability — an architectural premise
Prioritize readers' understanding of the code. Use consistent indentation, spacing, and line breaks to make logical blocks, function inputs and outputs, and UI composition explicit.

Avoid compressed code: do not squeeze functions, control flow, large objects, or UI trees onto a single line. Separate steps and responsibilities visually without imposing a fixed line count or a particular formatter. Follow language and project conventions when compatible with this premise.

This premise applies to all layers and developer-maintained code, including styles, markup, and tests. Generated and minified distribution artifacts do not need source-level formatting.

Review criterion: readers should be able to recognize and follow the flow, contracts, and composition without first expanding or reformatting the code. Functionally correct code with compressed sections still requires a readability review.

## Objective
Define an original architecture and a skill for creating and refactoring applications with little ambiguity and verifiable criteria.

## Confirmed starting points
- The reference diagram is `../../ui-clean-architecture-light.svg`.
- From outside to inside, its abstractions are Components, Stores, Services, and Entities.
- The architecture includes responsibilities, folder structure, and rules for locating each abstraction.
- Definitions were developed with the author; names and circles alone do not establish rules.
- The focus is frontend UI development.
- The architecture should be as framework-agnostic as possible and work with any framework.
- Framework-specific elements are allowed in Components; the precise limits are recorded below.
- Responsibilities were defined progressively, one abstraction at a time.

## Topics initially left undefined
The following list records the starting agenda, not unresolved requirements that override the later decisions:
- Concrete limits on framework-specific elements.
- Responsibilities and boundaries of each abstraction.
- Meaning of the circles and dependency, import, and execution rules.
- Folder structure, sharing, and composition.
- Flows, error handling, effects, and state.
- Validation criteria for creation and refactoring.

## Proposed conversation sequence
1. Scope and a concrete reference case.
2. Responsibilities and boundaries of the four abstractions.
3. Dependencies and a complete flow.
4. Folders and placement criteria.
5. Ambiguous cases and refactoring existing applications.
6. Skill authoring and behavioral validation.

The sequence can change as answers arrive. A proposal becomes an architectural rule only after the author's confirmation.

## Criteria for consolidating a rule
Record the decision, its motivation, an example, and a way to verify compliance. Add a counterexample when useful for distinguishing responsibilities.

## Components — confirmed definition
Components are the UI layer and may control local behavior and state within the limits below. Behavior requiring persistence or propagation across Components must connect to an external action. The other layers handle behavior beyond the section, application rules, integration, and persistence; their responsibilities are specified in their own sections.

A Component represents a section with its own meaning or context within an entire screen. Horizontal or stacked arrangements do not constrain the architecture. The architectural division follows screen context. This applies to any screen, business, or frontend web application.

Each Component aggregates all of its section's content. It may import smaller reusable components to form the larger section. A reusable visual element is not automatically a screen section. Both structural sections and atomic elements are components; the abstraction discussed here is at the highest screen level.

Identify sections from the whole screen. Do not automatically treat every icon, button, or list item as a separate architectural Component.

### Review criteria derived from the definition
Check that each Component represents a meaningful screen section and aggregates its internal elements. Behavior kept in Components must remain within the section and require neither persistence nor propagation across Components. Application rules, integration, and persistence belong to the other layers.

### Layout and responsiveness — confirmed
The abstraction remains identical on desktop and mobile. Cards and Recent transactions remain two Components even when placed side by side.

A container may wrap these pieces and arrange them differently for each layout. It has no architectural abstraction value; it only wraps and visually arranges Components. Changing the arrangement does not create, merge, or redefine abstractions.

Review criterion: identify Components by context, independently of breakpoint or visual position. Do not turn a layout-only grouping into a new abstraction.

### Local and external behavior — confirmed
- If behavior changes only the section internally and requires no persistence, the Component listens for the event, changes local state, and renders accordingly.
- If behavior requires persisting information or propagating the action to other Components, the Component connects the event to an external action and renders the received state.

Local example: clicking the eye hides only that card's balance without saving the preference.

External example: clicking the eye must also hide values in Cards or in every Component on the screen. Persisting the preference is another external case, even when only one section changes visually.

Decision criterion: if the effect is confined to the Component and does not need persistence, state may be local. If persistence or propagation is required, connect to an external action and render the received state. The Store definition below identifies the coordinating abstraction.

### Persistence — confirmed definition
Persistence is the requirement to retain a behavior's latest state using local capabilities or remote backend storage. The requirement comes from business rules, not the choice of storage technology.

If business rules allow state to be lost when returning to the screen or reloading, the scenario does not require persistence. If the latest state must be retained, it does.

Persistence and propagation across Components are independent criteria: even without persistence, an effect that must reach other Components requires an external action.

### Structural and atomic components — confirmed
Both are components. At screen level, Components refers to structural components that internally compose smaller atomic components.

Atomic component files must not be siblings of structural component files at the screen's component level. Both can belong to the same encompassing folder; the precise hierarchy is specified in the folder sections below. Do not infer extra sharing rules from this statement alone.

### Component topics addressed later
State delivery, external action connections, framework variation, structural and atomic folder organization, sharing, and whole-screen composition are detailed in the later sections.

## Stores — confirmed definition
A Store connects Components when an action requires behavior to be reacted to and updated across them. It is responsible for retrieving and persisting screen state through external capabilities.

### Read mode
A Component imports a Store capability to listen for changes and update its local state. It has access to the state and the action that triggered the change.

### Write mode
A Component imports a capability to execute a Store action when other Components must react or the result must be persisted. Parameters are optional. The Store uses this information to determine the next state.

### Review criteria derived from the definition
- Reading lets the Component react to changes with access to state and the triggering action.
- Writing executes Store actions, with parameters when needed.
- The writing Component does not need to update other Components directly: they react through the Store's read capability.
- The architecture does not prescribe a library, concrete subscription API, or framework-specific implementation for these capabilities.

### Retrieval and persistence — confirmed boundary
The Store invokes an external capability to retrieve and persist state. It does not access local storage or the backend directly. Services provide this integration boundary, as defined below.

Review criterion: the Store must invoke retrieval and persistence through an external capability rather than implement direct storage access.

### Scope and reuse — confirmed
There must be exactly one Store per screen. Each screen owns its Store; behavior is reused across screens by sharing actions, rather than sharing the Store itself.

Actions may be organized as functions or objects containing functions. When an action's behavior is reusable across screens, share that behavior through these actions.

Author's motivation: greater decoupling and autonomy so that each screen is more standalone.

Review criterion: verify one Store per screen and cross-screen behavior reuse through shared actions. The action contract is defined below; do not infer purity or a composition mechanism beyond the explicit rules.

### Action and notification contract — confirmed
Actions are functions receiving the current state and optional action parameters from the Store. They return a new state to the Store.

After receiving the new state, the Store notifies registered listeners with the action and the complete updated screen state. It must not provide only the portion changed by the action. Notification is the Store's responsibility.

Conceptual flow, without prescribing a framework API or language signature:
1. A Component executes an action through the Store's write capability.
2. The Store supplies current state and optional parameters to the action function.
3. The action returns the next state to the Store.
4. The Store notifies registered listeners with the action and complete updated screen state.
5. Listening Components may update local state and render accordingly.

Objects containing functions may organize actions; the executed actions are functions following this contract. Sharing reuses behavior applied to the state supplied by each Store. Do not introduce common screen state as an automatic consequence of reuse.

### Complete state and implementation details — confirmed
Mutation or immutability depends on the application's Store library. Both are allowed; the architecture does not mandate either one.

The mandatory notification contract supplies listeners with the entire screen state, not just fields changed by the action. For example, changing value visibility must notify with the full screen state, including the other information maintained by the Store.

Review criterion: inspect what the listener receives after the action. It must include the complete updated screen state, regardless of mutation strategy or library.

### Selective reactions — confirmed
Subscription mechanisms depend on the Store library and application needs. Both strategies are allowed:
- The Store supplies enough information for a Component to decide whether to react, such as the called action's identity.
- The Store simplifies registration for the specific actions to which the Component should react.

The architecture requires a way to distinguish relevant changes and avoid unnecessary rendering. It mandates neither a filtering API nor a particular library. Either strategy must preserve notification of the action and complete updated screen state.

Review criterion: an irrelevant action can be filtered at subscription time or ignored by the Component using the received information, without causing an unnecessary render from that notification.

### External capabilities and asynchronous execution — confirmed
An action may invoke an external capability and await its result to produce the next state. Asynchronous actions are allowed, but not all actions must be asynchronous.

This work can happen inside the action. The Store remains responsible for notifying listeners with the action and complete updated state. External integrations follow the Service rules below.

### Store topics not fully prescribed
- Store lifecycle and isolation between instances of the same screen.
- Application-specific limits on the external capabilities used by actions.
- Concrete contracts for retrieval and persistence Services.
- Initial state, action representation, notification order, and unsubscription when requirements extend beyond the library's behavior.
- Error handling and concurrency for asynchronous actions, when applicable.

## Services — confirmed definition
A Service is a capability that abstracts integration with pieces or APIs external to the application.

Confirmed examples:
- localStorage access to persist or retrieve data must go through a Service.
- Backend API requests must go through a Service.

### Mandatory contract
- Receives exactly one parameter: an object with named properties. Do not use multiple positional parameters.
- Is always asynchronous, even when wrapping a synchronous capability such as localStorage.
- Always returns a Promise of an object or a Promise of a list of objects.

The single parameter makes extending inputs easier and reduces major signature or contract breakage. It does not guarantee compatibility for every property change.

Review criteria: verify the integration boundary, single object input, and asynchronous object or object-list output. Direct primitive returns or no result do not satisfy the contract.

### Integration boundary and return format — confirmed
Components and Stores must not access integration capabilities such as fetch or localStorage directly. These accesses must always be mediated by a Service, including calls made within actions.

The concrete return object's shape is defined by the user and application for the scenario. The architecture does not mandate an envelope such as `{ success: true }` or require returning the persisted data. A Promise of an object or list of objects remains mandatory.

Review criterion: external capabilities must be encapsulated in Services, with no direct access from Components, Stores, or actions. Do not impose an undefined result format on the application.

### Form and absence of state — confirmed
Services must be functions, not classes. They provide read and write access to external layers, resources, and APIs.

They must not retain local state or persist information or data within themselves. Persistence through a Service happens in the accessed resource, such as localStorage or a backend, not inside the Service.

Review criterion: verify function implementations and no retained Service state. Do not implement classes or store data between calls in the Service.

### Service topics not fully prescribed
- How failures are communicated.
- Scenario-specific response contracts. The Entity section describes the normal adaptation pattern, without requiring every response to be adapted.
- The dependency section defines permitted layer imports.

## Entities — confirmed definition
Entities work with data: they adapt the shape of information retrieved from external sources into a semantic, UI-friendly format compatible with the application. Components should not need to format these data.

### Recognizable design
- Functions receiving a single object.
- Properties destructured in the signature to make inputs explicit.
- Default values for first-level properties.
- A semantic return format for application consumption.
- Follow the author's recognizable design: named functions such as Product and ProductPrice, identified by an `@Entity` comment, which may compose other entities.
- A file may contain multiple complementary entities.

### Use by Services
Entities are normally used by Services. A Service may pass a retrieved object to an entity and return the adapted result. For a list, it may apply `.map`, passing each item to an entity.

An entity can compose another entity's result. In the author's example, Product returns product fields and a price property built from ProductPrice, which supplies raw, discount, and formatted values. Currency formatting happens in the entity rather than the Component.

The original reference example is [entity-example.js](entity-example.js). Its fields, default strings, and currency belong to the ecommerce scenario; they are not universal architectural defaults.

### Null values and validation — confirmed
When using information could cause invalid access because of null, handle it inside the entity that uses the information, when needed.

The user or developer decides whether validation is necessary based on the scenario and confidence in the data contract. Do not require null checks for every field or universal normalization by the caller.

JavaScript precision: destructured property defaults cover missing values or undefined, not explicit null. They do not provide complete null safety on their own. The original example illustrates the design without introducing validation the author did not require for that scenario.

Review criterion: when the application contract permits null and using it could fail, verify handling in the consuming entity. When presence is guaranteed by contract, do not add checks solely as an architectural convention.

### Purity and execution — confirmed
Entities must be pure functions: they only transform received data, synchronously, without retaining state between calls.

They perform no external integrations or other side effects, do not modify input data, and produce the same result for the same inputs. Entity composition follows the same limits.

Review criterion: verify synchronous transformation, no retained state, no external effects, and no input mutation. Entity purity does not replace the implementation freedom already granted to Stores.

### Entity topics not fully prescribed
- Scenario-specific adaptation boundaries and invalid-input handling beyond defaults.
- The dependency section defines permitted imports and allows use outside Services.

## Folder structure — one domain per screen
Each screen is a domain in this architecture. Domain means a screen; do not substitute presumed business-domain groupings for this definition.

Illustrative folder structure for a screen domain:

```text
domain/
└── statement/
    ├── components/
    ├── services/
    ├── entities/
    ├── store/
    ├── constants/
    └── formatters/
```

Abstractions specific to and used only by this screen must be colocated in its domain for easier access and discovery. The store folder still represents a single Store per screen; file organization is detailed below.

constants and formatters are examples of auxiliary folders, not official abstractions or mandatory directories. Applications are not restricted to the four official abstractions: add folders for specific problems as needed.

The tree illustrates extensibility. Do not require constants or formatters in every domain or create auxiliary folders without a concrete need.

### Review criteria
- Each screen is represented by its domain.
- Screen-exclusive abstractions stay in that domain.
- Auxiliary folders may address concrete application problems without becoming new official abstractions.

### Structural topics addressed later
Code-root location, framework conventions, internal folder organization, structural and atomic components, whole-screen composition, and shared resources are covered in the following sections.

## Component organization — confirmed
Inside components, each structural screen component has its own folder. Its implementation entry point is an index file with the technology's extension. This file composes and imports internal or external atomic components.

```text
domain/
└── statement/
    └── components/
        ├── header/
        ├── balance/
        ├── menu/
        ├── cards/
        │   ├── index.extension
        │   ├── invoice.extension
        │   └── due-date.extension
        ├── transactions/
        └── footer/
```

.extension is an illustrative placeholder, not a literal extension to create. The other structural folders use the same index entry convention without requiring additional atomic files.

Extracted atomic components live inside their structural owner's folder. Thus index, invoice, and due-date can be sibling files inside cards; atomic files are not siblings of the structural components at the components level.

### Optional extraction
A structural folder may contain only index, without splitting content into atomic files. The developer decides.

Extraction is suggested when code becomes extensive or when reuse by other structural components in the same tree is justified. Do not impose a numeric line limit or automatically create a file for every visual element. The reuse criteria below refine this guidance.

### Review criteria
- Structural sections have folders inside components and index entries with the appropriate extension.
- Extracted atomic components stay inside their structural owner's folder.
- Respect decisions not to extract; assess extraction based on code size and justified reuse.

## Atomic component reuse within one domain — confirmed
Do not promote an atomic component to the screen root or structural component level to enable reuse. Keep it inside the structural owner identified by the developer from context.

Another structural component in the same domain may import and depend on that atomic component when necessary. This coupling requires strong justification; do not extract or share automatically just because HTML looks similar.

Excessive reuse at this level can cause more problems than benefits. Duplicating HTML is a suitable alternative when sections need independent evolution. The extraction guidance should be read accordingly: reuse is possible, not automatically preferable to autonomy.

Review criteria:
- Preserve the location distinction between structural and atomic components.
- When reusing across structural components, keep the atomic component with its owner and assess the coupling justification.
- Accept duplicated HTML when it supports independent evolution; avoid mechanical deduplication.

This decision concerns reuse within one domain only. Cross-domain sharing is defined below.

## Shared — cross-domain sharing
shared is a sibling of domain, reserved specifically for resources reused across domains. It is a flexible location for that scenario, not a general destination for code without a clear home.

Its organization resembles a domain, described by the author as a screen without UI, preserving the same abstractions for reuse:

```text
domain/
└── ...
shared/
├── components/
├── store/
├── services/
└── entities/
```

The screen-without-UI analogy describes organization; it does not remove the explicitly specified components folder.

Review criterion: keep exclusive abstractions in their domain and use shared specifically for cross-domain reuse.

### shared/store — confirmed
shared/store holds shareable actions used by domain Stores. It does not represent a Store with common state across screens. Each domain retains its own Store and state, reusing action functions when needed.

Review criterion: shared/store shares behavior through actions while preserving one Store per screen and domain autonomy.

## Dependencies between domain and shared — confirmed
- Domains may depend on shared.
- A domain must never import directly from another domain.
- shared must not import from domains or know they exist.

Cross-domain reuse must follow this direction through shared resources. Moving a resource to shared must not introduce dependencies back into a domain.

Review criterion: prevent domain/A → domain/B and shared → domain. The permitted direction at this boundary is domain → shared.

## Dependencies between layers — confirmed
Access goes from the outermost layer toward inner layers: Components → Stores → Services → Entities. Direct access to inner layers is allowed without traversing every intermediate layer.

| Source | Layers it may import |
| --- | --- |
| Components | Stores, Services, Entities |
| Stores, including actions | Services, Entities |
| Services | Entities |
| Entities | No outer layer |

The reverse direction is forbidden. This table describes cross-layer dependencies; it does not prohibit confirmed same-layer composition, such as composed entities and internal components.

Components may call Services directly when needed; not every integration must pass through a Store action. This does not remove the Store requirement for persistent or cross-Component behavior or authorize direct fetch or localStorage access.

The domain/shared rules apply together with layer rules. Being in an outer layer does not authorize importing another domain or allowing shared to know about a domain.

Review criterion: verify both layer direction and the domain/shared boundary. Do not require sequential passage through intermediate layers.

## Screen composition — confirmed
The index file at the domain root imports structural components and composes the entire screen. Its extension depends on the technology.

```text
domain/
└── statement/
    ├── components/
    ├── services/
    ├── entities/
    ├── store/
    ├── ...
    └── index.extension
```

Do not confuse this whole-screen index with index files inside structural component folders, which compose individual sections. .extension remains illustrative.

Review criterion: locate whole-screen composition in the domain-root index and section composition in the corresponding components indices.

## Store organization — confirmed
The folder is named store, singular, throughout the structure, including shared/store. This correction supersedes the earlier name stores. The abstraction remains Store; only the directory convention changes.

```text
domain/
└── statement/
    └── store/
        ├── statement.extension
        └── actions.extension
```

statement.extension implements the screen's single Store; its name follows the domain. actions.extension contains its actions. The Store imports actions and internally determines what should happen, following the execution and notification contracts.

shared/store remains reserved for shareable actions, without a common state Store across screens. Its internal structure is not otherwise prescribed.

Review criterion: use singular store, keep the domain Store in a file named after the domain, and its actions in actions, with the appropriate extension.

## Service organization — confirmed
Each required Service grouping occupies a folder inside services with an index entry using the implementation's extension. The index may contain all needed functions, or the developer may split implementation into more files within the same folder.

Illustrative example:

```text
services/
├── http/
│   └── index.extension
└── statement/
    └── index.extension
```

http may wrap request capabilities such as fetch or libraries such as axios. statement may group functions exported for that purpose. These names and groupings are examples, not universal requirements. The tree does not determine whether they belong to a domain or shared; use the established exclusive/shared usage criterion.

The wrapper illustrates integration-capability composition within Services. It does not permit dependencies on outer layers or change the asynchronous function, single-object input, object/list output, or statelessness contracts.

Review criterion: use a folder and index per grouping, allowing internal files at the developer's discretion. Do not require a file per function or a universal HTTP wrapper.

## Entity organization — confirmed
Entities follow the same convention as Services: a folder per grouping with an index entry using the implementation's extension. Complementary functions may stay in index or be split into internal files at the developer's discretion.

This preserves Product and ProductPrice in one file and composition between entities. Folder conventions do not change purity, synchronous execution, single destructured-object input, or semantic output.

Illustrative example, without prescribing entity names for the screen:

```text
entities/
└── product/
    └── index.extension
```

Review criterion: use a folder with index per grouping without requiring a file per function. Apply the same domain-exclusive versus shared reuse rules.

## shared/components — confirmed
Structural and atomic components may be at the same level in shared/components. No level or category distinction is required.

This deliberately differs from domains, where extracted atomic components stay inside their structural owner. Do not apply the domain-level hierarchy restriction to shared/components.

Review criterion: allow structural and atomic components at the same level in shared/components without mandatory category separation.

## State in shared components — confirmed
A shared component receives state from the parent that instantiates it. The parent may be the screen-composition index or a structural component.

The parent may supply data through properties (props) or inject a Store. Injection provides the dependency without importing the domain; shared still must not know or import the source domain.

The injected Store remains subject to the read/write contracts. Choosing props or injection is an implementation detail; do not impose a framework-specific mechanism.

Review criterion: verify that state or the Store is supplied by the parent and the shared component does not import a domain to obtain it.

## Code root, routes, and layouts — confirmed
The location of domain and shared depends on the framework. src is a suggestion, not a requirement. Route files and integration also depend on the framework; the architecture imposes no routing convention.

A layouts folder with a default file using the technology's extension may define the application shell. It handles structural elements wrapping screens and may use shared components such as headers, footers, and other recurring structures across screens or domains.

Optional example, adapted to the framework:

```text
src/
├── domain/
├── shared/
└── layouts/
    └── default.extension
```

A layout does not require moving every header or footer to shared: apply the exclusive/reuse criterion and screen-wrapping role appropriate to the application. layouts is not a fifth architectural abstraction.

Review criterion: respect framework placement and routing; treat src and layouts/default as suggestions. If a layout exists, use it for the screen-wrapping shell and allow recurring shared resources.

## Framework coupling — confirmed
Of the four official abstractions, only Components, the UI layer, may depend on or be coupled to the UI framework.

Stores, Services, and Entities must not depend on that framework. Freedom to choose a Store library does not authorize UI-framework dependencies in the Store.

Developers may create other auxiliary abstractions as needed. These may be coupled to the framework. This does not change the restrictions on the three official inner layers or the domain/shared boundaries.

Review criterion: keep UI-framework dependencies out of Stores, Services, and Entities. Allow them in Components and auxiliary abstractions when needed.

## Skill usage modes — confirmed
The skill supports two modes:
1. Creation from scratch: build the complete application using the architecture.
2. Refactoring: migrate an existing application to the complete architecture while preserving behavior and functionality.

Refactoring is complete only when the target application fully follows the architecture, not when one isolated fragment has been reorganized. Work may proceed in verifiable stages; that does not make a partial migration the final outcome.

Preserving behavior and functionality is a migration acceptance criterion. Architectural refactoring does not implicitly authorize changing business rules, flows, or features.

### Proposed guidance for verifiable skill behavior
Before refactoring, map screens, existing behavior, integrations, and available verification methods. At completion, verify architecture and functional preservation. The procedure is consolidated in the skill; do not assume nonexistent test coverage or claim equivalence without evidence.

## Questions and skill autonomy — confirmed
Ask only about missing decisions that affect product or behavior. Resolve implementation details using available context, architectural rules, and framework/application conventions.

When refactoring, investigate existing behavior first to preserve it and avoid asking for information already in the project. When creating, do not invent missing product requirements.

Review criterion: do not ask developers to repeat architectural decisions or choose details resolvable from context. Group relevant questions where possible; silence is not a product decision.

## Name and first skill version
Confirmed name: ui-clean-arch. The local package is the parent folder of this reference, with SKILL.md and references. Structural package validation passed.
