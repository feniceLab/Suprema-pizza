---
cliente: Suprema Pizza
tipo: regra-de-skill
aplica-se: Reels (videos editados a partir dos TAKES)
data: 2026-05-31
status: em-validacao
---

# 🎬 Template de Reel — Suprema Pizza

> A ideia por trás da ideia: o Reel **não informa, provoca desejo**. Cada escolha visual responde a "isso aumenta a fome + sensação de marca premium, ou distrai disso?". Se distrai, sai.

## 🎬 PROCESSO OBRIGATÓRIO ANTES DE EDITAR (Dante)
**SEMPRE, antes de qualquer edição:**
1. **Ler o vídeo COMPLETO, frame a frame** — extrair frames ao longo do TAKE (ffmpeg, ~1 a cada 3-6s) e entender exatamente o que acontece em cada momento (massa, borda, molho, queijo, recheio, forno, fatia, cheese pull). Identificar o sabor real pela imagem.
   - **Ferramenta padrão:** ffmpeg extrai frames → eu (visão) descrevo. Rápido, grátis, preciso.
   - **Reforço opcional (vídeo longo/complexo):** MCP `hinggsfield` → `video_analysis_create` (upload ou youtube_url) + `video_analysis_status` = análise automática cena-a-cena (3-5 min, gasta créditos). Usar só quando o método ffmpeg não bastar.
2. **Gerar 3 IDEIAS de vídeo diferentes** para aquele Reel — cada uma com um CONTEXTO/ângulo próprio (ex: 1 processo artesanal, 1 desejo/food porn, 1 provocação/pergunta). Apresentar as 3 e o Dante decide qual usar.
3. Só então editar — sempre seguindo o padrão de FONTE e IDENTIDADE (DIN Condensed + Avenir, MAIÚSCULA, logo branca, narração no centro).
> Sem essa análise prévia, o vídeo fica GENÉRICO. A análise é o que garante que cada Reel seja único e comunique certo.

## 📋 STORYBOARD ANTES DE RENDERIZAR (método oficial — Dante)
NUNCA renderizar o vídeo direto. Fluxo:
1. Mapear o TAKE frame a frame e identificar o que cada cena mostra (atenção a CORES: cheddar=laranja, catupiry=branco, molho=vermelho).
2. Gerar um STORYBOARD = cada frame-chave (imagem real) com a legenda JÁ sobreposta + logo, como imagens estáticas (rápido, sem renderizar vídeo).
3. Dante confere o storyboard e aprova a fidelidade/ideia.
4. SÓ ENTÃO renderizar o vídeo final de uma vez.
> Economiza tempo/token e evita erro de narração. Storyboard salvo em /tmp durante a edição; montar contact sheet (grade) pra visão geral + frames individuais.

## ⛔ REGRAS DE OURO (aprendidas com o Dante — nunca violar)
0. **NÃO picar nem reordenar o TAKE.** O produtor já filma em sequência narrativa correta (massa → molho → queijo → recheio → forno → cheese pull). Usar o TAKE CONTÍNUO, na ordem original. Só suavizar pontas com fade e, se houver cortes naturais, transições sutis.
0.1. **NÃO encurtar o Reel.** Reel precisa do conteúdo COMPLETO pra pessoa entender a história. Não cortar pra ficar curto (mesmo que dê 30-50s).
0.2. **NARRAR SÓ O QUE APARECE NA TELA.** Antes de escrever qualquer legenda, EXTRAIR FRAMES e olhar o que a cena realmente mostra. Se é molho, escreve molho; se é camarão, escreve camarão. NUNCA inventar ação ("fatiada na sua frente" se isso não acontece). Texto e imagem têm que bater — senão destrói credibilidade.
0.3. **Cada Reel é único:** ideia/contexto/trilha próprios. Nunca repetir narrativa nem música entre Reels.
0.4. **Thumbnail:** extrair 1 frame do PRODUTO (cheese pull / fatia / pizza pronta), SEM texto sobreposto, salvar como capa do Reel.
0.5. **Identificar o sabor real pela imagem** antes de nomear (ex: take_02 = CAMARÃO, não calabresa).
0.6. **FLUXO DE TRABALHO (corrigido pelo Dante):**
   - A cada nova versão editada de um Reel/foto, **SALVAR/SOBRESCREVER o arquivo final na pasta do dia** (`Video editado/` ou `Fotos trabalhadas/`), SEMPRE com a ÚLTIMA versão. Assim o Dante abre a pasta e vê o material atual a qualquer momento. (Salvar versão compatível QuickTime: H.264 main, yuv420p, +faststart, 1 faixa de áudio.)
   - O **HTML de aprovação é do CLIENTE** e é montado/atualizado **só no FINAL**, quando todos os criativos da semana/mês estiverem prontos e conferidos. Não regenerar HTML a cada microajuste (economia de tempo/token).
0.7. **Narração = roteiro fiel à sequência real do TAKE.** Mapear o vídeo (contact sheet/frames) antes de escrever, e narrar cada etapa que aparece: massa → borda → molho → queijo/recheio → assando → fatia. CTA pode variar (link na bio OU "marca aquela pessoa que vai pedir uma dessas com você").

## Princípios fixos

1. **Narração em tela sincronizada com a ação** (tom MISTO: provoca → descreve → interage).
   - O texto descreve o que aparece NO momento em que aparece (vê o catupiry escorrer + lê "catupiry que estica" = desejo dobrado).
   - 3 a 4 frases curtas ao longo do vídeo, NÃO um texto fixo do início ao fim.
2. **Legenda em tela sutil**: fonte fina branca + sombra leve. SEM fundo/halo bege (aquilo é estilo de FOTO/story, não de Reel). Lowercase às vezes (mais editorial). Nunca compete com o vídeo.
3. **Legenda aparece e some com FADE** (fade in ~0.4s, segura 2-3s, fade out). Dá ritmo, fica "liso".
4. **Tela limpa nos PICOS** (cheese pull, corte, fatia erguida) — nesses momentos só comida, sem texto.
5. **Transições suaves nos cortes**: crossfade rápido (~0.4s) entre cenas. Abre e fecha o Reel com fade do/para o preto (moldura cinematográfica).
6. **Logo BRANCA** discreta no rodapé, leve transparência (~85%). Mais cinematográfica que a vermelha sobre fundo escuro; alinha com os stories da marca.
7. **Trilha** royalty-free (CC-BY / domínio público). REGRAS DE OURO:
   - Música **CONTÍNUA do início ao fim** — NUNCA usar `-stream_loop` em faixa curta (causa loop/picote). A trilha deve ser MAIS LONGA que o vídeo e cortada com fade out no fim.
   - **NUNCA repetir a mesma música em dois Reels.** Cada Reel = trilha própria. Manter biblioteca variada e registrar qual faixa foi usada em cada post.
8. **Tipografia**: MAIÚSCULA é o padrão de TODA legenda/narração. Minúscula só no kicker do card de abertura ou pra destacar 1 palavra-chave (o "ouro do sabor"). Fonte: DIN Condensed Bold (headline) + Avenir Next (kicker).
9. **Posição da narração**: no CENTRO vertical (altura dos olhos/produto) — não embaixo, pra não desviar o olhar do produto.
10. **CTA no FINAL**: card de fechamento destacando a chamada (ex: "PEÇA A SUA" + @ / WhatsApp). É o último frame antes do fade out.
11. **Formato**: 9:16 (1080x1920), ~12-15s.

## Biblioteca de trilhas (Kevin MacLeod, CC-BY — creditar quando exigido)
alegre_carefree · bossa_antigua · divertido_sneaky · funk_groove · suave_elevator. Rodízio: nunca duas iguais seguidas. Registrar a faixa usada no copy.md de cada post.

## Divisão de trabalho TELA vs POST
| Onde | Função | Tom |
|---|---|---|
| Texto NA TELA (queimado) | narrar/guiar olhar + provocar no momento | curto, sensorial, sincronizado |
| Legenda do POST (Instagram) | conversar, história, CTA + pergunta | mais longo, relacional (Kern) |

## Pipeline técnico (FFmpeg)
- Build do ffmpeg local NÃO tem `drawtext` (sem libfreetype) → gerar legendas como PNG via Pillow e sobrepor com overlay + enable='between(t,a,b)' e fade (alpha).
- Editar sempre copiando TAKES para /tmp (Drive é online-only e trava comandos pesados).
- Logo branca: gerar de logo.png pintando RGB de branco preservando alpha.

## A virar SKILL
Quando validado, este template vira a skill de edição de Reel da Fenice (reaplicável a qualquer cliente, com a identidade trocável). Ver [[fenice-skill-instagram-ideia]] (auditoria) — esta é a parte de PRODUÇÃO.
