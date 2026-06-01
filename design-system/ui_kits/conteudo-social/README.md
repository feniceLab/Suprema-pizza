# UI Kit · Conteúdo Social

Estúdio que recria as **peças sociais 9:16** da Suprema — o coração da operação da Fenice Lab. Quatro formatos, todos com a identidade aplicada (halo bege, logo branca, copy de duas linhas, narração cinematográfica).

## Arquivos
- `index.html` — estúdio interativo (React + Babel inline). Troque o sabor, edite a copy, alterne formatos.
- `pieces.jsx` — renderizadores de peça: `StoryPiece`, `ReelPiece`, `StopMotionPiece`, `FeedGrid`, mais `Halo` (a legenda bege) e `PieceLogo`.
- `studio.jsx` — shell com seletor de sabor, campos de copy (linha 1 Regular / linha 2 Bold) e abas de formato. Dados em `SABORES`.

## Os formatos
- **Story** — foto cheia + **halo bege** no topo (linha 1 Regular, linha 2 Bold) + logo branca no rodapé.
- **Reel** — moldura cinematográfica (barras pretas), narração branca MAIÚSCULA no centro, logo 85%.
- **Stop-Motion** — frames ciclando (0,42s/frame ≈ 4,8s) + halo fixo.
- **Feed** — grade 1:1 estilo Instagram, fotografia limpa (legenda vai no post).

## Regras embutidas
- Copy: 5–10 palavras/linha, linha 1 em "…", sem emoji/hashtag/preço na arte.
- Logo sempre **branca** sobre foto. Halo bege é **exclusivo** das peças sociais (nunca na UI escura).

## Fidelidade
O `Halo` reproduz o "halo dilatado de cantos orgânicos" das peças reais via `box-decoration-break`. As regras de copy, tipografia e timing vêm das Regras de Skill da Fenice (01–05 + Template de Reel).
