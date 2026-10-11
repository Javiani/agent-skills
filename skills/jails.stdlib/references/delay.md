# delay

Aguardar mantendo o valor de uma cadeia.

`delay(milliseconds = 100)` retorna `(data?) => Promise`, resolvendo com o mesmo dado após o intervalo.

```js
import { delay } from 'jails.stdlib/delay'

await delay(200)()
const value = await Promise.resolve({ ready: true }).then(delay(200))
```

É uma API curried: `await delay(200)` apenas aguarda uma função, não um timer. Não oferece cancelamento e não transforma rejeições em sucesso.

## Origem

Reconhecimento de `src/delay/index.ts`, `index.js`, `index.d.ts` e `src/delay/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
