# storage

Persistir dados JSON localmente ou por sessão.

`storage.local` e `storage.session` expõem `set(name, data)`, `get(name)` e `remove(name)`. `set` serializa JSON e retorna o dado original; `remove` retorna o valor lido antes da exclusão.

```js
import { storage } from 'jails.stdlib/storage'

storage.local.set('preferences', { theme: 'dark' })
const preferences = storage.local.get('preferences')
const removed = storage.session.remove('draft')
```

Chave ausente retorna `null`. JSON inválido retorna `null` em `local.get`, mas a string original em `session.get`. Escrita, acesso ao storage e serialização podem lançar erros. Não há expiração, criptografia ou sincronização com componentes. Não desestruture `remove`: ele usa `this.get`. Usa os globais do navegador; não acesse em SSR.

## Origem

Reconhecimento de `src/storage/index.ts`, `index.js`, `index.d.ts` e `src/storage/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
