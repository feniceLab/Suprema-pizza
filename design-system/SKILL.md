---
name: suprema-design
description: Use this skill to generate well-branded interfaces and assets for Suprema Pizza (pizzaria/delivery em Blumenau/SC, atendida pela Fenice Lab), seja para produção ou para protótipos/mocks/criativos descartáveis. Contém as diretrizes essenciais de design, cores, tipografia, fontes, assets e componentes de UI kit para prototipagem.
user-invocable: true
---

# Suprema Pizza — Design Skill

Read the `README.md` file within this skill first, and explore the other available files.

If creating visual artifacts (slides, mocks, peças sociais, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, copy the assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Atalhos essenciais (não violar)
- **Tema = ESCURO.** Fundo carvão `#0F0F0F`, vermelho Suprema `#D62828`, branco, Poppins. O bege `#FFEBDC` é **exclusivo** do halo de legenda das peças sociais — nunca na UI.
- **Logo:** vermelha sobre claro · **branca** sobre escuro/foto (sempre branca nas peças sociais).
- **Copy social:** duas linhas — linha 1 gancho (Regular, termina em "…"), linha 2 punchline (Bold, ponto final). 5–10 palavras/linha. Sem emoji, hashtag, preço ou CTA agressivo na arte. Tom conversacional, apela ao desejo.
- **Peças sociais:** 9:16, foto do produto em cheio, halo bege orgânico (nunca caixa retangular), logo branca no rodapé. Fades como vocabulário de animação.

## O que tem aqui
- `README.md` — contexto da marca, content fundamentals, visual foundations, iconografia, índice.
- `colors_and_type.css` — variáveis de cor + tipografia + classe `.sup-halo`. Importe e use.
- `assets/` — logos (vermelho/branco/original) + `photos/` (fotografia real de produto).
- `preview/` — cards do design system (referência rápida de cor, tipo, componentes).
- `ui_kits/conteudo-social/` — renderizadores das peças 9:16 (Story, Reel, Stop-Motion, Feed) + halo.
- `ui_kits/cardapio-digital/` — menu de delivery escuro com fluxo de pedido.
- `slides/` — deck 16:9 de apresentação de marca.

Fontes de origem (explore para aprofundar): `Suprema Pizza/` (codebase), [feniceLab/Suprema-pizza](https://github.com/feniceLab/Suprema-pizza).
