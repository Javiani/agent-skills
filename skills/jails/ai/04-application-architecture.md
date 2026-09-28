# Application architecture

The framework documents components and HTML integration, not a mandatory architecture for large applications. Features, services, stores, and islands below are organizational options, not additional Jails APIs. Preserve suitable existing project boundaries.

## Ownership

| Responsibility | Owner | Avoid |
| --- | --- | --- |
| Initial HTML and request/build-time data | Server or static generator | Automatically refetching data already sufficient for the interaction. |
| Events, focus, selection, messages, loading | Controller and instance state | Data services manipulating DOM. |
| Presentation projection | `view` and directives | External effects in presentation functions. |
| Reusable business rules | Feature functions or modules | Duplicating rules across handlers. |
| I/O and response adaptation | Service when a separate contract helps | Empty layers for trivial calls. |
| Shared data and writes | Explicit owner at the smallest useful scope | Arbitrary writes and manually synchronized copies. |
| Registration and dependency composition | Application or feature entry point | Every component restarting the application. |

An island is a bounded interactive region, not a separate Jails runtime. One entry point can register components for several regions.

## Business rules and API access

A simple interaction-specific rule may stay in its controller. Extract a function when reuse, DOM-independent verification, or clarity benefits. Direct HTTP calls are valid in simple framework examples; introduce a service when transport, adaptation, reuse, or coordination warrants a contract. Services return data or errors; controllers decide presentation.

The following service is application code, not a Jails API:

```js
// features/catalog/catalog-service.js
export function createCatalogService({ fetchImpl, endpoint }) {
  return {
    async list({ signal } = {}) {
      const response = await fetchImpl(endpoint, { signal })

      // Convert transport failure into an explicit error for the caller.
      if (!response.ok) {
        throw new Error('Failed to load catalog')
      }

      return response.json()
    }
  }
}
```

```js
// features/catalog/product-list.js
export const model = { products: [], loading: false, error: '' }

export default function productList({ main, state, dependencies, unmount }) {
  const { catalogService } = dependencies
  const request = new AbortController()
  let active = true

  main(() => {
    load()
  })

  unmount(() => {
    // Prevent late updates and stop work owned by this instance.
    active = false
    request.abort()
  })

  async function load() {
    await state.set({ loading: true, error: '' })

    if (!active) {
      return
    }

    try {
      const products = await catalogService.list({ signal: request.signal })

      if (active) {
        await state.set({ products })
      }
    } catch (error) {
      if (active) {
        await state.set({ error: 'Unable to load products.' })
      }
    } finally {
      if (active) {
        await state.set({ loading: false })
      }
    }
  }
}
```

```js
// main.js
import { register, start } from 'jails-js'
import * as productList from './features/catalog/product-list.js'
import { createCatalogService } from './features/catalog/catalog-service.js'

// Compose the transport dependency once at the application boundary.
const catalogService = createCatalogService({
  fetchImpl: window.fetch.bind(window),
  endpoint: '/api/products'
})

register('product-list', productList, { catalogService })
start()
```

This example expects a JSON array and loads once per mount. Adapt the contract to the backend. For concurrent searches or reloads, cancel superseded requests or track request identity so stale responses cannot replace newer results. `AbortController` is a browser API, not a Jails helper.

## Component and feature boundaries

Create a component when a DOM region has behavior, lifecycle, reuse, or a collaboration contract that benefits from separation. Keep purely visual elements in HTML; shared calculations may only need a function.

A feature groups a product capability, such as a catalog or cart. An ancestor can coordinate descendants with events and props; separate regions can use services or pub/sub according to the [communication guide](03-communication-patterns.md). Sharing data does not require sharing all UI state.

Optional structure for a growing application:

```text
src/
  main.js
  features/
    catalog/
      product-list.js
      product-choice.js
      catalog-service.js
      pricing.js
    cart/
      cart-summary.js
      cart-service.js
  shared/
    http.js
```

Create shared modules only for concrete consumers. A store belongs to an instance, feature, or application according to data scope; no store-per-feature rule is implied. HTML may remain in server templates or application files. Distributed widgets can export `template`.

## Server and browser boundary

The server/SSG supplies initial structure and available data. Jails connects browser interactions, state changes, and DOM updates. Do not assume server-side evaluation of Jails directives.

Use `html-inner` for readable initial values and `<template>` for content that should stay hidden until processed. Align initial HTML with the model to prevent an incorrect first render. Use `templateConfig` when expression delimiters conflict with a server template engine.

Preserve native forms and navigation where sufficient. Jails need not control the entire page; a root coordinator is also valid when it has a real responsibility.

## Verify the changed responsibility

Check business calculations independently of DOM when useful, services for response/error contracts, and components for interaction/rendering. For collaboration, consider independent instances, late subscribers, cleanup, and data ownership. For SSR/SSG, inspect HTML before JavaScript and consistency after activation. Run only checks relevant to the change and available environment.
