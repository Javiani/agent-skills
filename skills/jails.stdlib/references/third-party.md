# third-party

Ativar um snippet de terceiro no momento escolhido.

`thirdParty(name)` procura `script[data-name=NAME]` e retorna `Promise<HTMLScriptElement>`.

```html
<script type="text/third-party" data-name="metrics" src="/assets/metrics.js">
    window.metricsReady = true;
</script>
```

```js
import { thirdParty } from 'jails.stdlib/third-party'

const metrics = thirdParty('metrics')
await metrics
```

O tipo inerte evita execução inicial. Com src, cria novo script assíncrono, aguarda load, executa texto inline via `new Function` e resolve com novo script. Sem src, executa texto via `eval` num timer e resolve com o original. A ordem real com src é biblioteca primeiro, inline depois, diferente da descrição do README.

Script ausente rejeita `{ error: 'ThirdPartyScriptError', message }`. Não há onerror para src nem captura de exceções no inline: a promise pode ficar pendente. Chamadas repetidas repetem carregamento/execução; cacheie a promise se precisar de execução única. Nome é interpolado em seletor sem aspas/escape: use identificadores simples. CSP pode bloquear script/eval/Function; escolha a integração compatível com a política do projeto. Não assume consentimento do usuário; ative no ponto autorizado pelo fluxo existente.

## Origem

Reconhecimento de `src/third-party/index.ts`, `index.js`, `index.d.ts` e `src/third-party/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
