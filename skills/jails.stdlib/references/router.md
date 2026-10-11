# router

Associar URLs a handlers.

Exporta `Router`, alias de Grapnel (dependência fixada em `0.6.4`), sem camada adicional.

```js
import { Router } from 'jails.stdlib/router'

const router = new Router({ pushState: true })
router.get('/products/:id', (request) => console.log(request.params.id))
router.navigate('/products/42')
```

Sem `pushState`, usa rotas hash. `get(path, ...middleware, callback)` registra handlers; middleware recebe `(request, event, next)` e deve chamar `next()` para continuar. `root` e `hashBang` são opções de Grapnel. Não renderiza componentes nem HTML automaticamente: conecte o handler ao mecanismo de renderização existente. Com pushState, o servidor precisa atender acesso direto às rotas. Consulte código/README da versão instalada para eventos e remoção; não invente um método `destroy`.

## Origem

Reconhecimento de `src/router/index.ts`, `index.js`, `index.d.ts` e `src/router/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
