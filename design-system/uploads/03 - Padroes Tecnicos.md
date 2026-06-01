---
cliente: Suprema Pizza
tipo: padroes-tecnicos
atualizado_em: 2026-05-29
---

# 03 — Padrões Técnicos

Specs técnicas obrigatórias dos stop motions da Suprema Pizza.

## Formato de saída

| Propriedade | Valor |
|-------------|-------|
| Resolução | **1080 × 1920** (9:16, vertical) |
| Frame rate | **30 fps** |
| Codec vídeo | H.264 (`libx264`) |
| CRF | **18** (alta qualidade visual) |
| Preset | `medium` |
| Codec áudio | AAC, **128 kbps** |
| Container | MP4 com `+faststart` |
| Duração padrão | **4.8 segundos** (ideal pra Instagram Stories) |

## Composição da peça

### Background

- Foto ou frames como fundo
- Sempre escalar + cortar para preencher 1080 × 1920:

```
scale=...:force_original_aspect_ratio=increase,crop=1080:1920
```

### Legenda (PNG)

- **Posição vertical:** `y = 160` (acima da Safe Zone do Instagram Stories)
- **Dimensões do PNG:** 1080 × 350
- **Animação:**
  - Fade-in de **0.6s** no início
  - Fade-out de **0.8s** nos últimos 0.8s da peça

### Logo (PNG branco)

- **Posição vertical:** `y = H - h - 100` (100 px do bottom)
- **Posição horizontal:** centralizado
- **Dimensões finais:** 320 × 192
- **Animação:**
  - Fade-in de **0.4s** no início
  - **Sem fade-out** — fica visível até o fim da peça

## Stop motion timing

| Propriedade | Valor |
|-------------|-------|
| Duração de cada frame | **0.4 segundos** |
| Loops por peça | **3 a 4** (dependendo do número de fotos no cluster) |
| Duração total | **4.8 segundos** |

Exemplo: cluster com 4 fotos × 0.4s × 3 loops = 4.8s.

## Música

### Fonte

- **Archive.org / freepd.com** (domínio público)
- Nunca usar música com direitos autorais

### Tratamento de áudio

| Propriedade | Valor |
|-------------|-------|
| Volume | **35%** do original (`volume=0.35`) |
| Fade-out | **0.5s antes do fim** (`afade=t=out:st=4.3:d=0.5`) |

### Mapeamento música × tipo de conteúdo

| Tipo de conteúdo | Música sugerida |
|------------------|-----------------|
| Sabor salgado clássico | Folk acústico (`Folk Song`) |
| Pasta de alho / italiana | Tarantella (`Village Tarantella`) |
| Bastidores / processo | Jazz chill (`Compy Jazz`) |
| Sabor rústico / forno | Country swing (`Hillbilly Swing`) |
| Branding institucional | Cinematic épico (`Adventure`) |
| Sobremesa | Piano calmo (`Calm Sketch for Piano`) |
| Doce clássico brasileiro | Bossa nova (`Sloppy Bossa Loop`) |

## Pipeline resumido (FFmpeg/ImageMagick)

### 1. Preparar logo branco (ImageMagick)

```bash
magick logo.png -trim +repage \
  -channel RGB -fill white -colorize 100 +channel \
  logo_white.png
```

### 2. Gerar PNG da legenda com halo (ImageMagick)

```bash
# Texto preto sobre transparente, depois halo bege dilatado
magick -size 1080x350 xc:none \
  -font Poppins-Regular -pointsize 56 -fill black \
  -annotate +X+Y "linha 1" \
  -font Poppins-Bold -pointsize 60 -fill black \
  -annotate +X+Y "linha 2" \
  \( +clone -alpha extract -morphology Dilate Disk:26 \
     -fill "#FFEBDC" -opaque white \) \
  +swap -compose over -composite \
  legenda.png
```

### 3. Compor stop motion (FFmpeg)

```bash
ffmpeg -framerate 2.5 -loop 1 -i frame_%02d.jpg \
       -loop 1 -i legenda.png \
       -loop 1 -i logo_white.png \
       -i musica.mp3 \
  -filter_complex "
    [0:v]scale=1080:1920:force_original_aspect_ratio=increase,
         crop=1080:1920,fps=30[bg];
    [1:v]format=rgba,fade=in:0:18,fade=out:120:24[cap];
    [2:v]format=rgba,scale=320:192,fade=in:0:12[lg];
    [bg][cap]overlay=0:160[v1];
    [v1][lg]overlay=(W-w)/2:H-h-100[v];
    [3:a]volume=0.35,afade=t=out:st=4.3:d=0.5[a]
  " \
  -map "[v]" -map "[a]" \
  -t 4.8 -r 30 \
  -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  output.mp4
```

## Checklist técnico antes de entregar

- [ ] Resolução 1080 × 1920?
- [ ] Duração exatamente 4.8s?
- [ ] Codec H.264 + CRF 18 + faststart?
- [ ] Áudio AAC 128 kbps em 35% de volume?
- [ ] Legenda em y=160 com fade-in 0.6s + fade-out 0.8s?
- [ ] Logo branco em y=H-h-100 com fade-in 0.4s?
- [ ] Halo da legenda em `#FFEBDC` com Dilate Disk:26?
- [ ] Música licenciada (domínio público) com fade-out 0.5s?

## Versionamento

- **2026-05-29** — Criação inicial. Specs validadas na sessão de produção dos 7 stop motions.
