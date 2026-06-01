---
cliente: Suprema Pizza
tipo: identidade-visual
atualizado_em: 2026-05-29
---

# 01 — Identidade Visual

Toda a identidade visual descoberta/confirmada na sessão de 2026-05-29 (entrega dos 7 stop motions).

## Cores

| Elemento | Cor | Hex | Observação |
|----------|-----|-----|------------|
| Fundo da caixinha de legenda | Bege quente (cor de massa de pizza assada) | `#FFEBDC` | Confirmada via pixel sampling em referências |
| Texto na caixinha de legenda | Preto | `#000000` | Contraste máximo sobre o bege |
| Logo nas peças (stop motions) | Branco | `#FFFFFF` | Convertido do vermelho oficial para garantir leitura sobre qualquer foto |
| Background dos Stories | Variado | — | Foto do produto direto (sem cor sólida de fundo) |

> **Importante:** o vermelho da logo original NÃO é usado nas peças. Em stop motions a logo entra sempre em branco.

## Fonte oficial

- **Família:** Poppins (Google Fonts)
- **Download:** https://github.com/google/fonts/raw/main/ofl/poppins/
- **Pesos usados:**
  - **Regular** → linha 1 da legenda (gancho)
  - **Bold** → linha 2 da legenda (revelação/punchline)
- **Tamanhos** (em PNG de legenda 1080×350):
  - Linha 1 (Regular): **56 pt**
  - Linha 2 (Bold): **60 pt**

## Efeito halo na legenda

A "caixinha bege" que aparece atrás do texto **NÃO é uma caixa retangular**. Tecnicamente é um **halo dilatado** ao redor do texto, que gera contornos arredondados orgânicos.

### Aspecto visual

- Parece uma "caixinha bege orgânica" colada no texto
- Palavras vizinhas se fundem (o halo de uma encosta no halo da outra)
- Contornos arredondados, sem cantos retos

### Técnica (ImageMagick)

```bash
-morphology Dilate Disk:26
```

- **Cor do halo:** `#FFEBDC` (mesma cor do "fundo")
- **Raio do disco:** 26 px
- Aplicado sobre o canal alpha do texto antes de compor a peça final

> **REGRA CRÍTICA:** nunca usar caixa retangular sólida com fundo bege. Sempre halo dilatado. Esse é o detalhe que diferencia a identidade Suprema do template genérico.

## Logo

### Arquivo original

- **Caminho:** `Clientes/Suprema Pizza/Materiais/Logo/logo.png`
- **Dimensões:** 1920 × 1080
- **Cor:** Vermelho com fundo transparente

### Elementos visuais do logo

- Rolinhos de massa cruzados ("×") no topo
- "SUPREMA" em bold caps
- Linha decorativa horizontal
- "PIZZA" abaixo
- Linha decorativa inferior

### Versão para stop motions (branco)

Converter para branco antes de usar:

```bash
magick logo.png -trim +repage -channel RGB -fill white -colorize 100 +channel logo_white.png
```

### Especificações em vídeo

| Propriedade | Valor |
|-------------|-------|
| Tamanho final | 320 × 192 (escala proporcional) |
| Posição horizontal | Centralizado |
| Posição vertical | `y = H - h - 100` (100 px do bottom) |
| Cor | Branco `#FFFFFF` |

## Versionamento

- **2026-05-29** — Criação inicial. Identidade confirmada via sessão de produção dos 7 stop motions.
