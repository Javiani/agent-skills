
# Components

Components wrap the UI parts of the application. There are two component types:

- Section Components
- Atomic Components

## Section Components

A Section Component represents a horizontal screen block with one clear context and purpose. A screen is composed by stacking Section Components vertically from top to bottom.

Typical examples are `Header`, `Hero`, `Features`, `Examples`, `CTA`, and `Footer`.

Prefer Section (Seção) Components as the default unit of UI composition in both layouts and Domains. Read the interface horizontally: keep the elements that share a context and make sense together in the same section. A heading, description, fields, and actions serving one purpose belong together. Avoid unnecessary atomicity: split a section into smaller components only when there is a concrete need to reuse those parts in other components of the system. File length, individual HTML tags, or hypothetical future reuse are not sufficient reasons to split it.

### How to identify a Section Component

Extract a block into a Section Component when it is a visually distinct horizontal part of the screen with its own purpose, heading, supporting content, controls, or loading/empty state. A section does not need to be large: an introduction containing a title, description, and input or action control is still a Section Component.

The implementation must use the component directory convention:

```text
domains/<domain-name>/components/<section-name>/index.tsx
```

For example, a screen introduction belongs in `components/screen-intro/index.tsx` and keeps its heading, description, input, and action markup together. Extract a `SearchField` or `ActionButton` only when another component needs that UI unit, or compose an existing reusable component when one already fits.

The Section Component owns the markup and visual composition of that section. When it depends on shared screen state, it should read that state through the store adapter available for the selected UI framework and dispatch its own events locally. Use props for explicit component inputs, local composition, and derived values that are not store state; do not pass the same store state through the Domain merely to reach descendants.

Each Section Component must have its own entry point and one public component export. If a Domain needs two independent UI blocks, create two component folders instead of defining both components in the Domain `index` file. A detail panel, dialog, drawer, or overlay with its own markup and interaction is also a candidate for its own Section Component.

┌──────────────────────────────────────────────┐
│                    HEADER                    │
│                                              │
│   Logo                 Navigation / Actions  │
└──────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────┐
│                     HERO                     │
│                                              │
│              Main headline                   │
│              Supporting text                 │
│              [ Primary CTA ]                 │
│                                              │
└──────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────┐
│                   FEATURES                   │
│                                              │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│   │ Feature  │ │ Feature  │ │ Feature  │     │
│   │    01    │ │    02    │ │    03    │     │
│   └──────────┘ └──────────┘ └──────────┘     │
│                                              │
└──────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────┐
│                   EXAMPLES                   │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │              Example 01              │   │
│   └──────────────────────────────────────┘   │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │              Example 02              │   │
│   └──────────────────────────────────────┘   │
│                                              │
└──────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────┐
│                     CTA                      │
│                                              │
│            Call to action message            │
│                                              │
│               [ Get Started ]                │
│                                              │
└──────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────┐
│                    FOOTER                    │
│                                              │
│       Links · Social · Copyright             │
└──────────────────────────────────────────────┘


## Atomic Components

An Atomic Component is a smaller UI unit extracted for concrete reuse by other components in the system, such as a button used by several sections. Repeating markup within a single section, such as rendering a list of features, does not by itself justify extracting an atomic component; keep that markup in the section unless other components also need it.

┌──────────────────────────────────────────────┐
│                   FEATURES                   │
│                                              │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│   │ Feature  │ │ Feature  │ │ Feature  │     │
│   │    01    │ │    02    │ │    03    │     │
│   └──────────┘ └──────────┘ └──────────┘     │
│                                              │
└──────────────────────────────────────────────┘

## Behavior

Every component is responsible for rendering its UI, reacting to user events such as clicks and mouseover, and updating its local state when needed.

- Pass explicit inputs to child components when the children depend on them. For shared screen state, prefer the framework's store adapter in the component that consumes the state instead of drilling it through intermediate components.
- A Section Component must be standalone.
- A Section Component must not directly depend on a sibling Section Component.
- A Section Component may receive properties from its parent, which is normally the Domain component.
- A Section Component owns its section-level HTML and visual composition.
- Layouts and Domains must not contain detailed inline sections with their own headings, content, controls, and styling context; extract those blocks into Section Components and retain only minimal structural HTML and composition in the parent.
- Do not define secondary components in the Domain `index` file. Move them to `components/<component-name>/index` and import them into the Domain.