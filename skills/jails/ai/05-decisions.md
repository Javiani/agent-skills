# Implementation decisions

Choose the smallest solution that supports the required behavior. API decisions follow the references; architecture choices are guidance, not runtime restrictions.

## Should this be a component?

- No DOM behavior: keep HTML/CSS; reusable computation can be a function.
- Distinct behavior, lifecycle, or reuse: consider a component with a clear responsibility.
- A split only forwards events or state without simplifying ownership: retain the existing boundary.

A decorative icon needs no component. A selector that emits a choice may justify one without embedded markup.

## Where should state live?

| Situation | Decision |
| --- | --- |
| Only one instance uses it | Local `model` and `state`. |
| Derived only for display | `view`, without storing another copy. |
| Form value read only on submit | Consider native browser state with `html-static`. |
| Related children coordinate data | Parent ownership and `state.set()`; optional child `effect` to access or adapt props. |
| Independent consumers need current data | Explicit owner and scope; prefer `jails.stdlib/store` or an existing framework-agnostic reactive store. |
| Server owns authoritative data | Retain only the client snapshot, draft, or cache needed, with explicit refresh behavior. |

Shared does not mean global. Independent feature instances may need separate owners.

## Event, function, or dependency?

- Child announces intent to an ancestor: `emit` with an ancestor handler.
- Caller needs a result or error: a function/service with explicit return value or promise.
- Consumer supplies an implementation: registration `dependencies`.
- Distant regions react to a fact: `publish`/`subscribe`, with payload contract and cleanup.
- Consumer needs current data after missing an event: read from the data owner; do not assume replay.

For complete examples, read [communication patterns](03-communication-patterns.md).

## Should this be a service?

Keep DOM reactions in the component. Extract I/O or reusable logic when a separate contract adds value; simple HTTP calls in controllers remain compatible with the documented examples. Pure calculations need no class, store, or lifecycle service.

## Should markup be embedded?

Enhance suitable consumer/server HTML. Export `template` for widgets distributed with their own presentation, preserving `children` when the contract allows inserted content. For shared server/client markup, see [separate templates](../references/ecosystem.md).

## Does another library control the DOM?

Mark its region `html-static`, keep Jails-reactive content outside that region, and pair setup with cleanup through the library's API. Do not use `html-static` to hide a state-update defect in content that must remain reactive.

## Why did an update not appear?

Investigate relevant hypotheses rather than running every check for every task:

1. Was the full module registered, and did `start` reach the element?
2. Does the model define expression inputs, and does the controller receive each helper it uses?
3. Does the change use `state.set`, and does DOM-dependent work await its promise?
4. Does `view` preserve fields required by the template?
5. Is the node inside `html-static`?
6. Does the delegated selector match, and does the handler read `delegateTarget`?
7. Is a parent prop overwriting local state? Establish ownership before using `state.protected`.
8. Did an older asynchronous result overwrite a newer one, or continue after unmounting?

## Resolve uncertainty

Inspect installed code and types for verifiable version details. Ask for clarification when intent or an unavailable contract materially changes the implementation. Do not turn an undocumented detail into a universal rule.

The supplied author guidance establishes parent `state.set()` with optional child `effect`, and prefers `jails.stdlib/store` while allowing other framework-agnostic reactive stores. Read the [store contract](../references/store.md) before implementing store operations. Confirm model-function/`initialState` precedence or protection details only when they affect the task.

Feature folders, services, and islands are optional. Keep an existing architecture with clear responsibilities.
