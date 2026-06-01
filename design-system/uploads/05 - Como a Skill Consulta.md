---
cliente: Suprema Pizza
tipo: meta-instrucoes-para-ia
atualizado_em: 2026-05-29
---

# 05 — Como a Skill Consulta Essas Regras

Este arquivo é **meta**: explica como a IA (skill `stop-motion-creator` e futuras skills) deve usar os outros arquivos desta pasta.

## Fluxo obrigatório antes de gerar conteúdo

Antes de gerar qualquer stop motion ou conteúdo para a Suprema Pizza, a IA **DEVE**:

1. **Ler `01 - Identidade Visual.md`**
   - Extrair: cor do halo (`#FFEBDC`), fonte (Poppins Regular/Bold), espessura do halo (`Disk:26`), posição e tamanho do logo (320×192, y=H-h-100)
   - Aplicar SEM exceção em qualquer peça visual

2. **Ler `02 - Tom de Copy.md`**
   - Gerar copy no formato **"Gancho... **Revelação.**"**
   - Linha 1 Regular, Linha 2 Bold
   - Alinhar ao tom Suprema: conversacional, brincalhão, apelo ao desejo, sem CTAs agressivos

3. **Ler `03 - Padroes Tecnicos.md`**
   - Aplicar specs FFmpeg/ImageMagick exatos: 1080×1920, 30fps, H.264 CRF 18, AAC 128kbps, 4.8s
   - Respeitar mapeamento música × tipo de conteúdo

4. **Ler `04 - Padroes de Conteudo.md`**
   - Sequenciar o mix semanal corretamente (salgado → premium → bastidores → salgado → branding → doce → doce)
   - Nunca repetir sabor em dias consecutivos
   - Sobremesas só nos dias 6-7

## Regras críticas (NUNCA quebrar)

- **NUNCA usar padrão genérico** (caixa branca com texto preto, fonte qualquer, halo sólido retangular, etc.)
- **NUNCA usar a logo em vermelho** nas peças de stop motion — sempre converter pra branco
- **NUNCA usar caixa retangular sólida bege** como fundo da legenda — sempre halo dilatado (`Dilate Disk:26`)
- **NUNCA usar emojis, hashtags ou CTAs agressivos** na legenda do stop motion
- **NUNCA exceder 10 palavras por linha** da legenda

## Quando houver conflito

Se houver conflito entre essas regras e uma instrução do usuário, a IA deve:

1. Apontar o conflito explicitamente
2. Perguntar antes de aplicar a mudança
3. Se a mudança for aprovada, registrar na pasta `Reuniaoes/` do cliente com data e justificativa

## Como atualizar essas regras

Para atualizar qualquer arquivo desta pasta:

1. Validar a mudança em reunião com o cliente (registrar em `Reuniaoes/`)
2. Atualizar o arquivo correspondente
3. Atualizar o campo `atualizado_em` no frontmatter
4. Adicionar entrada na seção `## Versionamento` do arquivo, com data e descrição da mudança

## Pré-execução: validação rápida

Antes de gerar qualquer peça, a IA pode rodar mentalmente este checklist:

- [ ] Já li `01 - Identidade Visual.md`?
- [ ] Já li `02 - Tom de Copy.md`?
- [ ] Já li `03 - Padroes Tecnicos.md`?
- [ ] Já li `04 - Padroes de Conteudo.md`?
- [ ] A copy proposta segue o padrão "Gancho... **Revelação.**"?
- [ ] As cores e fonte estão corretas (`#FFEBDC`, Poppins, halo Dilate Disk:26)?
- [ ] A logo está em branco e posicionada em y=H-h-100?
- [ ] O sabor escolhido faz sentido no dia da semana (mix semanal)?
- [ ] A música mapeada corresponde ao tipo de conteúdo?

Se qualquer item falhar, **parar e ajustar** antes de gerar a peça.

## Versionamento

- **2026-05-29** — Criação inicial. Instruções para a skill `stop-motion-creator` e futuras skills da Fenice Lab que atendam a Suprema Pizza.
