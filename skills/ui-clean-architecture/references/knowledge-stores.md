# Stores

Stores manage state persistence and communication between components within one screen or [domain](knowledge-domain.md).

## Required structure

- Use `@javiani/onijs` for screen state.
- A screen may have only one store.
- Place that store at `store/index.ts` within the screen domain.
- Components capture system events, user actions, and page lifecycle events, then dispatch actions to the store.
- The store keeps state in memory. Persistence to `sessionStorage`, `localStorage`, or another medium is an explicit side effect handled outside actions.
- A component that consumes shared screen state must connect to the store directly through the appropriate framework adapter. Do not pass shared state through the Domain only to reach descendant components.
- Types used only by a store belong in `store/types.ts` and are imported by `store/index.ts`.
- If a store type is also consumed by the Domain or another nested abstraction, place it in `types.ts` at the nearest common parent of those consumers. Keep other store-only types in `store/types.ts`.
- In TypeScript store modules, declare structures with `type` aliases rather than `interface` declarations, and use arrow functions throughout instead of `function` declarations.
- Write every action as a multiline arrow-function block with an explicit `return`; do not use expression-bodied one-line actions.
- Add one blank line immediately before and after each action definition in the actions object so each action is visually distinct.
- Name the first parameter of every action `state`, never `_`. Use it to form the next state and preserve unaffected fields where appropriate, rather than silencing an unused parameter.
- Do not use the JavaScript `void` operator as a statement to discard promises or silence unused values. Use `void` only in TypeScript type positions, such as a function return type.
- Place module-level utility arrow functions below the exported store and subscriber declarations at the bottom of the file. Keep the public API and primary behavior visible before implementation-detail helpers.
- Keep actions focused on the state transition. When validation or transformation makes an action long or difficult to scan, extract that logic into a module-level arrow-function helper below the store and subscriber declarations, then call it from the action. The helper returns only the resolved values (not the whole next state); the action destructures them and explicitly composes its return object, spreading `state` and listing each property it changes. Never write `return helper(state, payload)` directly.
- Keep `initialState` as a simple in-memory default. Do not read persistence, run an IIFE, or perform restoration logic before creating the store.
- Read persisted values outside the store, such as in the component that initializes the screen, then dispatch a restoration action with the value as a named payload property. Put validation, normalization, and the state transition in that action.
- If restoration validation or normalization makes the action long or complex, keep the action concise and extract the logic into a module-level arrow-function helper after the exported store and subscriber declarations. The action calls the helper with the payload, destructures the named values it returns, and explicitly composes the returned state with `...state` plus each changed property.

```ts
RESTORE_STATE: (state, { savedState }) => {
  const { name, email, age } = resolveRestoredRegistration(savedState)

  return {
    ...state,
    name,
    email,
    age,
  }
},
```
- Keep persistence writes outside actions in subscribers. A restoration action may be included in a filtered subscriber when the normalized restored state should replace malformed or outdated persisted data.

## Oni API contract

Use the vanilla `@javiani/onijs` API according to this contract:

- `Oni(initialState, actions)` creates a store.
- Each action receives `(state, payload, helpers)` and returns `Partial<State>` or `void`.
- `helpers` provides `getState`, `subscribe`, and `dispatch`.
- `store.dispatch(ACTION_NAME, payload)` returns a `Promise<State>` after the action and its subscribers finish.
- `store.subscribe(callback)` accepts one function, not an action-to-callback object.
- A subscriber callback receives `(state, metadata)`, where `metadata` contains `action` and `payload`.
- `subscribe` returns an unsubscribe function.
- Define `initialState` as a named camelCase constant. This is an intentional exception to the general `SCREAMING_SNAKE_CASE` naming rule for constants.
- Define the actions object inline in the `Oni` or `createStore` call. Do not extract it into a separate constant.

```ts
const unsubscribe = store.subscribe((state, { action, payload }) => {
  console.log(state, action, payload)
})

const nextState = await store.dispatch('SET_MOVIES', { movies })
unsubscribe()
```

Never use the following subscriber shape:

```ts
store.subscribe({ SET_MOVIES: callback })
```

The vanilla API does not support it and will throw `TypeError: ... is not a function` during dispatch.

## Action contract

Apply these rules to every action:

1. Use `SCREAMING_SNAKE_CASE` for action names. The name is a public contract shared by `dispatch`, subscribers, and framework adapters.
2. Use an object with named properties for every payload, even when it carries one value.
3. Type action keys exactly as they appear in the object passed to `Oni`.
4. By default, keep actions pure: calculate and return the next partial state.

```ts
// domains/catalog/store/types.ts
export type CatalogMovie = {
  id: number
  title: string
}

export type CatalogState = {
  movies: CatalogMovie[]
  favorites: number[]
}

export type CatalogActions = {
  SET_MOVIES: (
    state: CatalogState,
    payload: { movies: CatalogMovie[] },
  ) => Partial<CatalogState>
  TOGGLE_FAVORITE: (
    state: CatalogState,
    payload: { id: number },
  ) => Partial<CatalogState>
}
```

```ts
// domains/catalog/store/index.ts
import Oni from '@javiani/onijs'
import type { CatalogActions, CatalogState } from './types'

const store = Oni<CatalogState, CatalogActions>(initialState, {

  SET_MOVIES: (state, { movies }) => {
    return {
      ...state,
      movies,
    }
  },

  TOGGLE_FAVORITE: (state, { id }) => {
    const favorites = state.favorites.includes(id)
      ? state.favorites.filter((favoriteId) => favoriteId !== id)
      : [...state.favorites, id]

    return {
      ...state,
      favorites,
    }
  },

})

store.dispatch('SET_MOVIES', { movies })
```

Do not use `camelCase` or `PascalCase` action names. Do not use positional payloads such as `store.dispatch('SET_MOVIES', movies)`.

## Async orchestration

An action may use the third argument, `{ dispatch }`, when it must make an asynchronous transition explicit by dispatching another action. This is the only documented exception to pure state-calculation actions.

Prefer resolving external requests in a service and passing the resulting promise or data into the action. An action may perform the request directly only when that deliberate side effect materially simplifies the flow.

```ts
const initialState = { items: [], loading: false }

const store = Oni(initialState, {

  LOAD_ITEMS: (state, { itemsPromise }, { dispatch }) => {
    itemsPromise.then((items) => dispatch('SET_ITEMS', { items }))
    return {
      ...state,
      loading: true,
    }
  },

  SET_ITEMS: (state, { items }) => {
    return {
      ...state,
      items,
      loading: false,
    }
  },

})
```

Do not use this exception for local persistence, analytics, or unrelated effects. Handle those through filtered subscribers or dedicated services.

## Persistence

Never call `localStorage.setItem`, `sessionStorage.setItem`, or another persistence writer inside an action.

Register persistence outside the actions with `store.subscribe`. Filter the subscriber by the received action name and persist only when the relevant state changes.

```ts
const STORAGE_KEY = 'app-preferences'

store.subscribe((state, { action }) => {
  switch (action) {
    case 'UPDATE_PREFERENCES':
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.preferences))
      break
    default:
      break
  }
})
```

Use a subscriber that persists after every action only when persisting the entire state after every change is intentional. Otherwise, always filter with `switch (action)`. Do not try to filter actions by passing an object to `subscribe`.

When state must be restored from storage, keep the store's `initialState` as its simple default and read storage from the screen component or another integration point outside the store. Dispatch a restoration action with a named payload property. Keep parsing, validation, normalization, and the state transition in that action; keep writes or cleanup as explicit side effects in a filtered subscriber or the integration point. Guard browser-only storage access when the component or integration point can run during server rendering.

```ts
const STORAGE_KEY = 'store-data'
const initialState = {
  counter: 0,
}

export const store = Oni(initialState, {

  RESTORE_STATE: (state, { savedState }) => {
    if (
      !savedState ||
      typeof savedState !== 'object' ||
      typeof (savedState as Record<string, unknown>).counter !== 'number'
    ) {
      return {
        ...state,
        ...initialState,
      }
    }

    return {
      ...state,
      counter: (savedState as { counter: number }).counter,
    }
  },

  COUNTER_ADD: (state, { increment = 1 }) => {
    return {
      ...state,
      counter: state.counter + increment,
    }
  },

  COUNTER_SUBTRACT: (state, { decrement = 1 }) => {
    return {
      ...state,
      counter: state.counter - decrement,
    }
  },

})

store.subscribe((state, { action }) => {
  switch (action) {
    case 'RESTORE_STATE':
    case 'COUNTER_ADD':
    case 'COUNTER_SUBTRACT':
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      break
    default:
      break
  }
})

if (typeof window !== 'undefined') {
  const savedState = sessionStorage.getItem(STORAGE_KEY)
  store.dispatch('RESTORE_STATE', {
    savedState: savedState ? JSON.parse(savedState) : null,
  })
}
```

Add parsing or runtime validation when persisted data can be malformed or untrusted. Keep that validation in the restoration action rather than in store initialization.

## Vanilla store instance

The store instance exposes three primary operations:

```ts
const unsubscribe = store.subscribe((state, { action, payload }) => {
  console.log(state, action, payload)
})

const nextState = await store.dispatch('COUNTER_ADD', { increment: 2 })
const currentState = store.getState()

unsubscribe()
```

## Framework integration

`@javiani/onijs` is framework-agnostic. Use the official adapter for the selected framework when one exists. Otherwise, connect `getState`, `dispatch`, and `subscribe` to that framework's reactive mechanism.

In non-React applications:

- Import `Oni` from `@javiani/onijs`.
- Do not import `@javiani/onijs/react`.
- Subscribe inside the component that consumes the state.
- Do not prop-drill store state through the Domain.

```ts
import Oni from '@javiani/onijs'

const initialState = { items: [] }

export const store = Oni(initialState, {
  SET_ITEMS: (state, { items }) => {
    return {
      ...state,
      items,
    }
  },
})

store.subscribe((state, { action }) => {
  switch (action) {
    case 'SET_ITEMS':
      renderItems(state.items)
      break
    default:
      break
  }
})
```

## React adapter

React applications must use `createStore` and `useStore` from `@javiani/onijs/react`.

- Components must import `useStore` from the local store module, not import `Oni` directly.
- `useStore` subscribes and rerenders the component automatically.
- Do not reproduce this behavior with `useState`, `useEffect`, and a vanilla subscriber.
- The store module may use its exported `store` instance for filtered persistence effects.

```ts
// domains/example/store/index.ts
import { createStore } from '@javiani/onijs/react'

const initialState = {
  counter: 0,
}

export const { store, useStore } = createStore(initialState, {
  COUNTER_ADD: (state, { increment = 1 }) => {
    return {
      ...state,
      counter: state.counter + increment,
    }
  },
  COUNTER_SUBTRACT: (state, { decrement = 1 }) => {
    return {
      ...state,
      counter: state.counter - decrement,
    }
  },
})
```

```tsx
import { useStore } from '../../store'

export default function CounterButton() {
  const { state, dispatch } = useStore()

  return (
    <button onClick={() => dispatch('COUNTER_ADD', { increment: 1 })}>
      {state.counter}
    </button>
  )
}
```

Do not manually bridge the vanilla store into React:

```tsx
// Forbidden in React
const [state, setState] = useState(store.getState())

useEffect(
  () => store.subscribe(() => setState(store.getState())),
  [],
)
```

To load data, let a service resolve it and use the `dispatch` returned by `useStore`:

```tsx
useEffect(() => {
  loadItems().then((items) => dispatch('SET_ITEMS', { items }))
}, [dispatch])
```

### Restricting React updates

By default, every component using `useStore` rerenders after every store change. Pass an array of action names to rerender only after those actions:

```tsx
export default function CounterDisplay() {
  const { state } = useStore(['COUNTER_ADD', 'COUNTER_SUBTRACT'])

  return <p>{state.counter}</p>
}
```

This action-based restriction replaces prop-change observation for shared store state. Do not add a `useEffect` solely to observe changes in the store state object.

### React dependency deduplication

The React adapter uses hooks internally. If Oni and the application resolve different copies of `react` or `react-dom`, React may throw `Invalid hook call`.

In Vite projects, deduplicate both dependencies:

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
```

## Vanilla React fallback

Use this only when the official React adapter is unavailable. Because `dispatch` returns a promise, update local React state from the resolved store state:

```tsx
const [state, setState] = useState(store.getState())

const dispatch = async (action: keyof Actions, payload: unknown) => {
  const nextState = await store.dispatch(action, payload)
  setState(nextState)
}
```

Subscribers may still observe side effects, but must not be the sole rendering bridge. After initial data loading, dispatch an action that ends the loading state:

```tsx
useEffect(() => {
  loadItems().then((items) => dispatch('SET_ITEMS', { items }))
}, [])
```
