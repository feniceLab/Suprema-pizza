# UI Kit · Cardápio Digital

Recreação em alta fidelidade do **cardápio de delivery** da Suprema Pizza — tela escura, mobile-first, fluxo de pedido completo (navegar → escolher tamanho → sacola → fechar no WhatsApp).

## Arquivos
- `index.html` — app interativo (React + Babel inline). Abra para o fluxo completo.
- `components.jsx` — apresentacionais: `Wordmark`, `TopBar`, `DeliveryHero`, `CategoryChips`, `MenuRow`, ícones (traço fino estilo Lucide).
- `app.jsx` — telas com estado: lista do cardápio, `FlavorDetail` (seletor de tamanho), `BagSheet` (sacola). Dados em `MENU` e `TAMANHOS` (preços reais do `cardapio.json`).

## Como usar
Os componentes leem cores da paleta escura (`SUP`) e Poppins. Para montar outra tela, importe `components.jsx` e componha. As fotos vêm de `../../assets/photos/`.

## Fidelidade
Recreação cosmética baseada na identidade oficial (tema escuro + vermelho Suprema) e nos preços/sabores reais. A Suprema usa um cardápio hospedado (pedir.delivery); esta é uma versão de marca própria, não a integração real do PDV.
