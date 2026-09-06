# Agent Skills

A collection of reusable Agent Skills. Each skill is self-contained under `skills/<skill-name>/` and includes its own `SKILL.md` entrypoint and supporting resources.

## Available skills

| Skill | Purpose |
| --- | --- |
| [`ui-clean-architecture`](skills/ui-clean-architecture/SKILL.md) | Organizes screen-oriented front-end applications using the documented UI architecture. |

## Repository structure

```text
skills/
└── ui-clean-architecture/
    ├── SKILL.md
    └── references/
```

Add future skills as sibling directories under `skills/`. Do not share implementation instructions implicitly between skills; each package must remain independently installable.

## Install a skill with Codex

Ask Codex to use `$skill-installer`, or run:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo Javiani/agent-skill-ui-clean-architecture \
  --path skills/ui-clean-architecture
```

The installed skill is available from the next task as `$ui-clean-architecture`.
