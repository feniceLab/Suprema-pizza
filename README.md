# Suprema Pizza — App Oficial do Cliente (Fenice Lab)

> Produzido por [Fenice Lab](https://fenicelab.com.br) · 2026
> **Status:** no ar · Segue o **padrão de app de cliente** da Fenice (modelo de referência: [Arena Gourmet](https://github.com/feniceLab/arena_gourmet)).

Este repositório é o **app oficial do cliente Suprema Pizza**. Cada cliente da Fenice tem o seu
**próprio repositório, próprio deploy e próprios dados** — nunca compartilham espaço. A Arena Gourmet
é o piloto/modelo desse formato; a Suprema é o segundo cliente alinhado a ele.

---

## O que é

Um **portal white-label do cliente** (chamado no HTML de "Painel da Marca"). É um app estático
(HTML/CSS/JS) com um `index.html` wrapper que organiza o conteúdo do cliente em abas. Cada aba
carrega uma página própria via `<iframe>` (ou conteúdo embutido).

- **Site live:** https://supremapizza.fenicelab.com.br
- **Servidor:** VPS Fenix (`207.58.172.147`), servido pelo container OpenResty `ic-openresty-mVOb`
- **Consumido pela central:** o admin da agência (`central.fenicelab.com.br`) embute este portal
  via `<iframe>`. A central referencia a URL pública deste app no campo `portalUrl` do registry de
  clientes (`shared/src/clientes/fenice.ts` da central = `https://supremapizza.fenicelab.com.br`).

### Abas do portal (`index.html`)

| Aba | Origem do conteúdo |
|---|---|
| Brand Book | `design-system/brandbook/index.html` (iframe) |
| Design System | `design-system/apresentacao/design-system.html` (iframe) |
| Grafismos | `design-system/apresentacao/grafismos.html` (iframe) |
| Cronograma | `design-system/operacao/cronograma/index.html` (iframe) |
| Performance | `https://central.fenicelab.com.br/portal/?surface=performance&c=suprema&embed=1` (iframe) |
| Galeria | fotos em `assets/galeria/` (curadoria em `assets/galeria-cat.json`) |
| Catálogo | cardápio em `assets/cardapio.json` |

> A aba **Performance** é o único iframe externo: ela aponta para a central (que por sua vez embute
> o dashboard de tráfego). Todo o resto é servido por este próprio app. O parâmetro `c=suprema`
> identifica o cliente na central (espelha o `c=arena` da Arena).

---

## Estrutura de pastas (real)

```
Suprema-pizza/
├── index.html                  # WRAPPER do portal — abas + galeria + catálogo (servido na raiz do domínio)
├── README.md                   # este arquivo
├── .gitignore                  # ignora chaves TLS (ssl/, *.pem, *.key) e lixo de SO
├── favicon.ico / favicon-*.png # favicons do cliente
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # deploy próprio (GitHub Actions → git pull na VPS)
│
├── data/                       # A FICHA — fonte da verdade do conteúdo do cliente
│   ├── ficha.json              # dados do cliente (marca, tokens, contato, ...)
│   └── ficha.schema.json       # schema da ficha
│
├── assets/                     # conteúdo do portal
│   ├── cardapio.json           # catálogo/cardápio (aba Catálogo)
│   ├── galeria/                # fotos da sessão (aba Galeria)
│   ├── galeria-cat.json        # curadoria de fotos por categoria
│   ├── videos/                 # vídeos comprimidos
│   ├── questionario-respostas.json
│   └── logo.png
│
├── design-system/              # CÓDIGO das páginas embutidas nas abas
│   ├── apresentacao/           # brand-book.html · design-system.html · grafismos.html · present.css/js
│   ├── brandbook/              # index.html do Brand Book (iframe da aba)
│   ├── operacao/               # cronograma/ · briefing-fotos.html · questionario.html
│   ├── preview/                # previews do design system
│   ├── tokens.json             # tokens do design system do cliente
│   ├── colors_and_type.css     # cores e tipografia (espelho dos tokens --sup-*)
│   ├── README.md / SKILL.md    # docs do design system da Suprema
│   └── ui_kits/ · slides/ · scrap/ · uploads/ · assets/
│
└── Materiais/
    └── logo/
        └── suprema-logo.png    # logo oficial
```

### Onde ficam os DADOS

A Suprema já adota o padrão **data-driven** que a Fenice persegue: o conteúdo do cliente vive em
`data/ficha.json` (fonte da verdade, declarada no `_meta` do próprio arquivo), com o cardápio em
`assets/cardapio.json` e a curadoria da galeria em `assets/galeria-cat.json`. O `index.html` é o
molde; a ficha é o cliente.

> Observação de transparência: a `ficha.json` ainda tem campos com placeholder `[X]`
> (ex.: `contato.telefone`, `contato.whatsapp`, `contato.email`) a preencher.

### Assets binários

Imagens e vídeos **estão versionados neste repositório** (pastas `assets/galeria/`,
`assets/videos/`, `design-system/.../media/`). O `.gitignore` ignora apenas chaves TLS (`ssl/`,
`*.pem`, `*.key`) e lixo de sistema (`.DS_Store`, `Thumbs.db`).

> Diferença em relação à Arena: na Arena os binários **não** entram no git (vivem só na VPS); na
> Suprema eles **estão no git**. Ver "Gaps em relação ao padrão" abaixo.

---

## Deploy (próprio)

Este app tem **deploy próprio**, independente de qualquer outro cliente. Mexer aqui **não**
redeploya nenhum outro portal nem a central.

O deploy é **automático via GitHub Actions** (`.github/workflows/deploy.yml`): todo `push` na
branch `main` (ou `workflow_dispatch`) conecta por SSH na VPS Fenix e faz `git fetch` +
`git reset --hard origin/main` na pasta servida do domínio:

```
/etc/icontainer/apps/openresty/openresty/www/sites/supremapizza.fenicelab.com.br
```

Os segredos de SSH (`SSH_HOST`, `SSH_PORT`, `SSH_USER`, `SSH_KEY`) ficam em GitHub Secrets do repo.

> Diferença em relação à Arena: a Arena faz deploy via `deploy.sh` local (rsync, sem `--delete`,
> recarrega o nginx). A Suprema faz deploy via CI (GitHub Actions + `git reset --hard`). São duas
> estratégias válidas; ver "Gaps em relação ao padrão" abaixo.

---

## Gaps em relação ao padrão de cliente (modelo Arena)

A Suprema já é um app de cliente completo e no ar. As diferenças abaixo são pontos de alinhamento,
não bloqueios:

1. **Binários no git.** A Arena mantém mídia fora do git (só na VPS). A Suprema versiona
   `assets/galeria/` e `assets/videos/` no repositório. Decidir se padroniza (mídia fora do git)
   ou se mantém versionada conscientemente.
2. **Estratégia de deploy distinta.** Arena = `deploy.sh` (rsync local). Suprema = GitHub Actions
   (`git reset --hard` na VPS). Atenção: `git reset --hard` na pasta servida **descarta** qualquer
   conteúdo que só exista na VPS — diferente do rsync sem `--delete` da Arena.
3. **Ficha com placeholders.** `data/ficha.json` tem campos `[X]` a preencher (telefone, whatsapp,
   e-mail).
4. **Docs de processo ausentes.** A Arena tem `design.md`, `00 - Visão Geral.md`,
   `PROCESSO-ONBOARDING.md` e referencia um `PADRAO-CLIENTE.md`. A Suprema tem docs do design
   system (`design-system/README.md`, `design-system/SKILL.md`), mas não os docs de
   processo/onboarding no mesmo formato.

---

*Suprema Pizza · Pizzaria / Delivery · Blumenau, SC · contato@fenicelab.com.br*
