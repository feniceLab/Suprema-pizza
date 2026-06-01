# 🍕 Suprema Pizza — Design System

Sistema de design da **Suprema Pizza** (pizzaria + delivery, Blumenau/SC), mantido pela **Fenice Lab**. Reúne as fundações visuais (cor, tipografia, espaçamento), os assets reais da marca (logo, fotografia), o sistema de legendas das peças sociais e UI kits prontos para montar criativos, cardápios e apresentações com fidelidade à identidade.

> **Tagline oficial:** *"Quando o queijo escorre, a pizza tá no ponto."*

---

## Contexto da marca

| | |
|---|---|
| **Nome** | Suprema Pizza |
| **Segmento** | Pizzaria artesanal · delivery |
| **Cidade** | Blumenau, Santa Catarina |
| **Endereço** | Rua General Osório, 3012 — Velha, Blumenau/SC |
| **Cardápio digital** | pedir.delivery/app/asupremapizza |
| **Agência** | Fenice Lab |
| **Operação** | Marketing de conteúdo: Stories, Reels, stop motions, anúncios pagos |

A Suprema é uma pizzaria de bairro com pegada **artesanal e acolhedora**, posicionada pelo **desejo** (food porn, queijo escorrendo, massa fresca) — nunca pelo preço. O grosso da operação é **conteúdo social vertical** (9:16) para Instagram: Stories diários, Reels editados e stop motions de produto.

### Os dois contextos de design

Esta marca vive em **dois territórios visuais** que se complementam:

1. **UI escura (digital / institucional)** — painéis, cardápio digital, apresentações. Fundo carvão `#0F0F0F`, vermelho Suprema `#D62828`, branco, Poppins. É o que este design system usa por padrão.
2. **Peça social (criativo sobre foto)** — Stories e stop motions. Fundo = **foto do produto** em cheio, **halo bege** `#FFEBDC` atrás do texto (cor de massa assada), logo **branca** no rodapé. O bege aparece *somente* aqui, nunca na UI.

> ⚠️ **Não confundir com o Arena Gourmet** (outro cliente da Fenice). O creme/bege que aparece no `tokens.json` antigo era do Arena. A Suprema é **escura**: preto/grafite + vermelho + branco.

---

## Fontes / materiais de origem

Tudo abaixo foi usado para montar este sistema. O leitor talvez não tenha acesso — guardado aqui como referência.

- **Codebase (pasta local):** `Suprema Pizza/` — Painel da Marca (`index.html`, `tokens.json`, `cardapio.json`), Regras de Skill (01–05), Template de Reel, Materiais (logos, ~130 fotos de produto, takes, stop motions), Stories recorrentes.
- **Repositório GitHub:** [feniceLab/Suprema-pizza](https://github.com/feniceLab/Suprema-pizza) — explore para aprofundar em assets e estrutura da operação.
- **Painel da Marca oficial:** `suprema.fenicelab.com.br` (tokens.json + index.html — design system do cliente).
- **Regras de skill (Fenice Lab):** `01 - Identidade Visual`, `02 - Tom de Copy`, `03 - Padrões Técnicos`, `04 - Padrões de Conteúdo`, `05 - Como a Skill Consulta`, `Design System Oficial`, `Template de Reel`.

---

## 🅰️ CONTENT FUNDAMENTALS — como a copy é escrita

A copy da Suprema tem um **formato assinatura** rígido e um tom inconfundível.

### Formato obrigatório: duas linhas
Toda peça social usa **duas linhas curtas** (5–10 palavras cada):

| Linha | Função | Peso | Exemplo |
|---|---|---|---|
| **Linha 1** | Gancho / contexto conversacional | Poppins **Regular** | "Quando o queijo escorre…" |
| **Linha 2** | Revelação / punchline | Poppins **Bold** | **"a pizza tá no ponto."** |

A linha 1 quase sempre termina em **reticências (…)** para criar suspense. A linha 2 **fecha a ideia** com ponto final — é onde o leitor "sorri" ou "sente fome".

### Tom de voz
- **Conversacional e brincalhão** — fala com o cliente como um amigo, não como anúncio.
- **Apela ao desejo, nunca ao preço.** Sem "promoção", "imperdível", "compre agora".
- **Pontuação dramática:** uso recorrente de "…" para suspense.
- **Português do Brasil, informal** — "tá", "a gente", "do jeito que".
- **Pronome:** fala direto com "você" (implícito), tom de quem convida.
- **Sem emoji na legenda visual.** O logo já carrega o branding. (Emojis aparecem só na navegação do painel interno, ex: 📸 Galeria.)
- **No máximo 1 exclamação por peça**, e raramente.

### Exemplos aprovados
> "Quando o queijo escorre… **a pizza tá no ponto.**"
> "Cebola caramelizada e **pasta de alho premium.**"
> "Não é qualquer pizza. **É A Suprema.**"
> "Massa fresca, do jeito que **a gente faz há anos.**"

### Copy orgânica de feed (referência de tom)
> "Dieta começa amanhã… hoje tem pizza." · "Não é fome… é vontade de pizza mesmo." · "Se for pra exagerar, que seja na pizza."

### O que evitar
- CAPS LOCK gritando ("PROMOÇÃO!!!"), preços na legenda do stop motion, tecnicismo de cozinha, frases longas com vírgulas demais, hashtags na arte.

### Diferença TELA vs POST (Reels)
- **Texto na tela (queimado):** curto, sensorial, sincronizado com a ação ("catupiry que estica"). MAIÚSCULA, fonte fina branca.
- **Legenda do post:** mais longa, relacional, com CTA + pergunta ("marca quem vai pedir uma dessas com você").

---

## 🎨 VISUAL FOUNDATIONS

### Cor
- **Tema escuro** é a regra. Fundo **carvão `#0F0F0F`**, cards **grafite `#161616`**, superfícies elevadas `#1F1F1F`.
- **Vermelho Suprema `#D62828`** é a única cor de marca: wordmark "SUPREMA", CTAs, destaques, preços, linhas-assinatura. Usado com parcimônia — pontual, nunca em grandes blocos.
- **Branco** para texto principal; **cinza `#9A9A9A`** para secundário.
- **Bege `#FFEBDC`** (cor de massa assada) é exclusivo do **halo de legenda** das peças sociais. Não entra na UI escura.
- Sem gradientes chamativos. No máximo um *vignette* radial sutil (`radial-gradient(circle, #1f1a16, #0d0b09)`) em mockups de produto.

### Tipografia
- **Poppins** para tudo (display + corpo) — pesos 300 a 800.
- Títulos: Poppins **800 caixa-alta**, alinhados ao peso do wordmark "SUPREMA".
- "PIZZA" do logo: peso **300** com `letter-spacing` alto (~.42em) — o contraste fino/pesado é a assinatura tipográfica.
- Legenda social: linha 1 **Regular**, linha 2 **Bold** (ver Content Fundamentals).

### Logo
- Pinhões/rolinhos de massa **cruzados (✕)** no topo, entre **duas linhas horizontais**; "SUPREMA" bold; "PIZZA" fino espaçado; linha inferior.
- **Versão vermelha** sobre fundo claro · **versão branca** sobre fundo escuro ou foto. Nas peças sociais a logo é **sempre branca**, no rodapé centralizado, ~85% de opacidade.
- Proporção em vídeo: 320×192, `y = altura − altura_logo − 100px`.

### Fotografia
- **Real, quente, apetitosa.** Pizza em primeiro plano, queijo escorrendo / cheese pull, massa de borda alta e dourada. Fundos de cozinha, mármore, tábua de madeira ou superfície vermelha da marca.
- Luz **quente e direcional**, sombras presentes (não estourada). Caixas kraft da Suprema aparecem como prop recorrente.
- Stories usam a foto **em cheio** (sem cor sólida de fundo).

### Fundos
- UI: carvão sólido. Não há padrões repetidos nem texturas pesadas.
- Mockups de produto/embalagem: vignette radial escuro.
- Peça social: **foto full-bleed** 9:16, abre e fecha em **fade do/para o preto** (moldura cinematográfica nos Reels).

### Animação
- **Fades** são o vocabulário central. Legenda: fade-in ~0.4–0.6s, segura 2–3s, fade-out ~0.8s.
- Transições entre cenas de Reel: **crossfade rápido ~0.4s**.
- Stop motion: cada frame 0.4s, 3–4 loops, ~4.8s total.
- Na UI: transições curtas (`.18s`) com easing `cubic-bezier(.2,.7,.3,1)`. Sem bounce.

### Estados (hover / press)
- **Hover** em botão primário: escurece para `#B71C1C`. Hover em superfície: clareia 1 passo (`#1F1F1F`→`#2A2A2A`).
- **Hover** em card de galeria: `scale(1.02)` + borda vermelha.
- **Press / foco:** borda/halo vermelho (`--sup-glow`).
- Links e ícones: transição de cor cinza→branco ou cinza→vermelho.

### Bordas, raios e sombras
- Linhas finas translúcidas: `rgba(255,255,255,.08)`; linha-assinatura vermelha sólida 1–2px sob headers.
- Raios: botões/inputs `10px`, cards `16px`, pills `999px`, cartões de visita `7px`.
- Sombras escuras e difusas: cards `0 8px 24px rgba(0,0,0,.45)`, elevados `0 18px 48px rgba(0,0,0,.6)`. Glow vermelho só em foco/destaque.

### Transparência & blur
- Usados com moderação: overlays de lightbox (`rgba(0,0,0,.93)`), barras flutuantes translúcidas. Sem glassmorphism exagerado.

### Layout
- Headers sticky com linha vermelha inferior. Grids de foto `auto-fill minmax(200px,1fr)`. Vídeos verticais em grid `minmax(210px,1fr)`.
- Densidade média-alta no painel; respiro generoso nas peças sociais (texto no topo, logo no rodapé, produto no centro).

---

## 🔣 ICONOGRAPHY

A Suprema **não possui uma biblioteca própria de ícones**. A abordagem é minimalista:

- **A própria marca é o "ícone":** os **rolinhos cruzados (✕)** e as **linhas horizontais** do logo funcionam como grafismo/selo recorrente (assinatura em cartões, rodapés, embalagens).
- **Emojis** aparecem **somente na navegação do painel interno** da Fenice (ex: `📸 Galeria`, `📖 Catálogo`, `✏️ Organizar`, `💾 Salvar`) — **nunca** nas peças sociais ou na arte voltada ao cliente final.
- **Ícones de UI** (telefone, WhatsApp, localização, seta) quando necessários: usar um set de **traço fino e consistente**. Como não há set próprio no material, este sistema adota **[Lucide](https://lucide.dev)** via CDN (traço fino arredondado, combina com a leveza da Poppins). **→ Substituição sinalizada:** Lucide é uma escolha do design system, não um asset original da marca. Trocar caso a Suprema padronize outro set.
- **Sem QR/selos decorativos** nas peças sociais; eles existem só em papelaria (cartão de visita, avaliação Google) no painel interno.

Assets de marca disponíveis em `assets/`:
- `logo-suprema-vermelho.png` — logo oficial (vermelho, fundo transparente, 1920×1080)
- `logo-suprema-branco.png` — versão branca para fundo escuro / fotos (gerada a partir do oficial)
- `logo-suprema-original.png` — cópia do arquivo-mestre
- `photos/` — fotografia real de produto (pizzas salgadas, doces, combos, ambiente) + capas de Stories com a identidade aplicada

---

## 🗂️ Índice / manifesto do projeto

**Raiz**
- `README.md` — este arquivo (contexto, fundamentos, foundations, iconografia, índice)
- `colors_and_type.css` — variáveis CSS de cor + tipografia (base e semânticas) + classe `.sup-halo`
- `SKILL.md` — instruções para usar este sistema como Agent Skill

**Assets** — `assets/`
- logos (vermelho / branco / original) · `photos/` (fotografia de produto + capas de Story)

**Preview** — `preview/` — cards do Design System (cor, tipo, espaçamento, componentes, marca)

**UI Kits** — `ui_kits/`
- `conteudo-social/` — kit de criativos sociais: Story com halo, stop-motion frame, formato de Reel, grade de feed
- `cardapio-digital/` — kit do cardápio/menu de delivery (tela escura, cards de sabor, sacola)

**Apresentação (cliente)** — `apresentacao/`
- `index.html` — capa / hub que reúne os três capítulos · `brand-book.html` · `design-system.html` · `grafismos.html`
- `present.css` / `present.js` — sistema visual dark-native compartilhado (versão limpa e melhorada das páginas do Painel da Marca)

**Brand Book completo (web)** — `brandbook/index.html`
- Manual de marca de rolagem contínua com 16 capítulos (manifesto, estratégia, público, logo, símbolo, grafismos, assinatura, integridade, tamanhos, cor, tipografia, usos, fotografia, layouts, marca em ação, materiais de venda). Estrutura inspirada no brand book da Batatelle, na identidade Suprema.

**Slides** — `slides/` — formatos de apresentação/criativo derivados do Template de Reel e dos Stories

---

*Mantido por Fenice Lab · 2026. Atualize o frontmatter e o versionamento ao editar regras.*
