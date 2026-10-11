# import-css

Carregar uma folha de estilos sob demanda.

`importCss(url, options = null)` cria `<link rel="stylesheet">` no head e retorna uma promise resolvida pelo evento `load` ou rejeitada por `error`. `options` existe no código, mas é ignorado.

```js
import { importCss } from 'jails.stdlib/import-css'

await importCss('/assets/gallery.css')
```

Não retorna o link diretamente, não deduplica, não remove recursos e não oferece timeout. Cacheie a promise no serviço consumidor se o recurso só deve ser carregado uma vez. Precisa de `document`.

## Origem

Reconhecimento de `src/import-css/index.ts`, `index.js`, `index.d.ts` e `src/import-css/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
