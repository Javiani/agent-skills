# is-visible

Aguardar a primeira interseção de um elemento.

`isVisible(target, { root = null, rootMargin = '0px', threshold = 0 } = {})` retorna uma promise resolvida com o array de entradas quando uma entrada tem `isIntersecting`. Depois deixa de observar o alvo.

```js
import { isVisible } from 'jails.stdlib/is-visible'

const target = document.querySelector('[data-chart]')
if (target) {
    await isVisible(target, { rootMargin: '200px' })
    // Inicializar o conteúdo próximo ao viewport.
}
```

É uma espera única, não uma assinatura contínua nem teste de visibilidade por CSS. Não oferece desconexão/cancelamento ao consumidor; pode ficar pendente se o alvo nunca intersectar. `threshold` está tipado como número, não array. Para lifecycle com interrupção ou acompanhamento contínuo, use `IntersectionObserver` diretamente.

## Origem

Reconhecimento de `src/is-visible/index.ts`, `index.js`, `index.d.ts` e `src/is-visible/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
