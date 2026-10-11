# import-html

Buscar HTML sem renderizá-lo.

`importHtml(url, config?)` aceita opções de `fetch` e retorna `Promise<{ response, html }>`.

```js
import { importHtml } from 'jails.stdlib/import-html'

const { response, html } = await importHtml('/fragment.html')
if (!response.ok) throw new Error(`HTTP ${response.status}`)
```

Não verifica `response.ok`, não insere DOM nem executa scripts. A promise contém um único objeto, não dois argumentos. `AbortSignal` pode ser passado em `config`. Para renderizar, defina a responsabilidade pelo DOM e a confiança no conteúdo; o módulo não sanitiza HTML.

## Origem

Reconhecimento de `src/import-html/index.ts`, `index.js`, `index.d.ts` e `src/import-html/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
