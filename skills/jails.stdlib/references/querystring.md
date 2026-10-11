# querystring

Ler parâmetros da URL atual.

`querystring()` retorna um objeto de strings a partir de `location.search` usando `URLSearchParams`.

```js
import { querystring } from 'jails.stdlib/querystring'

const { search = '', page = '1' } = querystring()
```

Não aceita nome de parâmetro; a assinatura no README está desatualizada. Chaves repetidas conservam o último valor; números e booleanos continuam strings. Usa a query da página, não a query de uma rota hash. Para valores repetidos ou URLs arbitrárias, use `URLSearchParams` diretamente.

## Origem

Reconhecimento de `src/querystring/index.ts`, `index.js`, `index.d.ts` e `src/querystring/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
