# outlet

Renderizar páginas remotas numa região e restaurar o conteúdo.

`Outlet({ target })` captura HTML inicial e clone do head, marcando scripts/links/styles atuais com `im-preserve`. Usa Idiomorph (`^0.7.2`).

```js
import { Outlet } from 'jails.stdlib/outlet'

const target = document.querySelector('[data-outlet]')
const outlet = Outlet({ target })
await outlet.render('https://remote.example/page')
await outlet.render() // Restaura head e conteúdo inicial.
```

`render(url?)` busca documento completo, move scripts/links/styles do body para o head remoto, faz morph do head e substitui HTML do target. Resolve com target após `allSettled` dos scripts adicionados; falha de script não implica rejeição e CSS não é aguardado. HTTP não é validado. URL precisa ser absoluta (`new URL(path)` sem base). Reescreve src/href que começam com `/` para origem remota, mas não normaliza todos os caminhos relativos nem recursos do body.

`renderJS(name, path)` coloca `<name>` no target e adiciona script `name="outlet-script"`; resolve com target em load e rejeita com string genérica em error. `renderJS()` restaura o conteúdo e remove o primeiro script marcado; lança se nenhum existir. Não acumule chamadas supondo deduplicação.

Não é uma integração isolada: altera o head global e executa scripts remotos, sem sanitização ou unmount próprio. Use conteúdo confiável, CORS adequado e ownership explícito do target (em Jails, região `html-static` quando apropriado). Carregamento do script não garante aplicação remota montada; estabeleça um sinal de readiness se necessário. Export correto: `Outlet`, não `Oultet`.

## Origem

Reconhecimento de `src/outlet/index.ts`, `index.js`, `index.d.ts` e `src/outlet/README.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
