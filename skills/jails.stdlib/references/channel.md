# channel

Trocar eventos entre janelas ou iframes.

`Channel({ target = null, accept = [], origin = location.origin })` retorna `on(name, callback)`, `emit(event, ...payload)` e `remove(name)`. `target` pode ser uma Window ou iframe; o envio usa `target.contentWindow || target`.

```js
import { Channel } from 'jails.stdlib/channel'

const channel = Channel({
    target: document.querySelector('#remote-frame'),
    accept: ['https://remote.example'],
    origin: 'https://remote.example'
})
channel.on('ready', (data) => console.log(data))
channel.emit('configure', { theme: 'dark' })
```

`origin` é o destino de `postMessage`; `accept` lista origens de entrada. No iframe, use `target: window.parent` e a origem do pai. O formato é `{ event, payload: [...] }`; callback recebe os itens como argumentos. Há um callback por nome; novo `on` substitui o anterior. O método é `emit`, não `send`.

O listener global não verifica `e.source` nem valida o formato recebido. Origens não aceitas causam um objeto lançado pelo listener. Evite `accept: ['*']` em aplicações reais e valide payloads. `remove` exclui um handler, mas não remove o listener global; não há dispose. Crie instâncias duradouras em vez de recriá-las a cada mount.

## Origem

Reconhecimento de `src/channel/index.ts`, `index.js`, `index.d.ts` e `src/channel/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
