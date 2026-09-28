# Agent Skills

A collection of reusable Agent Skills. Each skill is self-contained under `skills/<skill-name>/` and includes its own `SKILL.md` entrypoint and supporting resources.

## Available skills

| Skill | Purpose |
| --- | --- |
| [`ui-clean-architecture`](skills/ui-clean-architecture/SKILL.md) | Organizes screen-oriented front-end applications using the documented UI architecture. |
| [`jails`](skills/jails/SKILL.md) | Builds and debugs Jails JavaScript components, state, events, templates, and application integrations. |

## Repository structure

```text
skills/
├── jails/
│   ├── SKILL.md
│   ├── ai/
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
```
