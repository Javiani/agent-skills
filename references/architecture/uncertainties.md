# Uncertainties

## UNCERTAINTY-001

Type: UNDEFINED

Question:
What is the explicit rule for cross-page or cross-domain state persistence?

Relevant rules:
RULE-004, RULE-006, RULE-007

Reason:
The documentation defines standalone screens and shared abstractions, but it does not define how state persists or is communicated across screens.

## UNCERTAINTY-002

Type: UNDEFINED

Question:
Where should data fetching or server communication live in the architecture?

Relevant rules:
RULE-003, RULE-005, RULE-015

Reason:
The knowledge describes domains, components, and constants, but it does not define an abstraction for fetching data or external services.

## UNCERTAINTY-003

Type: INSUFFICIENT_EXAMPLE

Question:
How should a domain decide when a piece of UI belongs in shared versus local domain state?

Relevant rules:
RULE-006, RULE-007, RULE-021

Reason:
The documentation states the distinction, but it does not provide a precise decision algorithm beyond reuse and locality.

## UNCERTAINTY-004

Type: UNDEFINED

Question:
What is the complete rule for component communication beyond parent-to-child state propagation?

Relevant rules:
RULE-012

Reason:
The text defines local events and child state passing but does not define a general communication protocol for sibling components or external services.
