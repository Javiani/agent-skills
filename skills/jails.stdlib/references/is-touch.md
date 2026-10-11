# is-touch

Consultar suporte básico a toque.

`isTouch()` retorna `'ontouchstart' in window`.

```js
import { isTouch } from 'jails.stdlib/is-touch'

const supportsTouch = isTouch()
```

É uma heurística de capacidade, não identifica celular nem exclui mouse/teclado em dispositivos híbridos. Não use para bloquear interações alternativas. Requer `window`.

## Origem

Reconhecimento de `src/is-touch/index.ts`, `index.js`, `index.d.ts` e `src/is-touch/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
