---
name: jails.stdlib
description: Criar e adaptar soluções JavaScript e Jails com os módulos de jails.stdlib, incluindo estado compartilhado, formulários, rotas, carregamento de recursos, aplicações remotas e utilitários de eventos. Use ao consumir jails.stdlib ou escolher um módulo da biblioteca para resolver um problema em um projeto.
---

# jails.stdlib

Use os módulos existentes para resolver o problema do projeto sem reimplementar capacidades já disponíveis. A biblioteca também contém utilitários independentes de Jails; apenas `form-validation` exige o contrato de componente Jails.

## Como trabalhar

1. Confira a dependência e a versão instalada, imports próximos, ambiente e arquitetura do projeto. Este reconhecimento corresponde ao repositório `jails.stdlib` 2.2.3; os contratos de dependências podem mudar.
2. Escolha o módulo pela tabela e leia apenas sua referência. Cada referência descreve imports, API, exemplo, limitações e diferenças entre README e implementação.
3. Importe pelo subpath público: `import { debounce } from 'jails.stdlib/debounce'`. Não existe export raiz agregado no package.json; não importe caminhos internos `src` ou arquivos UMD de um projeto com bundler.
4. Integre com o lifecycle e ownership de estado/DOM existentes. Em componentes Jails, conecte explicitamente stores a `state.set`, remova subscriptions no unmount e reserve DOM gerido por apps externos conforme as convenções do projeto. Preserve as convenções da skill Jails quando disponível, sem exigir sua instalação para utilitários independentes.
5. Verifique o comportamento afetado no projeto: sucesso, erro e descarte de recursos quando aplicável. Documente limites que afetem o caso de uso; não atribua capacidades inexistentes ao módulo.

Se o pacote ainda não estiver instalado e sua adoção fizer parte do pedido, use o gerenciador e lockfile do projeto para adicionar `jails.stdlib`. Não altere versões ou arquitetura sem necessidade.

## Escolher o módulo

| Problema | Subpath | Referência |
| --- | --- | --- |
| Ignorar resultados assíncronos obsoletos | `cancelable` | [cancelable](references/cancelable.md) |
| Esperar uma pausa em eventos frequentes | `debounce` | [debounce](references/debounce.md) |
| Aguardar mantendo o valor de uma cadeia | `delay` | [delay](references/delay.md) |
| Limitar frequência de scroll e outros eventos | `throttle` | [throttle](references/throttle.md) |
| Ler parâmetros da URL atual | `querystring` | [querystring](references/querystring.md) |
| Persistir dados JSON localmente ou por sessão | `storage` | [storage](references/storage.md) |
| Buscar HTML sem renderizá-lo | `import-html` | [import-html](references/import-html.md) |
| Carregar uma folha de estilos sob demanda | `import-css` | [import-css](references/import-css.md) |
| Carregar um script clássico sob demanda | `import-js` | [import-js](references/import-js.md) |
| Consultar suporte básico a toque | `is-touch` | [is-touch](references/is-touch.md) |
| Aguardar a primeira interseção de um elemento | `is-visible` | [is-visible](references/is-visible.md) |
| Carregar imagens próximas do viewport | `lazyload-image` | [lazyload-image](references/lazyload-image.md) |
| Associar URLs a handlers | `router` | [router](references/router.md) |
| Trocar eventos entre janelas ou iframes | `channel` | [channel](references/channel.md) |
| Compartilhar estado e transições nomeadas | `store` | [store](references/store.md) |
| Validar e mascarar formulários em Jails | `form-validation` | [form-validation](references/form-validation.md) |
| Renderizar páginas remotas numa região e restaurar o conteúdo | `outlet` | [outlet](references/outlet.md) |
| Incorporar aplicações remotas e compartilhar o shell | `mfe` | [mfe](references/mfe.md) |
| Ativar um snippet de terceiro no momento escolhido | `third-party` | [third-party](references/third-party.md) |

## Contratos essenciais

- A maior parte dos módulos usa APIs de navegador. Não execute acesso a window/document/location/storage no servidor; inicialize na fase de navegador do projeto. `delay`, `debounce`, `throttle` e `cancelable` não exigem DOM; `Store` é agnóstico de framework.
- Fonte e JavaScript realmente importado prevalecem sobre exemplos conflitantes dos READMEs. Inspecione o artefato instalado quando houver divergência; alguns módulos distribuídos incorporam dependências no bundle.
- Imports são nomeados, exceto o controller default de `form-validation`, que deve ser consumido com seus demais exports via namespace para registro.
- Não assuma cancelamento, deduplicação, retries, timeout, cleanup, validação HTTP ou montagem automática quando a referência não os oferece.
- Prefira um módulo quando seu contrato atende ao problema. Se um limite impede a solução, use uma API nativa ou adaptação pequena com responsabilidade explícita; não force a biblioteca a cumprir uma garantia que não implementa.

## Combinações úteis

- Busca ao digitar: `debounce` captura a pausa; `cancelable` filtra resultados obsoletos. São controles diferentes: debounce não evita uma requisição antiga sobrescrever resultados por si só.
- Estado compartilhado persistente: `Store` controla transições; `storage` guarda apenas o snapshot necessário. Restaure antes da criação e decida quais actions persistir.
- Navegação com páginas remotas: `Router` decide a rota; `Outlet` renderiza o conteúdo. Avalie efeitos no head, assets e readiness antes de conectá-los.
- Componente pesado próximo ao viewport: `isVisible` espera a primeira interseção; `importCss`/`importJs` carregam recursos. Para imagens, prefira `Lazyload`.

## Proveniência e manutenção

As 19 referências foram construídas a partir do código TypeScript, JavaScript distribuído, declarações e README de cada pasta `src`. Aliases foram confrontados com as dependências instaladas: Grapnel 0.6.4, Oni 1.0.9 e tipos de vanilla-lazyload. Os caminhos de origem são relativos ao repositório da biblioteca; a skill é autocontida e não depende de um caminho absoluto local. Ao atualizar a biblioteca, revise referências e diferenças documentadas em vez de tratar este reconhecimento como garantia de qualquer versão futura.
