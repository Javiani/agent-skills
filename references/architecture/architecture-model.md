# Architecture Model

## Vocabulary

### layouts
Definition: The top-level folder that defines the system's standard HTML shell and cross-screen reused layout elements.
Responsibilities:
- store page shell boilerplate
- centralize reusable frame-level structure
- support standard page composition
Relationships:
- sits alongside domains and shared
- reused by screens through their framework route or page wrapper
Source Rules:
- RULE-001
- RULE-002

### domains
Definition: The set of screens/pages that form the application.
Responsibilities:
- represent a page or screen
- know the required inputs and outputs for that screen
- compose the required UI sections and dependencies
Relationships:
- may contain domain-local components and constants
- imported by framework route/page
Source Rules:
- RULE-003
- RULE-004
- RULE-005
- RULE-006
- RULE-021

### shared
Definition: The cross-domain abstraction bucket reused by multiple domains.
Responsibilities:
- hold reusable UI or constants used across screens
- mirror the same structural approach as domains
Relationships:
- reused by multiple domains
- separate from local domain-only abstractions
Source Rules:
- RULE-007
- RULE-008

### components
Definition: UI abstractions that build screen features and structure.
Responsibilities:
- render part of the UI
- react to local events
- update local state and propagate state to children when needed
Relationships:
- can be section or atomic
- may live inside a domain or in a shared structure
Source Rules:
- RULE-009
- RULE-012

### section component
Definition: A horizontal, purpose-specific block that composes part of a screen.
Responsibilities:
- represent one context-specific section of a screen
- be standalone and self-contained
- receive props from the parent domain
Relationships:
- stacked with other section components to form a screen
- must not directly depend on sibling section components
Source Rules:
- RULE-010
- RULE-011

### atomic component
Definition: A smaller reusable UI part used multiple times in a system or section.
Responsibilities:
- render repeated UI patterns
- be reusable across sections or screens when applicable
Relationships:
- may live next to section components when used across them
Source Rules:
- RULE-013
- RULE-014

### constants
Definition: Exported fixed values or pure functions that centralize stable system values.
Responsibilities:
- hold static values
- derive outputs from other constants
- supply data to other abstractions
Relationships:
- can be domain-local or shared
- may read from process.env
Source Rules:
- RULE-015
- RULE-016
- RULE-017
- RULE-023

## Building Blocks

### Layouts
Purpose:
Provide the standard structural shell of the application and reusable cross-screen boilerplate.
Responsibilities:
- define HTML shell pattern
- contain cross-screen reusable layout elements
Can:
- wrap a page or screen
- host common layout structure
Cannot:
- replace a domain as the screen composition unit
Depends on:
- standard framework conventions for page wrappers
Used by:
- application routes/pages
Related rules:
RULE-001, RULE-002

### Domain
Purpose:
Represent a page/screen as a standalone composition unit.
Responsibilities:
- know required screen inputs and outputs
- compose all UI sections and local dependencies
- act as the top-level page abstraction
Can:
- contain local components and local constants
- be imported into a framework route or page/controller boundary
Cannot:
- be treated as a mere utility or partial UI fragment
- absorb framework route implementation details as its own logic
Depends on:
- its local components and constants
- data or params provided by the route integration layer
Used by:
- route/page files as the real screen implementation
Related rules:
RULE-003, RULE-004, RULE-005, RULE-006, RULE-021

### Route/Page boundary
Purpose:
Translate framework routing conventions into domain inputs without defining the screen UI itself.
Responsibilities:
- read route params or request data
- resolve dependencies needed by a domain
- render the domain as the final screen composition
Can:
- wrap a domain in a layout
- adapt framework-specific params to domain props
Cannot:
- contain most of the actual page structure or UI logic
- replace the domain as the screen abstraction
Used by:
- framework routing conventions such as page, route, or controller files
Related rules:
RULE-003, RULE-021

### Shared
Purpose:
Store abstractions reused across multiple domains.
Responsibilities:
- centralize cross-domain reusable pieces
- preserve a consistent structural pattern for reuse
Can:
- contain shared components and constants
- be imported by multiple domains
Cannot:
- be used to hide domain-local isolation requirements
Depends on:
- the same structural approach as domains
Used by:
- multiple domains
Related rules:
RULE-007, RULE-008

### Section Component
Purpose:
Provide a unique horizontal section of a screen.
Responsibilities:
- render a screen area with a defined role
- manage local events and state
- pass necessary state to child components
Can:
- be stacked to form a full screen
- receive props from the domain parent
Cannot:
- directly connect to sibling section components
Depends on:
- parent domain props
- local child components as needed
Used by:
- domain composition
Related rules:
RULE-009, RULE-010, RULE-011, RULE-012

### Atomic Component
Purpose:
Represent reusable low-level UI parts used multiple times.
Responsibilities:
- render repeated UI patterns
- support use in different sections when needed
Can:
- exist in a local domain or shared sibling area
- be reused in several sections
Cannot:
- define the screen structure by itself unless used as a child of a section
Depends on:
- parent section or domain context
Used by:
- section components, domain compositions
Related rules:
RULE-013, RULE-014

### Constants
Purpose:
Hold fixed values and derived pure values used by the application.
Responsibilities:
- centralize system values
- export usable values for reuse
- create deterministic derived constants
Can:
- be local to a domain or global/shared
- use `process.env` values
Cannot:
- be nested in component directory structures as a required pattern
Depends on:
- their importers
Used by:
- domains, components, and shared abstractions
Related rules:
RULE-015, RULE-016, RULE-017, RULE-023

## Dependency Model

A → layouts        allowed
A → domains        allowed
A → shared         allowed
domains → components        allowed when local
domains → constants         allowed when local
shared → components         allowed
shared → constants          allowed
domains → shared            allowed
section component → section component    forbidden
section component → parent domain       allowed
domain → route/page         allowed
route/page → domain        allowed
component → child component allowed when parent-child relationship exists
component → sibling component not defined
constants → constants       allowed
process.env → constants     allowed

## Responsibility Model

Domain owns screen composition
    → belongs to domain

Screen-level inputs/outputs
    → belongs to domain

Section identity and purpose
    → belongs to section component

Repeated UI fragment reuse
    → belongs to atomic component

System fixed values
    → belongs to constants

Direct section-to-section coupling
    → must not belong to section components

## Data / Communication Model

How information enters:
- The screen/domain is supplied with its required inputs and outputs.
- Framework route/page imports the domain and passes the data needed by the screen.

How information moves:
- State is managed at the component level when local behavior requires it.
- Child components receive data through props or other parent-to-child dependencies.

How modules communicate:
- The domain composes sections.
- Section components do not directly connect to sibling sections.
- Communication is governed by the parent domain and child component relationships.

How state behaves:
- State is updated by the component that owns the relevant local interaction.
- The component passes relevant state to children when needed.

How external systems interact:
- Not explicitly defined beyond constants sourcing system values from `process.env`.

How results propagate:
- Results are exposed by the domain as the screen's required outputs.

## Decision Model

### DECISION-001
Context:
A new screen or page is required.
Question:
Where should the screen abstraction live?
Decision:
Create or update a domain for the screen and keep it standalone.
Action:
Define the domain at the screen level, include required components and constants, and import it from the route/page integration point.
Based on:
RULE-003, RULE-004, RULE-005, RULE-018, RULE-019

### DECISION-002
Context:
A UI fragment is only used within one screen.
Question:
Should it live in the domain or shared?
Decision:
Place it in the domain when it is only relevant within that screen.
Action:
Create a domain-local component or constant and keep its scope limited to that domain.
Based on:
RULE-006, RULE-021

### DECISION-003
Context:
A piece of UI is reused by multiple domains or several sections.
Question:
Where should it live?
Decision:
Use shared abstractions or atomic component reuse patterns as appropriate.
Action:
Place reusable cross-domain code in shared and reuse section-level repeated fragments through atomic components when they are repeated within or across sections.
Based on:
RULE-007, RULE-008, RULE-013, RULE-014

### DECISION-004
Context:
A screen needs a vertical composition of blocks.
Question:
How should those blocks be organized?
Decision:
Use stacked section components under the domain root.
Action:
Compose the screen by arranging section components in top-to-bottom order and do not create direct section-to-section coupling.
Based on:
RULE-010, RULE-011

### DECISION-005
Context:
A component must react to user input.
Question:
How should behavior be implemented?
Decision:
Handle relevant events in the component and update local state when needed.
Action:
Attach event handlers, update local state, and pass state to child components only when child dependencies require it.
Based on:
RULE-012

### DECISION-006
Context:
A value is fixed or derived in a reusable way.
Question:
Where should it live?
Decision:
Use constants.
Action:
Export the value or function as a constant in uppercase snake case, and centralize environment-derived values in constants when needed.
Based on:
RULE-015, RULE-016, RULE-017, RULE-023

### DECISION-007
Context:
A framework route or page file is present.
Question:
What responsibility belongs there?
Decision:
Use the framework route as an integrator, not as the architecture definition.
Action:
Import the domain and render it in the route while preserving domain autonomy.
Based on:
RULE-018, RULE-019, RULE-020

### DECISION-008
Context:
A developer must review a screen architecture for local correctness.
Question:
What must be verified before approving the change?
Decision:
Verify that the domain remains standalone, section composition remains independent, and constants stay centralized.
Action:
Check for direct section-to-section coupling, unnecessary shared leakage, and missing domain-specific compilation boundaries.
Based on:
RULE-004, RULE-011, RULE-015, RULE-021

## Architectural Invariants

1. The system structure must remain organized as layouts, domains, and shared. (RULE-001)
2. A domain must remain a standalone page abstraction with explicit inputs and outputs. (RULE-003, RULE-004)
3. Section components must remain independent from sibling section components. (RULE-010, RULE-011)
4. Components handle local UI behavior and local state updates. (RULE-012)
5. Constants must remain exported and use SCREAMING_SNAKE_CASE naming. (RULE-015, RULE-016)
6. Framework route/page files are integrators for domain abstractions, not authoritative architecture definitions. (RULE-018, RULE-019)
