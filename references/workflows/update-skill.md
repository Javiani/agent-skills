Synchronize the existing Agent Skill with the current contents of `references/knowledge/`.

`references/knowledge/` is the single source of truth for the architecture.

Rules:

* Read the relevant contents of `references/knowledge/` and compare them with the existing Agent Skill.
* Update only the skill files affected by the changes.
* Preserve everything that is still correct.
* Add, modify, or remove rules as necessary to accurately reflect `references/knowledge/`.
* Never introduce architectural rules that cannot be justified by `references/knowledge/`.
* Never infer concepts from Clean Architecture, DDD, Hexagonal Architecture, SOLID, or any other known architecture or methodology.
* Treat this architecture as completely original and independent.
* Preserve its terminology and framework-agnostic nature.
* Do not turn examples into architectural rules unless explicitly defined as such.
* If something is ambiguous or undefined, report it instead of inventing a rule.

After updating, verify that every changed architectural instruction can be traced back to `references/knowledge/` and that no existing skill instruction now contradicts it.

Do not regenerate or rewrite unaffected files unnecessarily.

At the end, report:

* which skill files changed
* what architectural rules changed
* whether any ambiguity or contradiction was found
