# Architecture extracted from the application

## Nature of the model

The organization combines vertical features in `domain` and horizontal resources in `shared`. Astro runs queries in server frontmatter and produces HTML; Jails initializes behavior on that HTML in the browser. Tailwind is the main styling mechanism. This code has no React, SPA router, global business stores, database, abstract repositories, or use-case layer.

The repository name mentions Clean Architecture, but its entities are presentation adapters tied to TMDB, and its domain screens import Astro and services directly. To reproduce the same structure, preserve this pragmatic separation rather than introducing architectural circles absent from the original.

## Observed tree

```text
src/
├── pages/
│   ├── index.astro                   # delegates to movies
│   ├── about.astro                   # delegates to about
│   ├── movies/[id].astro             # fetches movie; passes props to detail
│   ├── tv/index.astro                # delegates to tv
│   ├── tv/[id].astro                 # fetches show; passes props to detail
│   └── people/[id].astro             # delegates to people
├── domain/
│   ├── movies/index.astro            # queries list and composes cards
│   ├── tv/index.astro                # queries two lists and composes cards
│   ├── people/index.astro            # reads id, queries and renders person
│   ├── about/index.astro
│   └── detail/
│       ├── index.astro              # screen shared by movies and tv
│       └── components/
│           ├── info/index.astro
│           ├── cast/index.astro
│           └── trailer-button/index.astro
├── layouts/default.astro
├── shared/
│   ├── main.ts                      # Jails registration and bootstrap
│   ├── application.ts               # app-main; events and navigation
│   ├── components/
│   │   ├── card/index.astro
│   │   ├── footer/index.astro
│   │   ├── logo/index.astro
│   │   ├── navigation/{index.astro,index.ts}
│   │   ├── gallery/{index.astro,index.ts}
│   │   └── modal/{index.astro,index.ts}
│   ├── services/tmdb/{http.ts,index.ts}
│   ├── entities/tmdb/{index.ts,people.ts}
│   └── styles/global.css
└── env.d.ts
public/                              # static public files
astro.config.mjs                     # SSR, Netlify, Tailwind/Vite
package.json
tsconfig.json                        # baseUrl: ./src
```

`.astro`, `.netlify`, `dist`, and `node_modules` are tooling, build, or installation artifacts; they are not part of the source template. The repository contains both npm and Yarn locks: choose one package manager and its lock for the next application. The actual environment example is `.env.sample`, although the README mentions `.env.example`.

## Responsibilities and dependencies

| Location | Responsibility | Usual dependencies |
| --- | --- | --- |
| pages | URL and entry composition | domain; services in shared-detail routes |
| domain | Screen-specific queries and presentation | layouts, shared, local components |
| layouts | Document and common shell | shared/components, styles, main |
| shared/components | Reusable UI and local behavior | props, other components, Jails in controllers |
| shared/services | Query and normalize data | http and entities |
| shared/entities | Adapt payloads for visual consumption | local functions and received data |
| shared/main and application | Initialize and coordinate global behavior | Jails and browser APIs |

Service imports point to entities, not the reverse. Components receive prepared objects through props. Entities do not import screens. In the original, URLs are constructed in routes/screens rather than services; services receive a complete URL.

## Concrete flows

**Movie list:** `/` → `pages/index.astro` → `domain/movies/index.astro` → `getTMDBList(url)` → `http.get(url)` → `data.results.map(TMDBEntity)` → cards inside the layout.

**Shared detail:** `/movies/:id` or `/tv/:id` → route reads `Astro.params` and the environment variable → `getTMDB(url)` → HTTP and `TMDBEntity` → `domain/detail` receives `item`, `title`, `menu` → info, cast, gallery. `info` composes trailer-button, which uses the shared modal.

**Person:** the route delegates to `domain/people`; the screen itself reads the id and calls `getPeopleDetails`. `TMDBPeopleEntity` produces `person`, `knownFor`, `social`, and `credits` before rendering.

**Browser:** the layout loads `shared/main`; component scripts register their modules. `start()` runs on `DOMContentLoaded`. The names `app-main`, `app-gallery`, `app-modal`, and `app-navigation` connect HTML tags to controllers. These are Jails associations; there is no local implementation of Web Component classes.

**Communication:** click on `data-modal-open="trailer"` → `application` publishes `modal:open/trailer` → the subscribed modal opens its state. Gallery updates `image`, awaits `state.set`, and publishes `modal:open/gallery`. Modal emits `modal:close`, which gallery listens for to clear the image. `html-class` and `html-src` bind state to the DOM.

## Relevant abstractions

- **Entity factory:** `TMDBEntity(payload)` unifies title/name, formats ratings, dates, and images, limits cast/crew/images, and converts genres to text. These are effectively view models, not persistent entities or business classes.
- **Service facade:** `getTMDB`, `getTMDBList`, and `getPeopleDetails` hide the combination of transport and transformation. The screen chooses the query without repeating formatters.
- **Minimal transport:** `http.get` wraps fetch and JSON parsing. The original neither checks status nor defines a timeout.
- **Composition through props:** two routes and resource types reuse `domain/detail` without inheritance. Local components stay near their feature; common components live in shared.
- **Jails controllers:** the default export receives `Component`; `main` installs handlers, `on` delegates events, `state.set` updates bindings, `publish/subscribe` connect components without direct references, and `emit` sends a DOM event. The exported `model` supplies initial state when needed.

## Observed limitations that are not requirements

1. `TMDBEntity` returns `poster_path` as a full URL, but Card adds the TMDB prefix again. The next implementation's contract must assign URL construction to a single owner.
2. `first_air_date` is extracted but not used as a fallback for `release_date` in `TMDBEntity`; the `Date()` default depends on execution time. Normalize missing dates explicitly. The `release_year` calculation in Credits also ignores `first_air_date`.
3. `images.backdrops`, `credits.cast/crew`, and `item.videos.results` assume valid structures. Destructuring defaults do not cover `null`. Handle missing data according to the new contract without copying the broad use of `any`.
4. The transport does not check `response.ok`. A new application should represent HTTP errors and empty lists consistently with its screens.
5. Credit sorting calls `sort` on the received array and mutates the input. Copy before sorting when reusing data; normalizers should preferably avoid mutation.
6. The modal backdrop only changes `open`, without emitting the event or removing the global listener; route all closing paths through `close` in the new implementation.
7. `application.ts` intercepts every link without a target and delays navigation. It does not distinguish modified clicks, downloads, or anchors. Do not reproduce this indiscriminate interception.
8. The reference uses fade/loader CSS and `location.href`. There is no explicit use of `ClientRouter`, `document.startViewTransition`, or View Transitions directives, despite the README/About text.
9. `jails.stdlib` appears in dependencies, but there is no direct import in src. Do not invent extra initialization without checking the Jails version actually installed.

Snapshot analyzed on October 24, 2026. Captured manifests are evidence of the project, not recommendations for current versions. This was a code analysis; it does not confirm API operation or deployment compatibility.
