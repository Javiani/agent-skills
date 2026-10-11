# lazyload-image

Carregar imagens próximas do viewport.

Exporta `Lazyload` (essa capitalização), alias do default de `vanilla-lazyload`, sem adaptação própria. Dependência declarada: `^19.1.3`; confira a versão instalada para opções adicionais.

```js
import { Lazyload } from 'jails.stdlib/lazyload-image'

const images = new Lazyload({ elements_selector: 'img[data-src]' })
// Após inserir imagens novas: images.update()
// Ao encerrar a instância: images.destroy()
```

```html
<img data-src="/images/product.webp" alt="Produto" width="640" height="480">
```

Crie a instância depois de o DOM relevante existir. `update` e `destroy` pertencem à dependência. Consulte seus tipos e README instalados para callbacks, containers, backgrounds e comportamento de limpeza. Não confunda `Lazyload` exportado com `LazyLoad` dos exemplos da dependência.

## Origem

Reconhecimento de `src/lazyload-image/index.ts`, `index.js`, `index.d.ts` e `src/lazyload-image/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
