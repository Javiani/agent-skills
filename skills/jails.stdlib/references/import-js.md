# import-js

Carregar um script clássico sob demanda.

`importJs(url, { async = true } = {})` cria um script no head e retorna uma promise de `load`/`error`.

```js
import { importJs } from 'jails.stdlib/import-js'

await importJs('/assets/gallery.js')
```

Não é `import()` de ESM, não retorna exports, não configura `type="module"`, não deduplica e não remove scripts. Para dependências em ordem, aguarde cada carregamento. O runtime aceita `async: false`, mas o tipo local declara apenas `async?: true`; resolva essa diferença no projeto antes de fornecer um exemplo TypeScript com `false`.

## Origem

Reconhecimento de `src/import-js/index.ts`, `index.js`, `index.d.ts` e `src/import-js/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
