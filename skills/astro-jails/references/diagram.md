# Architecture diagram

Solid arrows in the first diagram represent dependencies or usage. HTTP queries the provider; the service applies the entity to the response before returning it to the screen. The diagram does not represent nonexistent Clean Architecture layers.

```mermaid
flowchart TB
  subgraph server[Server — Astro SSR]
    P[pages — routes] --> D[domain — feature screens]
    P -->|shared details| S[shared/services — queries]
    D --> S
    S --> H[http.ts — fetch and JSON]
    S --> E[shared/entities — normalization]
    D --> L[layouts/default — document and shell]
    D --> C[Local components and shared/components]
    L --> C
  end
  H --> API[External API]
  D -. HTML and scripts .-> B[Browser — MPA]
  subgraph client[Progressive interaction — Jails]
    B --> M[shared/main — register and start]
    M --> A[shared/application — app-main]
    M --> J[index.ts controllers beside index.astro]
    A -->|publish modal:open/name| J
    J --> ST[model e state.set → bindings HTML]
    J -->|emit modal:close| J
  end
```

```mermaid
sequenceDiagram
  participant N as Browser
  participant P as pages/movies/[id]
  participant S as getTMDB
  participant H as http.get
  participant API as TMDB
  participant E as TMDBEntity
  participant D as domain/detail
  N->>P: GET /movies/123
  P->>S: URL with id and server-side credential
  S->>H: get(url)
  H->>API: fetch(url)
  API-->>H: JSON
  H-->>S: payload
  S->>E: normalize(payload)
  E-->>S: presentation object
  S-->>P: item
  P->>D: item, title, menu
  D-->>N: HTML composed with layout and components
  Note over N: Jails initializes local behaviors
```

Standalone visual version: [architecture.svg](../assets/architecture.svg).
