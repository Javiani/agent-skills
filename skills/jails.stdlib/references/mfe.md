# mfe

Incorporar aplicações remotas e compartilhar o shell.

`mfe({ timeout = 5000 } = {})` retorna `render(target, uri)` e `renderJS({ target, tag, src })`.

```js
import { mfe, Shell } from 'jails.stdlib/mfe'

const shell = Shell({ apiBase: '/api' })
const microfrontend = mfe()
const target = document.querySelector('[data-mfe]')
await microfrontend.renderJS({ target, tag: 'remote-app', src: '/remote-app.js' })
```

`renderJS` substitui o target pelo custom element e carrega script assíncrono no head. Resolve com target em load; rejeita objeto `{ type: 'error', message }` em erro de carregamento. Não confirma que o app terminou de montar.

`render(target, uri)` busca HTML completo, injeta CSS/styles no head, escreve body no target e executa scripts sequencialmente. URI precisa ser absoluta; CSS e scripts externos são resolvidos contra ela, mas URLs de imagens/body e URLs dentro de CSS inline não são normalizadas. Precisa de CORS para fetch remoto. Não verifica status HTTP nem isola/sanitiza conteúdo.

Diferenças críticas do README: `timeout` não é usado; o primeiro render resolve sem target depois de um timer fixo de 1000 ms. Erros de CSS são absorvidos por `allSettled`; erros na sequência de scripts podem deixar a promise externa pendente. Cache guarda filas de targets, não um documento pronto: chamadas da mesma URI apenas enfileiram o target e retornam sem readiness; chamadas após o primeiro carregamento não renderizam imediatamente. Falhas não limpam esse cache. Não prometa timeout, retries ou cache funcional. Se precisar dessas garantias, implemente-as fora ou escolha outra solução.

`Shell(config = {})` guarda configuração em `window.___Shell___`; chamadas posteriores criam novo objeto combinando configuração nova com anterior, com valores anteriores tendo prioridade. `Shell()` lê a configuração atual, mas não é um canal de eventos nem objeto reativo; referências anteriores podem ficar desatualizadas. Funciona no mesmo window, não atravessa iframe.

Recursos injetados não são removidos automaticamente. Reserve DOM da aplicação remota, por exemplo com `html-static` em Jails, e defina teardown do app externo separadamente.

## Origem

Reconhecimento de `src/mfe/index.ts`, `index.js`, `index.d.ts` e `src/mfe/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
