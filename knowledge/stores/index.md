# Stores

Stores são usadas para persistencia de dados e comunicação entre componentes em uma tela / [domain](../domain/index.md).
Utilize a biblioteca `@javiani/onijs`.
Para cada tela pode ter apenas 1 store, ficando na pasta `store/index.ts`
Os componentes ficam responsáveis por captar eventos do sistema, ações do usuário, momentos de carregaamento da página e disparam ações para a store e ela mantém as informações salvas em memória ou em session / localstorage ou qualquer outra capacidade de persistencia.

## Contrato da API do Oni

Use a API vanilla de `@javiani/onijs` desta forma:

- `Oni(initialState, actions)` cria a store.
- Cada action recebe `(state, payload, helpers)` e retorna um `Partial<State>` ou `void`.
- `helpers` contém `getState`, `subscribe` e `dispatch`.
- `store.dispatch(ACTION_NAME, payload)` retorna uma `Promise<State>` com o estado depois que a action e os subscribers terminarem.
- `store.subscribe(callback)` recebe uma função, não um objeto de callbacks. O callback recebe `(state, metadata)`, e `metadata` contém `action` e `payload`.
- `subscribe` retorna uma função de unsubscribe.
- Mantenha o `initialState` em uma constante nomeada e declare o objeto de actions inline na chamada de `Oni` ou `createStore`. Não extraia as actions para uma constante separada.

Não use `store.subscribe({ ACTION_NAME: callback })`: esse formato não é compatível com a API vanilla do Oni e causa `TypeError: ... is not a function` durante o dispatch.

```ts
const unsubscribe = store.subscribe((state, { action, payload }) => {
  console.log(state, action, payload)
})

const nextState = await store.dispatch('SET_MOVIES', { movies })
unsubscribe()
```

### Convenção obrigatória para actions

Toda action deve ser nomeada em `SCREAMING_SNAKE_CASE`, pois o nome é o contrato público usado por `dispatch`, subscribers e adaptadores React. O payload deve ser um objeto com propriedades nomeadas, mesmo quando a action recebe apenas um valor. Isso mantém o fluxo explícito e permite evoluir o payload sem alterar a assinatura da action.

Em TypeScript, tipamos as actions com as mesmas chaves usadas no objeto passado ao `Oni`:

```ts
type CatalogActions = {
  SET_MOVIES: (state: CatalogState, payload: { movies: Movie[] }) => Partial<CatalogState>
  TOGGLE_FAVORITE: (state: CatalogState, payload: { id: number }) => Partial<CatalogState>
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

Não crie actions em `camelCase`, `PascalCase` ou com payloads posicionais como `store.dispatch('SET_MOVIES', movies)`.

### Pureza, dispatch e persistência local

Por padrão, as actions devem somente calcular e retornar a próxima parte do estado. Existe uma exceção para fluxos que precisam orquestrar outras transições: o Oni disponibiliza a instância da store como terceiro parâmetro da action, e ela pode usar `dispatch` para disparar outra action. Nesse cenário, a action pode ser impura; isso é aceitável quando torna explícito o fluxo assíncrono entre actions.

Essa exceção não inclui persistência local. Não coloque efeitos de persistência, como `localStorage.setItem`, dentro de uma action. A persistência continua sendo responsabilidade de `subscribe`, filtrada pela action relevante.

Quando uma parte do estado precisar ser persistida, registre a persistência fora das actions usando `subscribe` e filtre pelo nome da action recebido no segundo argumento do callback. Escute somente a action que altera aquele estado para evitar gravações desnecessárias:

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

Use um subscriber global somente quando toda mudança de estado precisar ser persistida intencionalmente. Para persistência parcial ou efeitos condicionais, use sempre `switch (action)` no callback de `store.subscribe`. Não tente filtrar passando um objeto para `subscribe`.

Quando uma action precisar iniciar uma sequência assíncrona, use o terceiro parâmetro `{ dispatch }` para encaminhar o resultado para outra action:

```ts
const initialState = { items: [], loading: false }

const store = Oni(initialState, {
  LOAD_ITEMS: (state, { itemsPromise }, { dispatch }) => {
    itemsPromise.then((items) => dispatch('SET_ITEMS', { items }))

    return { loading: true }
  },
  SET_ITEMS: (_, { items }) => ({ items, loading: false }),
})
```

Não use essa exceção para salvar dados no `localStorage`, disparar analytics ou executar outras persistências. Esses efeitos devem continuar em subscribers ou serviços próprios, conforme o caso.

Exemplo:

```js
import Oni from '@javiani/onijs'

const initialState = {
  user: { ... },
  counter: 0
}

export const store = Oni( initialState,  {

/**  @Actions **/
  COUNTER_ADD: ( state, { increment = 1 }) => {
    return {
      counter : state.counter + increment
    }
  },

  COUNTER_SUBTRACT: ( state, { decrement = 1 }) => {
    return {
      counter: state.counter - decrement
    }
  }
})


store.subscribe((state, { action }) => {
  switch (action) {
    case 'COUNTER_ADD':
    case 'COUNTER_SUBTRACT':
      localStorage.setItem('store_data', JSON.stringify(state))
      break
    default:
      break
  }
})
```

## Exemplo fazendo sync do salvamento e resgate das informações em local storage


```js
import Oni from '@javiani/onijs'

const STORAGE_KEY = 'store_data'
const savedItem = localStorage.getItem(STORAGE_KEY)
const savedState = savedItem? JSON.parse(savedItem) : null

const initialState = savedState || {
  user: { ... },
  counter: 0
}

export const store = Oni( initialState,  {

/**  @Actions **/
  COUNTER_ADD: ( state, { increment = 1 }) => {
    return {
      counter : state.counter + increment
    }
  },

  COUNTER_SUBTRACT: ( state, { decrement = 1 }) => {
    return {
      counter: state.counter - decrement
    }
  }
})


store.subscribe((state, { action }) => {
  switch (action) {
    case 'COUNTER_ADD':
    case 'COUNTER_SUBTRACT':
      localStorage.setItem('store_data', JSON.stringify(state))
      break
    default:
      break
  }
})
```

A toda mudança na store ela salva em localStorage, e resgata esse item em tempo de carregamento da tela.

## Using the store instance 👩🏻‍💻

```js
import store from './src/stores/my-store.js'

// Subscribe a function that will be called after every dispatch call
const unsubscribe = store.subscribe( ( (state, { action, payload }) => {
  console.log( state, action, payload )
}

// Unsubscribe
unsubscribe() // Removes that subscriber function from update function list.

// Firing an action
store.dispatch('COUNTER_ADD', { increment: 2 }) // Second parameter can be any serializable object.

// Getting the current store state
store.getState()

```

## Framework adapters

`@javiani/onijs` é a API vanilla do Oni e não depende de React ou de outro framework. Em aplicações que não usam React, importe `Oni` diretamente e conecte `store.getState()`, `store.dispatch()` e `store.subscribe()` ao mecanismo reativo próprio do framework escolhido. O componente que depende do estado deve fazer essa inscrição localmente; não passe o estado compartilhado pelo Domain apenas para alcançar um descendente.

```js
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

Use o adapter oficial do framework quando existir. O uso vanilla é o caminho padrão para integrações não React e continua agnóstico ao framework; não importe `@javiani/onijs/react` em aplicações que não usam React.

## React Adapter 🔌

Em projetos React, use obrigatoriamente o adapter `@javiani/onijs/react` para conectar a store aos componentes. Não importe `Oni` diretamente no componente, não use `store.subscribe` vanilla para provocar renders e não replique `useState`/`setState` para acompanhar a store. O hook `useStore` se inscreve e atualiza o componente automaticamente.

Essa regra é específica da integração React. Em aplicações não React, siga a seção de API vanilla acima.

`shared/store/my-store.js`

```js
import { createStore } from '@javiani/onijs/react'

const initialState = {
  user: { ... },
  counter: 0
}

export const { store, useStore } = createStore(initialState, {
  COUNTER_ADD: (state, { increment = 1 }) => ({
    counter: state.counter + increment
  }),
  COUNTER_SUBTRACT: (state, { decrement = 1 }) => ({
    counter: state.counter - decrement
  })
})
```

O `store` exportado pode ser usado no próprio módulo da store para efeitos como persistência filtrada. Os componentes React devem importar somente `useStore` desse módulo:

```tsx
import { useStore } from './store'

export default function MyComponent() {
  const { state, dispatch } = useStore()

  return (
    <button onClick={() => dispatch('COUNTER_ADD', { increment: 1 })}>
      {state.counter}
    </button>
  )
}
```

Não faça isto em um componente React:

```tsx
const [state, setState] = useState(store.getState())

useEffect(
  () => store.subscribe(() => setState(store.getState())),
  [],
)
```

Esse padrão mistura a API vanilla com o adapter e pode deixar a renderização fora do ciclo do React. Para carregar dados, faça o serviço resolver os dados e use o `dispatch` retornado por `useStore`:

```tsx
useEffect(() => {
  loadItems().then((items) => dispatch('SET_ITEMS', { items }))
}, [dispatch])
```

O adapter usa hooks React internamente. Se o pacote Oni e a aplicação resolverem cópias diferentes de `react` ou `react-dom`, o runtime pode lançar `Invalid hook call`. Em projetos Vite, deduplicate as dependências:

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

## Using in a React Component


```jsx
import { useStore } from "./store/index";

export default function MyComponent() {
  // All available options : { state, action, payload, dispatch }
  const { state, dispatch } = useStore();

  const onButtonClick = (e) => {
    dispatch("COUNTER_ADD", { increment: 5 });
    // After dispatch:
    // action will be : COUNT_ADD
    // payload will be: { increment: 5 }
    // state will be current state
  };

  return (
    <div className="counter">
      <h1>Counter</h1>
      <p>{state.counter}</p>
    </div>
  );
}
```

### Restricting Updates

Every React component that use the custom hook `useStore` will automatically update on every state changes. Since state is not a primitive value, it's not a good idea to use `useEffect` in order to respond when some prop has changed, instead, you can specify what kind of actions your component will be listening to:

```jsx
export default function CounterDisplay() {
  // All available options : { state, action, payload, dispatch }
  const { state } = useStore(["COUNTER_ADD", "COUNTER_SUBTRACT"]);

  return (
    <div className="counter-display">
      <h1>Counter Display</h1>
      <p>{state.counter}</p>
    </div>
  );
}
```

The component above will only rerender if some other component has dispatched : `COUNTER_ADD` and `COUNTER_SUBTRACT`.
So here, we are thinking different from the prop change approach, we are saying that this component should react to a certain kind of actions on your application.


## Filtrando actions no subscriber - Vanilla JS

Every `dispatch` call notifies all subscribers. Para executar um efeito somente para actions específicas, use `switch (action)` com o campo `action` recebido no segundo argumento do callback de `subscribe`. Esse padrão mantém as actions observadas explícitas e permite agrupar cases que executam o mesmo efeito.

```js
store.subscribe((state, { action }) => {
  switch (action) {
    case 'UPDATE_VALUE':
      doSomethingOnValueUpdate(state.value)
      break
    case 'RESET_VALUE':
      resetSomething(state.value)
      break
    default:
      break
  }
});
```

## Atualizando a UI com dispatch

Como `dispatch` retorna uma Promise, uma integração React que usa a store vanilla deve atualizar o estado local com o estado resolvido. O subscriber pode continuar sendo usado para observar efeitos, mas não dependa de um formato de subscriber incompatível para renderizar a tela:

```tsx
const [state, setState] = useState(store.getState())

const dispatch = async (action: keyof Actions, payload: unknown) => {
  const nextState = await store.dispatch(action, payload)
  setState(nextState)
}
```

Para carregamento inicial, faça o serviço resolver os dados e despache uma action que encerre o loading:

```tsx
useEffect(() => {
  loadItems().then((items) => dispatch('SET_ITEMS', { items }))
}, [])
```

Isso evita manter a tela presa em `loading` quando a mudança da store não for conectada diretamente ao estado do componente.

## Async Changes

We belive that Javascript has a great set of tools and strategies to deal with concurrency but it can be very chalenging for those who are starting in the Front-end carrer or for those that are starting in a new team, so we wanna keep it as most simple as we can. So we highly recommend to break down in more actions to give a nice and clean flux of your application.

E.g
We wanna to dispatch an action that will fetch a list of products and in the same time update our UI loading state.

**Disclaimer: Feel free to create side-effect actions if you intend to simplify your architecture**

```js
const initialState = { products: [], loading: false }

const store = Oni(initialState, {
  GET_PRODUCTS: (state, { url }, { dispatch }) => {
    fetch(url)
      .then((response) => response.json())
      .then((products) => dispatch("LOAD_PRODUCTS_FROM_API", { products }));

    return {
      loading: true,
    };
  },

  LOAD_PRODUCTS_FROM_API: (state, { products }) => {
    return {
      products,
      loading: false,
    };
  },
});
```

As you can see, the third parameter provides the Oni instance, so you can call another `action` from there, we belive that's the best way to any other developer figure out just by looking at the action what is gonna be the next step.

There are other ways to do the same thing we did in the code above, if you want to let your actions pure, you can make the service call from a component and delegate to the action only the orchestration of the state transitions of your application:

```js
const initialState = { products: [], loading: false }

const store = Oni(initialState, {
  GET_PRODUCTS: (state, { productsPromise }, { dispatch }) => {
    productsPromise.then((products) =>
      dispatch("LOAD_PRODUCTS_FROM_API", { products })
    );
    return {
      loading: true,
    };
  },

  LOAD_PRODUCTS_FROM_API: (state, { products }) => {
    return {
      products,
      loading: false,
    };
  },
});

```
