# Avaliação 01 — criação com React e Vite

## Escopo autorizado
Dados fictícios, preferência de visibilidade persistida localmente e demais ações demonstrativas, sem integração bancária real. Framework: React com Vite.

## Arquitetura aplicada
- Um domínio extrato, composto pelo seu index.
- Seis Components estruturais: header, saldo, menu, cartoes, lancamentos e footer, cada um com pasta e index.
- Uma Store independente de React, com actions separadas e notificações contendo ação e estado completo.
- Actions assíncronas e fila para que cliques concorrentes operem sobre o último estado.
- Services de dados demonstrativos e de preferência. localStorage aparece apenas no Service de preferências.
- Entities puras para adaptação do extrato, valores monetários e lançamentos.
- Hook auxiliar em hooks para ligar React à Store. É uma abstração auxiliar com dependência de UI, sem introduzir React nas camadas internas.
- Sem shared: não há segundo domínio nem reuso entre domínios que justifique criá-lo.

## Evidência
- Build de produção passou.
- Três testes Node passaram: transformação sem mutação das entradas; ciclo de Store, estado completo, persistência/restauração, fila, remoção de inscrição e falha de armazenamento; verificações básicas de fronteira de integrações e dependência de React.
- Navegador: ocultação refletida em Saldo, Cartões e lançamentos; preferência preservada após recarregar; exibição restaurada; ação Pix abre e fecha demonstração.
- Inspeção visual no viewport móvel disponível. Layout desktop implementado por media queries, ainda sem inspeção visual em viewport desktop nesta avaliação.

## Limites
Os testes de imports são verificações básicas, não um analisador completo de dependências. Não há backend real. Dados demonstrativos ficam no Service de dados, sem requisição remota. Não foi medida fidelidade visual por comparação de pixels nem porcentagem de assertividade da skill.

## Resultado para a skill
A implementação foi possível sem acrescentar novas regras arquiteturais. O caso mostrou uma aplicação de abstração auxiliar para conectar UI e Store, já permitida pela especificação. A própria autoria da skill e sua aplicação pelo mesmo agente limitam a independência desta avaliação.

Próximas avaliações úteis: migração de uma aplicação existente e múltiplos domínios com actions compartilhadas. Não constituem escopo pendente desta aplicação demonstrativa.
