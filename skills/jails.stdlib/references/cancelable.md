# cancelable

Ignorar resultados assíncronos obsoletos.

`cancelable(fn)` retorna uma função `(...args) => Promise`. `fn` precisa retornar uma promise. Somente a chamada mais recente resolve ou rejeita a promise externa.

```js
import { cancelable } from 'jails.stdlib/cancelable'

const search = cancelable((term) =>
    fetch(`/api/search?q=${encodeURIComponent(term)}`).then((response) => response.json())
)
search('jails').then((data) => console.log(data)).catch(console.error)
```

Não cancela a requisição nem seus efeitos. Promises de chamadas ultrapassadas ficam pendentes: não use `Promise.all` sobre todas elas nem dependa de seus `finally` para limpeza. Não preserva o `this` do chamador. Uma exceção síncrona de `fn` rejeita imediatamente, fora do filtro de resultados obsoletos. Para abortar I/O, use um mecanismo próprio de cancelamento.

## Origem

Reconhecimento de `src/cancelable/index.ts`, `index.js`, `index.d.ts` e `src/cancelable/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
