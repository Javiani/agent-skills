
# UI Clean Architecture

This architecture describes a framework-agnostic way to organize front-end applications around screens, reusable UI blocks, data adaptation, external communication, and fixed values.

The architecture has two parts:

- Folder structure: defines where each abstraction must live.
- Abstractions: defines the responsibilities and boundaries of the application's parts.

# Code Readability

All project code and every code snippet must follow this standard, including implementations, modifications, and documentation examples across every architectural layer and language:

- Use consistent indentation that makes nesting and scope clear, following the project's indentation convention.
- Include explanatory comments that describe intent, behavior, relevant decisions, and constraints. Keep comments accurate as code changes and avoid comments that merely repeat the syntax.
- Use descriptive names, clear control flow, and spacing between logical steps.
- Avoid one-liners that compress functions, callbacks, conditionals, loops, or multiple operations into a single line. Prefer explicit multiline blocks, with each logical step easy to read.
- Preserve cohesive Section Components; improving readability does not justify extracting smaller components without concrete reuse.

# Abstractions

- [Domains](./domain/index.md)
- [Entities](./entities/index.md)
- [Components](./components/index.md)
- [Constants](./constants/index.md)
- [Services](./services/index.md)
- [Stores](./stores/index.md)

# Folder Structure

The project must be separated into `layouts`, `domains`, and `shared`.

Use `kebab-case` for every folder and file name. Framework or library naming conventions do not override this rule.

At the first level of each abstraction:

- `components` and `services` use one semantic folder per abstraction with an `index` file.
- `constants` and `entities` use semantic files directly inside their folders.
- Put application-owned types in `types.ts` inside the specific abstraction that owns them. If multiple abstractions consume a type, place it in `types.ts` at their nearest common parent. Nested abstractions may each have their own `types.ts` for local types.

Examples: `components/menu-bar/index.jsx`, `services/tmdb/index.ts`, and `entities/product.ts`.

## Type Organization

Place application-owned TypeScript types according to their consumers:

- Types used only by one abstraction belong in that abstraction's `types.ts`, such as `domains/<domain-name>/store/types.ts`, `domains/<domain-name>/components/<component-name>/types.ts`, `domains/<domain-name>/services/<service-name>/types.ts`, or `domains/<domain-name>/entities/types.ts`.
- When consumers span sibling abstractions, move the shared type to `types.ts` at their nearest common parent. For example, a type shared between a Domain root and its store belongs in `domains/<domain-name>/types.ts`; one shared by multiple domains belongs in `shared/types.ts`.
- Layout-local types belong in `layouts/types.ts`; types shared between layouts and other abstractions belong in the nearest common parent that owns those consumers.
- Do not centralize all types at the Domain or Shared root by default, and do not duplicate a type in multiple `types.ts` files.
- Use TypeScript `type` aliases for these declarations.

Create `types.ts` only when that abstraction owns application types. Framework and external-library types remain imported from their packages rather than being copied into application files.

## Layouts

Layouts define the standard HTML document shell and compose reusable frame-level elements shared across screens, from `DOCTYPE` through `<body>`.

Like Domains, layouts must contain little HTML detail. Keep only the document shell, minimal structural wrappers, slots or children, and component composition inline. Extract detailed markup for headers, navigation, footers, and other meaningful blocks into components, preferring cohesive Section Components. Components reused across domains belong in `shared/components/<component-name>/index`; keep layout files flat in `layouts/`.

- Keep layout files directly inside `layouts/`.
- Keep types used only by layouts in `layouts/types.ts`; lift types shared with other abstractions only to their nearest common parent.
- Do not create nested layout folders for layout variants.
- Examples include `default.[jsx, tsx, astro, svelte]` and `admin.[jsx, tsx, astro, svelte]`.

## Domains

A domain represents one screen or page. It owns every abstraction required by that screen when the abstraction is domain-specific.

- Domain-local components use `components/<component-name>/index`.
- Put Domain-root types in `domains/<domain-name>/types.ts` only when the Domain itself uses them or they are shared across nested abstractions. Keep store-, component-, service-, and entity-local types in their own abstraction's `types.ts`.
- Existing atomic components scoped to one section may remain nested in that section's folder; this placement rule does not justify new extraction without reuse by other components.
- Atomic components reused by multiple sections may be placed beside the section folders.
- Domain-local constants use semantic flat files directly inside `constants/`.
- Domain-local entities use semantic files directly inside `entities/`. JSON adapters such as `map-show` belong to the corresponding entity.
- Domain-local services use `services/<service-name>/index`. API and fetch functions are services, not loose files at the domain root.
- Components that depend on shared screen state read it through the selected UI framework's store adapter; do not drill store state through the Domain only to reach descendants.

Framework pages and route files are domain integrators. They resolve route parameters, load required context, and render the domain. The Domain owns screen composition and coordination, while detailed HTML for each meaningful screen block belongs to its Section Component, not to the route file or an oversized Domain component.

The Domain entry point should expose one public root component. Secondary UI components must be placed in their own component entry points and imported by the Domain root.

## Shared

`shared/` stores abstractions reused across domains. It follows the same folder structure as a domain, but its contents are cross-domain abstractions rather than screen-specific abstractions.
Put types used only by one Shared abstraction in that abstraction's `types.ts`. Use `shared/types.ts` for types shared across multiple Shared abstractions or between Shared and other consumers for which Shared is the nearest common parent.

# Example

.
└── src/
    ├── layouts/
    │   └── default.[tsx,astro,svelte]
    ├── domains/
    │   └── home/
    │       ├── components/
    │       │   ├── header/
    │       │   │   ├── types.ts
    │       │   │   └── index[tsx,astro,svelte]
    │       │   ├── hero/
    │       │   │   └── index[tsx,astro,svelte]
    │       │   └── features/
    │       │       └── index[tsx,astro,svelte]
    │       ├── constants/
    │       │   ├── environment.ts
    │       │   └── ...
    │       └── index[tsx,astro,svelte]
    └── shared/
        ├── components/
        │   └── progress-navigation/
        │       ├── types.ts
        │       └── index[tsx,astro,svelte]
        └── constants/


# Framework Integration

Frameworks may define route conventions such as `pages`, `app`, or `routes`. Follow those conventions at the route boundary, while using domains to generate and compose screens.

Example using Next.js and React:

`app/blog/page.tsx`

```tsx
import Blog from '@domain/blog'
 
export default async function Page() {
  const posts = await getPosts()
  return (
    <Blog posts={posts} />
  )
}
```

`domain/blog/index.tsx`

```tsx

import Hero from './components/hero'
import Articles from './components/articles'
import Cta from './components/cta'
import FooterBlog from './components/footer'
 
export default function Blog({ posts }) {
  return (
	<>
		<Hero />
		<Articles posts={posts} />
		<Cta />
		<FooterBlog />
	</>
  )
}
```

The framework convention `page.tsx` is an integration point for the architecture's folder abstractions. It does not replace the domain abstraction.
