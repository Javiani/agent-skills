# store

Compartilhar estado e transições nomeadas.

Exporta `Store` do default de `@javiani/onijs` e seus tipos; o JS distribuído também incorpora Oni. Contrato observado na dependência instalada `1.0.9` e no JS deste módulo:

- `Store(initialState, actions)` é uma factory, sem `new`.
- Actions recebem `(state, payload, { getState, subscribe, dispatch })` e retornam um objeto parcial ou nada. O merge é superficial.
- `getState()` retorna o objeto vivo. `subscribe(callback)` não publica um snapshot inicial; retorna unsubscribe e notifica `(state, { action, payload })`.
- `dispatch(name, payload?)` retorna uma promise do estado; `Actions` mapeia nomes para si mesmos; `destroy()` limpa assinantes.

```js
import { Store } from 'jails.stdlib/store'

export const cart = Store({ count: 0 }, {
    ADD: (state, { amount = 1 }) => ({ count: state.count + amount })
})
const unsubscribe = cart.subscribe((snapshot) => console.log(snapshot.count))
await cart.dispatch('ADD', { amount: 2 })
unsubscribe()
```

Em Jails, envie o snapshot inicial para `state.set`, conecte a subscription a `state.set` e chame unsubscribe em unmount; não há conexão automática. Não destrua o store compartilhado para desmontar um único consumidor.

Estado inicial é clonado via JSON: evite dados não serializáveis. Actions `async` retornam promises que não são aguardadas/mescladas como resultados: faça I/O em serviço ou dispare uma segunda action síncrona. Não assuma que await de dispatch espera requisições iniciadas dentro da action. Dispatch reentrante durante flush pode deixar sua promise pendente nesta implementação; não aguarde dispatch aninhado. `subscribe` aceita função; o pattern matching por objeto mostrado no README de Oni não está implementado nesta versão.

## Origem

Reconhecimento de `src/store/index.ts`, `index.js`, `index.d.ts` e `src/store/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
