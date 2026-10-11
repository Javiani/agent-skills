# debounce

Esperar uma pausa em eventos frequentes.

`debounce(fn, timeout = 250)` retorna uma função que reinicia o timer a cada chamada e executa `fn` com os últimos argumentos depois da pausa.

```js
import { debounce } from 'jails.stdlib/debounce'

const searchAfterPause = debounce((value) => console.log(value), 300)
input.addEventListener('input', (event) => searchAfterPause(event.target.value))
```

Use `input`, não `oninput`, em `addEventListener`. Passe o valor já capturado: ler o evento muito depois pode ler um DOM diferente. Não retorna o resultado de `fn`, não fornece `cancel`/`flush` e não preserva o `this` dinâmico. Remover o listener não cancela um timer já agendado; se isso importar no unmount, use uma implementação com cancelamento.

## Origem

Reconhecimento de `src/debounce/index.ts`, `index.js`, `index.d.ts` e `src/debounce/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
