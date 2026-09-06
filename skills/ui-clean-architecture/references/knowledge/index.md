
# UI Clean Architecture

This architecture describes a framework-agnostic way to organize front-end applications around screens, reusable UI blocks, data adaptation, external communication, and fixed values.

The architecture has two parts:

- Folder structure: defines where each abstraction must live.
- Abstractions: defines the responsibilities and boundaries of the application's parts.

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

Examples: `components/menu-bar/index.jsx`, `services/tmdb/index.ts`, and `entities/product.ts`.

## Layouts

Layouts define the standard HTML document shell and compose reusable frame-level elements shared across screens, from `DOCTYPE` through `<body>`.

Like Domains, layouts must contain little HTML detail. Keep only the document shell, minimal structural wrappers, slots or children, and component composition inline. Extract detailed markup for headers, navigation, footers, and other meaningful blocks into components, preferring cohesive Section Components. Components reused across domains belong in `shared/components/<component-name>/index`; keep layout files flat in `layouts/`.

- Keep layout files directly inside `layouts/`.
- Do not create nested layout folders for layout variants.
- Examples include `default.[jsx, tsx, astro, svelte]` and `admin.[jsx, tsx, astro, svelte]`.

## Domains

A domain represents one screen or page. It owns every abstraction required by that screen when the abstraction is domain-specific.

- Domain-local components use `components/<component-name>/index`.
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

# Example

.
└── src/
    ├── layouts/
    │   └── default.[tsx,astro,svelte]
    ├── domains/
    │   └── home/
    │       ├── components/
    │       │   ├── header/
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
