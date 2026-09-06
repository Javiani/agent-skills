# Extracted Architectural Rules

## RULE-001

Type: structure
Strength: MUST
Source: references/knowledge/index.md

Statement:
The project must be separated into layouts, domains and shared.

Related:
- layouts
- domains
- shared

Notes:
This is the top-level folder-system rule for the architecture.

## RULE-002

Type: responsibility
Strength: MUST
Source: references/knowledge/index.md

Statement:
Layouts define the standard HTML boilerplate and reused cross-screen elements.

Related:
- layouts
- shared UI

Notes:
The layout layer is described as the place for standard page shell logic.

## RULE-003

Type: structure
Strength: MUST
Source: references/knowledge/index.md

Statement:
Domains are the set of screens/pages of the application.

Related:
- domain
- screen
- page

Notes:
Each domain is a top-level screen abstraction.

## RULE-004

Type: responsibility
Strength: MUST
Source: references/knowledge/domain/index.md

Statement:
Each screen/domain must function in a standalone manner and know the inputs and outputs it needs to save and expose to the next screen.

Related:
- domain
- input
- output

Notes:
This establishes screen autonomy and explicit boundaries.

## RULE-005

Type: dependency
Strength: MUST
Source: references/knowledge/domain/index.md

Statement:
A domain is the highest-level component of the screen and must include all components and dependencies it needs to generate the screen.

Related:
- domain
- section component
- component dependency

Notes:
The domain is the composition root for the page.

## RULE-006

Type: dependency
Strength: MUST
Source: references/knowledge/index.md

Statement:
Domain abstractions can depend on components and constants when those abstractions are only used in the domain context.

Related:
- domain
- components
- constants

Notes:
This allows local domain-specific abstractions.

## RULE-007

Type: structure
Strength: MUST
Source: references/knowledge/index.md

Statement:
Shared stores cross-domain abstractions that are reused by multiple domains.

Related:
- shared
- cross-domain reuse

Notes:
Shared is the reuse bucket for architecture-wide abstractions.

## RULE-008

Type: structure
Strength: MUST
Source: references/knowledge/index.md

Statement:
Shared follows the same folder structure as domains, but its purpose is to hold shared abstractions.

Related:
- shared
- domains

Notes:
The structure is repeated, but the content is cross-domain rather than screen-specific.

## RULE-009

Type: structure
Strength: MUST
Source: references/knowledge/components/index.md

Statement:
Components are abstractions that wrap the UI parts of the application and may be of two types: section components and atomic components.

Related:
- components
- section component
- atomic component

Notes:
This defines the two kinds of UI subcomponents.

## RULE-010

Type: responsibility
Strength: MUST
Source: references/knowledge/components/index.md

Statement:
A section component represents a horizontal block with a unique context and purpose, and a screen is formed by section components stacked from top to bottom.

Related:
- section component
- screen composition

Notes:
The composition of a screen is a vertical stack of self-contained sections.

## RULE-011

Type: dependency
Strength: MUST
Source: references/knowledge/components/index.md

Statement:
A section component must not relate directly to other section components; it may only receive properties from its parent domain.

Related:
- section component
- domain
- parent props

Notes:
This preserves independence between screen sections.

## RULE-012

Type: behavior
Strength: MUST
Source: references/knowledge/components/index.md

Statement:
Each component is responsible for reacting to user events such as clicks and mouseover, updating local state, and passing state to child components when dependencies exist.

Related:
- component behavior
- events
- state

Notes:
Behavior is local-first and flows downward when needed.

## RULE-013

Type: structure
Strength: MUST
Source: references/knowledge/components/index.md

Statement:
Atomic components are smaller, generic components used repeatedly across the system.

Related:
- atomic component
- reuse

Notes:
Atomic components are usually repeated building blocks inside or across sections.

## RULE-014

Type: structure
Strength: MUST
Source: references/knowledge/components/index.md

Statement:
If an atomic component is used by multiple section components, it may be placed in a sibling folder beside the section components.

Related:
- atomic component
- shared section helpers

Notes:
This is the named exception for reuse across sections.

## RULE-015

Type: structure
Strength: MUST
Source: references/knowledge/index.md

Statement:
Constants should be placed in dedicated files, separated semantically, and not broken into deep folder structures like components.

Related:
- constants
- file organization

Notes:
The architecture prefers simple constant files over component-like nesting.

## RULE-016

Type: naming
Strength: MUST
Source: references/knowledge/constants/index.md

Statement:
Constants, whether variables or functions, must be exported and named in SCREAMING_SNAKE_CASE.

Related:
- constants
- naming

Notes:
The naming rule is explicit and normative.

## RULE-017

Type: responsibility
Strength: MUST
Source: references/knowledge/constants/index.md

Statement:
Constants centralize system fixed values and pure functions that derive from other constant values.

Related:
- constants
- derived values

Notes:
The purpose of constants is to hold stable values and deterministic transforms.

## RULE-018

Type: integration
Strength: MUST
Source: references/knowledge/index.md

Statement:
Framework conventions for routes such as pages or app folders must be followed for pages, while the architecture's domain abstraction composes the screen.

Related:
- framework conventions
- pages
- domain

Notes:
Framework conventions are used at the route boundary, not as the architecture itself.

## RULE-019

Type: decision
Strength: MUST
Source: references/knowledge/index.md

Statement:
The framework page is an integrator for the architecture abstractions.

Related:
- page
- integrator
- domain

Notes:
The framework file adapts to the architecture rather than defining it.

## RULE-020

Type: example
Strength: EXAMPLE
Source: references/knowledge/index.md

Statement:
The sample Next.js route `app/blog/page.tsx` imports the domain and renders it as the screen composition root.

Related:
- example
- domain integration

Notes:
This example demonstrates the route/domain composition pattern.

## RULE-021

Type: structure
Strength: MUST
Source: references/knowledge/index.md

Statement:
The domain folder may include subfolders such as `components/` and `constants/` when those abstractions exist only within that domain's context.

Related:
- domain
- components
- constants

Notes:
This is the local-domain organization rule.

## RULE-022

Type: example
Strength: EXAMPLE
Source: references/knowledge/index.md

Statement:
The project example shows `src/layouts`, `src/domains`, and `src/shared` as the canonical directory hierarchy.

Related:
- example
- directory structure

Notes:
It demonstrates the documented convention but does not by itself establish a separate rule beyond the earlier explicit folder structure.

## RULE-023

Type: naming
Strength: MUST
Source: references/knowledge/constants/index.md

Statement:
Constants may be populated from `process.env` and exported as system variables.

Related:
- constants
- environment variables

Notes:
This is a direct documented capability for constant sources.
