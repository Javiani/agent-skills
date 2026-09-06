# Stores

Stores manage state persistence and communication between components within one screen or [domain](../domain/index.md).

## Required structure

- Use `@javiani/onijs` for screen state.
- A screen may have only one store.
- Place that store at `store/index.ts` within the screen domain.
- Components capture system events, user actions, and page lifecycle events, then dispatch actions to the store.
- The store keeps state in memory. Persistence to `sessionStorage`, `localStorage`, or another medium is an explicit side effect handled outside actions.
- A component that consumes shared screen state must connect to the store directly through the appropriate framework adapter. Do not pass shared state through the Domain only to reach descendant components.

## Oni API contract

Use the vanilla `@javiani/onijs` API according to this contract:

- `Oni(initialState, actions)` creates a store.
- Each action receives `(state, payload, helpers)` and returns `Partial<State>` or `void`.
- `helpers` provides `getState`, `subscribe`, and `dispatch`.
- `store.dispatch(ACTION_NAME, payload)` returns a `Promise<State>` after the action and its subscribers finish.
- `store.subscribe(callback)` accepts one function, not an action-to-callback object.
- A subscriber callback receives `(state, metadata)`, where `metadata` contains `action` and `payload`.
- `subscribe` returns an unsubscribe function.
- Define `initialState` as a named constant.
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
type CatalogActions = {
  SET_MOVIES: (
    state: CatalogState,
    payload: { movies: Movie[] },
  ) => Partial<CatalogState>
  TOGGLE_FAVORITE: (
    state: CatalogState,
    payload: { id: number },
  ) => Partial<CatalogState>
}

const store = Oni<CatalogState, CatalogActions>(initialState, {
  SET_MOVIES: (_, { movies }) => ({ movies }),
  TOGGLE_FAVORITE: (state, { id }) => ({
    favorites: state.favorites.includes(id)
      ? state.favorites.filter((favoriteId) => favoriteId !== id)
      : [...state.favorites, id],
  }),
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
  LOAD_ITEMS: (_, { itemsPromise }, { dispatch }) => {
    itemsPromise.then((items) => dispatch('SET_ITEMS', { items }))
    return { loading: true }
  },
  SET_ITEMS: (_, { items }) => ({ items, loading: false }),
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

When initial state must be restored from storage, read and validate the stored value before creating the store. Guard browser-only APIs when server rendering is possible.

```ts
const STORAGE_KEY = 'store-data'

const savedState = typeof window === 'undefined'
  ? null
  : JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')

const initialState = savedState ?? {
  counter: 0,
}

export const store = Oni(initialState, {
  COUNTER_ADD: (state, { increment = 1 }) => ({
    counter: state.counter + increment,
  }),
  COUNTER_SUBTRACT: (state, { decrement = 1 }) => ({
    counter: state.counter - decrement,
  }),
})

store.subscribe((state, { action }) => {
  switch (action) {
    case 'COUNTER_ADD':
    case 'COUNTER_SUBTRACT':
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      break
    default:
      break
  }
})
```

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
  SET_ITEMS: (_, { items }) => ({ items }),
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
  COUNTER_ADD: (state, { increment = 1 }) => ({
    counter: state.counter + increment,
  }),
  COUNTER_SUBTRACT: (state, { decrement = 1 }) => ({
    counter: state.counter - decrement,
  }),
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
