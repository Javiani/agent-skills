# Patterns to adapt to the next product

The examples below illustrate the template contracts using products as the new subject. Consult the snapshot for the full syntax of the original components. Do not copy the catalog or visual identity unless requested by the user.

## Service and entity

```ts
// src/shared/services/catalog/http.ts
export const http = {
  async get(url: string): Promise<unknown> {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Catalog HTTP ${response.status}`)
    return response.json()
  }
}
```

```ts
// src/shared/entities/catalog/index.ts
export type ProductPayload = {
  id: string
  name?: string | null
  image_url?: string | null
}
export const ProductEntity = (data: ProductPayload) => ({
  id: data.id,
  title: data.name || 'Unnamed',
  imageUrl: data.image_url || '/placeholder.svg'
})
export type Product = ReturnType<typeof ProductEntity>
```

```ts
// src/shared/services/catalog/index.ts
import { ProductEntity, type ProductPayload } from 'shared/entities/catalog'
import { http } from './http'

export const getProduct = async (url: string) => {
  const data = await http.get(url)
  // Validate the provider payload at the boundary according to its actual contract.
  return ProductEntity(data as ProductPayload)
}
```

The cast above only illustrates the pipeline; it is not runtime validation. For lists, validate the actual envelope and map each item through the same factory. The referenced placeholder must exist in the new project. Avoid spreading provider rules throughout markup.

## Route and screen composition

```astro
---
// src/pages/products/[id].astro
import Detail from 'domain/detail/index.astro'
import { getProduct } from 'shared/services/catalog'
const { id } = Astro.params
const url = new URL(`/products/${encodeURIComponent(id ?? '')}`, import.meta.env.CATALOG_API_URL)
const item = await getProduct(url.toString())
---
<Detail item={item} title={item.title} />
```

Authenticate queries in the server transport when required by the new provider. Define error and invalid-identifier states for the product; the original reference does not implement them.

```astro
---
// src/domain/detail/index.astro
import Layout from 'layouts/default.astro'
import Info from './components/info/index.astro'
import type { Product } from 'shared/entities/catalog'
interface Props { item: Product; title: string }
const { item, title } = Astro.props
---
<Layout title={title}>
  <Info item={item} />
</Layout>
```

`Info` receives `item` and uses `item.imageUrl` directly. For a dedicated listing, `pages/products/index.astro` can simply delegate to `domain/products/index.astro`; the latter queries the service and applies the layout, as in the reference lists.

## Astro component + Jails controller pair

```astro
<!-- src/shared/components/counter/index.astro -->
<script>
  import { register } from 'shared/main'
  import * as appCounter from './index'
  register('app-counter', appCounter)
</script>
<app-counter>
  <button type="button" data-increment>Add</button>
  <span html-text="count">0</span>
</app-counter>
```

```ts
// src/shared/components/counter/index.ts
import { type Component } from 'jails-js/types'
export default function appCounter({ main, on, state }: Component) {
  let count = 0
  main(() => on('click', '[data-increment]', () => {
    count += 1
    state.set({ count })
  }))
}
export const model = { count: 0 }
```

The file pair, registration, and `model` follow the template. Check bindings supported by the installed version when adding new behaviors; the bindings demonstrated in the snapshot are `html-class` and `html-src`. For modals, reuse the `modal:open/<name>` and `modal:close` protocol while fixing the limitations listed in the architecture. Components without interactions do not need a controller.

## Bootstrap and import resolution

```ts
// src/shared/main.ts
import { register, start } from 'jails-js'
import * as appMain from 'shared/application'
export { register, start }
register('app-main', appMain)
document.addEventListener('DOMContentLoaded', () => start())
```

In the layout, import global styles in frontmatter, load `shared/main` through an Astro-processed script, and wrap the shell in `<app-main>`. Configure `shared`, `domain`, and `layouts` to resolve from `src`; the snapshot uses `compilerOptions.baseUrl: "./src"`. Adjust options to the installed TypeScript/Vite version while preserving these imports.

## Result verification

- Feature-exclusive code lives in domain; only shared parts have been promoted to shared.
- Services return normalized objects; entities perform no I/O; UI does not reconstruct already formatted fields.
- No server code imports or secrets have entered Jails controllers.
- Routes sharing a screen pass the same contract through props.
- The available build passes; real queries are only reported as verified when they have been executed.
- Screens handle empty data and query failures according to the requested scope.
