# Framework-agnostic jails.stdlib store

Source: contract and examples supplied directly by the Jails author. Prefer this store when shared state is needed; other framework-agnostic reactive stores using events or signals are also compatible.

## Contents

- [Create a store](#create-a-store)
- [Dispatch actions](#dispatch-actions)
- [Read and subscribe](#read-and-subscribe)
- [Consume through a static import](#consume-through-a-static-import)
- [Consume through dependency injection](#consume-through-dependency-injection)
- [Filter by action](#filter-by-action)
- [Cleanup and lifetime](#cleanup-and-lifetime)

## Create a store

Import the named factory `Store` from `jails.stdlib/store`. It accepts initial state and an actions object. Each action receives state, payload, and a context containing `dispatch`. Returned objects update only the supplied properties.

```js
// shared/store.js
import { Store } from 'jails.stdlib/store'

const initialState = {
  loading: false,
  items: [],
  error: null
}

export const store = Store(initialState, {
  FETCH: (state, payload, { dispatch }) => {
    // Return the loading transition now; dispatch completion separately.
    fetch('/some/async/service')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load items')
        }

        return response.json()
      })
      .then(data => {
        dispatch('LOADED', { data })
      })
      .catch(error => {
        dispatch('FAILED', { message: error.message })
      })

    return { loading: true, error: null }
  },

  LOADED: (state, { data }) => {
    return {
      items: data,
      loading: false
    }
  },

  FAILED: (state, { message }) => {
    return {
      loading: false,
      error: message
    }
  }
})
```

The endpoint is illustrative and must return a JSON array for this contract. Response decoding and failure handling complete the original example. Action names belong to the application, not the framework.

`FETCH` starts I/O and immediately returns a partial update. Do not make the action `async` without confirming that the installed store supports promises as action results.

## Dispatch actions

Outside an action, use `store.dispatch(action, payload)`:

```js
import { store } from './shared/store.js'

// Start the application-defined operation with its expected payload.
store.dispatch('FETCH', {})
```

Inside an action, use the third-argument `dispatch`. Its return contract is unspecified; awaiting dispatch must not be assumed to await I/O started by an action.

## Read and subscribe

- `store.getState()` returns current state.
- `store.subscribe(callback)` observes changes and returns cleanup for that subscription.
- The callback can receive `(storeState, { action, payload })` for action-based filtering.
- `store.clear()` removes all subscriptions; it is not a state reset.
- Connect store data to the component with Jails `state.set(...)`.

The store is distinct from the component's `state` helper. Name callback data `storeState` to avoid shadowing that helper.

## Consume through a static import

```js
import { store } from './shared/store.js'

export const model = { data: null }

export default function appComponentA({ main, state, unmount }) {
  let unsubscribe

  const sync = () => {
    state.set({ data: store.getState() })
  }

  main(() => {
    unsubscribe = store.subscribe(sync)

    // Populate late-mounted consumers without assuming an initial callback.
    sync()
  })

  unmount(() => {
    unsubscribe?.()
  })
}
```

Adapt the import path to the project. A named import matches `export const store`; use a default import only when the module exports one. An explicit snapshot avoids assuming that subscribing immediately invokes the callback.

## Consume through dependency injection

Application entry point:

```js
import { register, start } from 'jails-js'
import { store } from './shared/store.js'
import * as appComponentA from './components/app-component-a.js'

// Supply the store instance selected by the application.
register('app-component-a', appComponentA, { store })
start()
```

Component module:

```js
export const model = { data: null }

export default function appComponentA({ main, state, dependencies, unmount }) {
  const { store } = dependencies
  let unsubscribe

  const sync = () => {
    state.set({ data: store.getState() })
  }

  main(() => {
    unsubscribe = store.subscribe(sync)
    sync()
  })

  unmount(() => {
    // Release this consumer without disconnecting other subscribers.
    unsubscribe?.()
  })
}
```

Prefer static imports when the shared module is the intended dependency. Inject when consumers must choose or vary the instance. Neither pattern requires a store for every component.

## Filter by action

```js
export const model = { items: [], error: null }

export default function appComponentA({ main, state, dependencies, unmount }) {
  const { store } = dependencies
  let unsubscribe

  const onStoreChange = (storeState, { action, payload }) => {
    // This component displays results and errors, but no loading indicator.
    switch (action) {
      case 'LOADED':
        state.set({ items: storeState.items, error: null })
        break
      case 'FAILED':
        state.set({ error: payload.message })
        break
    }
  }

  main(() => {
    unsubscribe = store.subscribe(onStoreChange)

    const snapshot = store.getState()
    state.set({ items: snapshot.items, error: snapshot.error })
  })

  unmount(() => {
    unsubscribe?.()
  })
}
```

Filtering limits this consumer's projection updates, not store processing. Include every action that changes displayed fields; a loading indicator must also observe `FETCH` and completion transitions.

## Cleanup and lifetime

Retain each `subscribe` return value and call it from the consumer's `unmount`. The store may outlive that consumer while its feature or application still needs it.

Reserve `store.clear()` for the store owner's intentional shutdown of all observations. Calling it from one shared-store consumer would disconnect the others. Unsubscribing does not reset state or cancel HTTP requests started by actions.
