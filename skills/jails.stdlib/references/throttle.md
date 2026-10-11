# throttle

Limitar frequência de scroll e outros eventos.

`throttle(fn, wait = 100)` retorna uma função que só executa quando passaram **mais** de `wait` ms desde a última execução. O relógio começa na criação do wrapper.

```js
import { throttle } from 'jails.stdlib/throttle'

const onScroll = throttle(() => console.log(window.scrollY), 100)
window.addEventListener('scroll', onScroll)
// Ao encerrar: window.removeEventListener('scroll', onScroll)
```

Chamadas no primeiro intervalo são descartadas. Não agenda execução final (trailing), não retorna resultados, não preserva `this` e não oferece `cancel`. Não é adequado quando o último evento precisa obrigatoriamente ser processado.

## Origem

Reconhecimento de `src/throttle/index.ts`, `index.js`, `index.d.ts` e `src/throttle/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
