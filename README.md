# Agent Skills

A collection of reusable Agent Skills. Each skill is self-contained under `skills/<skill-name>/` and includes its own `SKILL.md` entrypoint and supporting resources.

## Available skills

| Skill | Purpose |
| --- | --- |
| [`ui-clean-architecture`](skills/ui-clean-architecture/SKILL.md) | Organizes screen-oriented front-end applications using the documented UI architecture. |
| [`jails`](skills/jails/SKILL.md) | Builds and debugs Jails JavaScript components, state, events, templates, and application integrations. |
| [`jails-stdlib`](skills/jails-stdlib/SKILL.md) | Selects and integrates the 19 jails.stdlib modules using source-verified APIs, examples, and limitations. |

## Repository structure

```text
skills/
├── jails/
│   ├── SKILL.md
│   └── references/
├── jails-stdlib/
│   ├── SKILL.md
│   └── references/
└── ui-clean-architecture/
    ├── SKILL.md
    └── references/
```

## Quick Start

**Fastest path — any agent, one command.** The open [skills CLI](https://github.com/vercel-labs/skills) installs into 70+ agents (Claude Code, Cursor, Codex, Copilot, Cline, and more):

```bash
npx skills add javiani/agent-skills            # install all skills
npx skills add javiani/agent-skills --list     # browse before installing
```

Or grab individual skills:

```bash
npx skills add javiani/agent-skills --skill ui-clean-architecture
npx skills add javiani/agent-skills --skill jails
npx skills add javiani/agent-skills --skill jails-stdlib
```

## Skill format

Skills follow the [Agent Skills specification](https://agentskills.io/specification) and the [Vercel agent-skills conventions](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md):

- Each kebab-case skill directory contains a `SKILL.md` with matching `name` and a description explaining when to use it.
- The entrypoint describes applicability, workflow, essential constraints, and direct links to supporting documents.
- Detailed guidance lives in `references/` and is loaded only when relevant to the task.
- Scripts and assets are optional; include them only when the skill needs them.

`jails` documents framework behavior and component conventions; `jails-stdlib` documents library module contracts; `ui-clean-architecture` defines application organization. Apply the relevant skills together when a task spans these concerns.
