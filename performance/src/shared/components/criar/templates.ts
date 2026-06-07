// ============================================================
// templates.ts — Templates Sobral por vertical + tooltips PT-BR
//
// Fonte da verdade pro wizard "Criar campanha" do central.fenicelab.
// Cada vertical (delivery, serviços, e-commerce, awareness) tem:
//   - objetivo Meta + optimization_goal Sobral-mindset
//   - 3 públicos canônicos (cold / warm / hot)
//   - faixas de budget (mínimo, recomendado, teto de aviso)
//   - specs de criativo (hook obrigatório, CTA default, limites)
//   - tooltips PT-BR informais (estilo Sobral falando)
//   - warnings de pré-publicação (checklist operacional)
//
// Opiniões Sobral codificadas aqui (não negociáveis sem revisão):
//   - Delivery: OFFSITE_CONVERSIONS + Advantage+ Placements. Conversão
//     direta no evento Purchase do Pixel — tráfego puro queima budget.
//   - Serviços: LEAD_GENERATION (form nativo) OU MESSAGING. CTA "Saiba
//     mais" só converte se a landing for excepcional — geralmente não é.
//   - E-commerce: catálogo Meta + Advantage+ Shopping na frente,
//     retargeting de carrinho abandonado (atc_7d) atrás. É no ATC que
//     sai a margem — o cold serve pra alimentar o ATC.
//   - Awareness: roda em paralelo com conversão, NUNCA isolado. Sem
//     campanha de conversão consumindo o público gerado, awareness vira
//     vaidade. Métrica é recall / brand lift, não ROAS.
//   - Adset <7 dias não estabiliza (lead gen precisa de 14): durante o
//     learning phase o Meta paga mais caro pra explorar — cortar antes
//     desperdiça o investimento de exploração.
//   - Público <500 mil não dá margem pro algoritmo Meta otimizar: o
//     Advantage+ Audience funciona melhor com público amplo + criativo
//     filtrando que com público estreito + criativo genérico.
// ============================================================

export type VerticalKey = 'delivery' | 'servicos' | 'ecommerce' | 'awareness';

export type ObjetivoMeta =
  | 'OUTCOME_SALES'
  | 'OUTCOME_LEADS'
  | 'OUTCOME_ENGAGEMENT'
  | 'OUTCOME_AWARENESS'
  | 'OUTCOME_TRAFFIC'
  | 'OUTCOME_APP_PROMOTION';

export type OptimizationGoal =
  | 'OFFSITE_CONVERSIONS'
  | 'LEAD_GENERATION'
  | 'LINK_CLICKS'
  | 'REACH'
  | 'IMPRESSIONS'
  | 'POST_ENGAGEMENT'
  | 'MESSAGING_CONVERSIONS_STARTED';

export type CTAType =
  | 'ORDER_NOW'
  | 'SHOP_NOW'
  | 'LEARN_MORE'
  | 'SIGN_UP'
  | 'WHATSAPP_MESSAGE'
  | 'CONTACT_US'
  | 'BOOK_TRAVEL';

export interface AudienceSpec {
  age_min: number;
  age_max: number;
  genders?: ('all' | 'male' | 'female')[];
  interests?: string[]; // termos pra autocomplete Meta depois
  custom_audience?:
    | 'engagement_30d'
    | 'engagement_90d'
    | 'website_30d'
    | 'atc_7d'
    | 'purchase_180d';
  exclude?: string[];
}

export interface CreativeSpec {
  formats: ('REELS_VERTICAL' | 'FEED_SQUARE' | 'FEED_VERTICAL' | 'STORY')[];
  hook_first_3s_required: boolean;
  cta_default: CTAType;
  headline_max_chars: number;
  body_max_chars: number;
  description_hint_ptbr: string;
}

export interface SobralTooltips {
  objetivo: string;
  publico: string;
  budget: string;
  criativo: string;
  periodo: string;
  geo: string;
  cta: string;
}

export interface TemplateSobral {
  key: VerticalKey;
  nome_exibicao: string; // "Delivery / Restaurante"
  icon: string; // emoji ou nome de ícone
  descricao_curta: string; // pra card de seleção
  objetivo: ObjetivoMeta;
  optimization_goal: OptimizationGoal;
  custom_event?: string; // ex: 'Purchase', 'Lead', 'ViewContent'
  placements: 'advantage_plus' | 'manual';
  audiences: {
    cold: AudienceSpec;
    warm: AudienceSpec;
    hot: AudienceSpec;
  };
  budget_min_diario_cents: number; // mínimo Sobral (R$30 = 3000)
  budget_recomendado_diario_cents: number; // sugestão "ideal"
  budget_max_aviso_diario_cents: number; // acima disso pede confirmação
  bid_strategy:
    | 'LOWEST_COST_WITHOUT_CAP'
    | 'LOWEST_COST_WITH_BID_CAP'
    | 'COST_CAP';
  creative_specs: CreativeSpec;
  tooltips: SobralTooltips;
  geo_default: {
    pais: string;
    raio_km_default: number;
    raio_km_max: number;
  };
  duracao_minima_dias: number; // Sobral: <7d adset não estabiliza
  warnings_setup: string[]; // checklist pré-publicação
}

// ------------------------------------------------------------
// Tooltips genéricos (fallback quando template não tem o seu)
// ------------------------------------------------------------
export const TOOLTIPS_GERAL: SobralTooltips = {
  objetivo:
    'Escolher errado aqui queima dinheiro. Se quer vendas, escolhe Vendas. Se quer mensagens, escolhe Leads. Não escolhe Alcance só pra ver mais views.',
  publico:
    'Quanto mais específico, melhor o algoritmo aprende. Mas não exagera: público <500 mil não dá margem pro Meta otimizar.',
  budget:
    'Mínimo R$30/dia por adset. Sobral: orçamento ideal é 5× o CPA esperado. Pra delivery brasileiro, R$50-R$100/dia funciona bem.',
  criativo:
    'Os primeiros 3 segundos são tudo. Hook visual + áudio que pega antes da pessoa rolar. Texto vem depois.',
  periodo:
    'Adset precisa de pelo menos 7 dias rodando pra Meta sair do learning phase. Campanhas curtas não funcionam.',
  geo:
    'Pra delivery, 5km é o ponto doce. Acima de 10km você compete com outras zonas e o tempo de entrega quebra a experiência.',
  cta:
    'CTA deve casar com o objetivo. Pedir Agora pra delivery. Comprar Agora pra e-commerce. Saiba Mais é pra awareness só.',
};

// ------------------------------------------------------------
// TEMPLATES por vertical
// ------------------------------------------------------------
export const TEMPLATES_SOBRAL: Record<VerticalKey, TemplateSobral> = {
  // ----------------------------------------------------------
  // DELIVERY / RESTAURANTE
  // Sobral-mindset: conversão direta + Advantage+. Hook nos 3s.
  // ----------------------------------------------------------
  delivery: {
    key: 'delivery',
    nome_exibicao: 'Delivery / Restaurante',
    icon: '🍔',
    descricao_curta:
      'Pedido direto (iFood, WhatsApp ou site). Conversão otimizada com raio curto e criativo de comida.',
    objetivo: 'OUTCOME_SALES',
    optimization_goal: 'OFFSITE_CONVERSIONS',
    custom_event: 'Purchase',
    placements: 'advantage_plus',
    audiences: {
      cold: {
        age_min: 25,
        age_max: 55,
        genders: ['all'],
        interests: [
          'Food delivery',
          'Pizza',
          'Restaurant',
          'Hambúrguer',
          'Comida brasileira',
          'iFood',
        ],
      },
      warm: {
        age_min: 25,
        age_max: 55,
        genders: ['all'],
        custom_audience: 'engagement_30d',
      },
      hot: {
        age_min: 25,
        age_max: 55,
        genders: ['all'],
        custom_audience: 'website_30d',
      },
    },
    budget_min_diario_cents: 3000, // R$30
    budget_recomendado_diario_cents: 5000, // R$50
    budget_max_aviso_diario_cents: 30000, // R$300
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    creative_specs: {
      formats: ['REELS_VERTICAL', 'FEED_SQUARE'],
      hook_first_3s_required: true,
      cta_default: 'ORDER_NOW',
      headline_max_chars: 40,
      body_max_chars: 125,
      description_hint_ptbr:
        'Mostra o prato em close, no formato vertical, com som ambiente do preparo. Sem texto excessivo no vídeo — deixa a imagem vender.',
    },
    tooltips: {
      objetivo:
        'Pra delivery, sempre Vendas. Conversão otimizada pelo evento Purchase do Pixel. Tráfego pra site sem conversão queima budget.',
      publico:
        'Cold: idade 25-55, interesses de comida e iFood. Não filtra demais — o raio geográfico já restringe o público o suficiente.',
      budget:
        'Sobral pra delivery: R$30/dia é o piso. Abaixo disso o algoritmo Meta não estabiliza e queima orçamento sem aprender.',
      criativo:
        'Pra delivery, o hook nos primeiros 3 segundos define tudo. Mostra a comida em close ou a embalagem chegando — gere desejo imediato.',
      periodo:
        'Mínimo 7 dias por adset. Sobral roda 14-30 dias e só mexe depois de 50+ conversões pra evitar reset de aprendizado.',
      geo:
        'Raio de 5km é o ponto doce. Acima de 10km a entrega demora, o cliente reclama e o LTV cai. Pra zonas urbanas densas, 3km já basta.',
      cta:
        'Pedir Agora (ORDER_NOW) ou Enviar Mensagem (WhatsApp). Nunca Saiba Mais — a fricção mata o pedido.',
    },
    geo_default: {
      pais: 'BR',
      raio_km_default: 5,
      raio_km_max: 15,
    },
    duracao_minima_dias: 7,
    warnings_setup: [
      'Pixel disparando evento Purchase',
      'Catálogo ativo (se rodar Advantage+ Shopping)',
      'iFood ou link de delivery atualizado',
      'WhatsApp comercial configurado',
      'Horário de funcionamento batendo com a janela de exibição',
    ],
  },

  // ----------------------------------------------------------
  // SERVIÇOS (contador, advogado, dentista, consultoria, etc)
  // Sobral-mindset: lead gen ou mensagem. Sem CTA fraco.
  // ----------------------------------------------------------
  servicos: {
    key: 'servicos',
    nome_exibicao: 'Serviços / Profissional Liberal',
    icon: '💼',
    descricao_curta:
      'Captação de leads via formulário Meta ou WhatsApp. Otimizado pra CPL baixo e resposta rápida.',
    objetivo: 'OUTCOME_LEADS',
    optimization_goal: 'LEAD_GENERATION',
    custom_event: 'Lead',
    placements: 'advantage_plus',
    audiences: {
      cold: {
        age_min: 30,
        age_max: 65,
        genders: ['all'],
        interests: [
          'Pequenas empresas',
          'Empreendedor',
          'Microempresa',
          'Gestão de negócios',
        ],
      },
      warm: {
        age_min: 30,
        age_max: 65,
        genders: ['all'],
        custom_audience: 'engagement_90d',
      },
      hot: {
        age_min: 30,
        age_max: 65,
        genders: ['all'],
        custom_audience: 'website_30d',
      },
    },
    budget_min_diario_cents: 3000, // R$30
    budget_recomendado_diario_cents: 7000, // R$70
    budget_max_aviso_diario_cents: 30000, // R$300
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    creative_specs: {
      formats: ['FEED_VERTICAL', 'REELS_VERTICAL'],
      hook_first_3s_required: true,
      cta_default: 'WHATSAPP_MESSAGE',
      headline_max_chars: 40,
      body_max_chars: 125,
      description_hint_ptbr:
        'Mostra o profissional falando direto pra câmera, com prova social (depoimento ou número de clientes). Tom de autoridade, não de venda.',
    },
    tooltips: {
      objetivo:
        'Pra serviços, sempre Leads — ou via formulário Meta ou via mensagem WhatsApp. Tráfego pra site só funciona se você tem funil maduro.',
      publico:
        'Pra serviços, vá mais fundo no perfil: profissão, cargo, comportamento de compra. Bater em todo mundo queima budget.',
      budget:
        'CPL bom em serviços fica entre R$15 e R$50. R$70/dia rende ~2 leads/dia, o suficiente pra alimentar o funil sem sobrecarregar o atendimento.',
      criativo:
        'Esquece estoque de imagem. Profissional falando direto pra câmera converte 3-5× mais. Mostra a cara, fala o problema, mostra a solução.',
      periodo:
        'Lead gen estabiliza mais devagar que vendas. Mínimo 14 dias pra ter dados confiáveis antes de mexer.',
      geo:
        'Pra serviços locais (contador, dentista), raio 50km cobre cidade inteira sem desperdiçar. Pra consultoria nacional, vai BR todo.',
      cta:
        'WhatsApp Message ou Cadastre-se. Saiba Mais só funciona se o landing page é absurdamente bom — geralmente não é.',
    },
    geo_default: {
      pais: 'BR',
      raio_km_default: 50,
      raio_km_max: 100,
    },
    duracao_minima_dias: 14,
    warnings_setup: [
      'WhatsApp Business conectado',
      'Formulário Meta configurado e testado',
      'CRM recebendo leads (Zapier/Make/integração nativa)',
      'Resposta <10min combinada com cliente',
      'Página de obrigado com Pixel do evento Lead',
    ],
  },

  // ----------------------------------------------------------
  // E-COMMERCE
  // Sobral-mindset: catálogo + Advantage+. Retargeting ATC = lucro.
  // ----------------------------------------------------------
  ecommerce: {
    key: 'ecommerce',
    nome_exibicao: 'E-commerce / Loja Virtual',
    icon: '🛒',
    descricao_curta:
      'Venda direta com catálogo Meta. Advantage+ Shopping na frente, retargeting de carrinho abandonado atrás.',
    objetivo: 'OUTCOME_SALES',
    optimization_goal: 'OFFSITE_CONVERSIONS',
    custom_event: 'Purchase',
    placements: 'advantage_plus',
    audiences: {
      cold: {
        age_min: 25,
        age_max: 55,
        genders: ['all'],
        interests: [
          'Online shopping',
          'E-commerce',
          'Compras online',
          'Marketplace',
        ],
      },
      warm: {
        age_min: 25,
        age_max: 55,
        genders: ['all'],
        custom_audience: 'engagement_30d',
      },
      hot: {
        age_min: 25,
        age_max: 55,
        genders: ['all'],
        custom_audience: 'atc_7d',
      },
    },
    budget_min_diario_cents: 5000, // R$50
    budget_recomendado_diario_cents: 10000, // R$100
    budget_max_aviso_diario_cents: 50000, // R$500
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    creative_specs: {
      formats: ['FEED_SQUARE', 'FEED_VERTICAL', 'REELS_VERTICAL'],
      hook_first_3s_required: true,
      cta_default: 'SHOP_NOW',
      headline_max_chars: 40,
      body_max_chars: 125,
      description_hint_ptbr:
        'Carrossel de produtos com preço visível. Pra Reels, mostra o produto em uso (unboxing, vestindo, montando). Evita texto chapado.',
    },
    tooltips: {
      objetivo:
        'E-commerce é Vendas com Purchase. Conversion API + Pixel duplo. Sem isso, o Meta perde sinal e o CPA dobra.',
      publico:
        'Cold vai amplo com Advantage+ Audience. A inteligência tá no catálogo, não no targeting. O retargeting é onde você filtra fino.',
      budget:
        'Mínimo R$50/dia. Sobral: R$100/dia no Advantage+ Shopping + R$30-50/dia no retargeting ATC. Esse mix é onde sai lucro.',
      criativo:
        'Pra e-commerce: catálogo + Advantage+ Shopping. Manual ad só pra teste de hook. O retargeting de ATC vai ser quem dá lucro.',
      periodo:
        'Mínimo 14 dias por adset. Sazonalidade (Black Friday, Dia das Mães) muda tudo — separa campanhas de evento das de "always-on".',
      geo:
        'Brasil inteiro por padrão. Só restringe se logística limita (ex: frete grátis só SP/RJ).',
      cta:
        'Comprar Agora (SHOP_NOW). Sempre. Sem exceção.',
    },
    geo_default: {
      pais: 'BR',
      raio_km_default: 0, // 0 = BR todo
      raio_km_max: 0,
    },
    duracao_minima_dias: 14,
    warnings_setup: [
      'Pixel + CAPI (Conversion API) ativos',
      'Catálogo sincronizado e validado (sem produtos rejeitados)',
      'Política de devolução visível no site',
      'Frete configurado e calculado no checkout',
      'Eventos AddToCart, InitiateCheckout, Purchase disparando',
    ],
  },

  // ----------------------------------------------------------
  // AWARENESS / BRANDING
  // Sobral-mindset: NUNCA isolado. Roda em paralelo com conversão.
  // ----------------------------------------------------------
  awareness: {
    key: 'awareness',
    nome_exibicao: 'Awareness / Reposicionamento',
    icon: '📣',
    descricao_curta:
      'Reposicionamento de marca, lançamento ou recall. Não espera vendas direto — alimenta o funil pra campanhas de conversão.',
    objetivo: 'OUTCOME_AWARENESS',
    optimization_goal: 'REACH',
    placements: 'manual',
    audiences: {
      cold: {
        age_min: 18,
        age_max: 65,
        genders: ['all'],
        interests: [],
      },
      warm: {
        age_min: 18,
        age_max: 65,
        genders: ['all'],
        custom_audience: 'engagement_90d',
      },
      hot: {
        age_min: 18,
        age_max: 65,
        genders: ['all'],
        custom_audience: 'engagement_30d',
      },
    },
    budget_min_diario_cents: 5000, // R$50
    budget_recomendado_diario_cents: 15000, // R$150
    budget_max_aviso_diario_cents: 100000, // R$1000
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    creative_specs: {
      formats: ['REELS_VERTICAL', 'STORY'],
      hook_first_3s_required: true,
      cta_default: 'LEARN_MORE',
      headline_max_chars: 40,
      body_max_chars: 125,
      description_hint_ptbr:
        'Mensagem única, repetida com variações. Identidade visual chumbada (cor, fonte, logo). Não vende — posiciona.',
    },
    tooltips: {
      objetivo:
        'Awareness é pra reposicionamento ou lançamento. Não espera vendas direto. Sobral: roda awareness em paralelo com conversão pra alimentar funil.',
      publico:
        'Awareness usa público amplo (18-65) por design. Quanto maior o alcance, mais barato o CPM. Restringir aqui é jogar dinheiro fora.',
      budget:
        'Pra mover ponteiro de marca, R$150/dia por 30 dias é o mínimo. Abaixo disso o recall não fixa. Awareness não é "campanha barata".',
      criativo:
        'Mensagem única, repetida. Se a marca é nova, mostra a logo em todo frame. Se é reposicionamento, mostra o ANTES x DEPOIS visual.',
      periodo:
        'Awareness precisa de 14-30 dias contínuos. Cortou no meio, perdeu o recall. Programa o budget mensal antes de subir.',
      geo:
        'Cidade-alvo + raio 50km. Pra marca nacional, vai BR inteiro. Não mistura geo de awareness com geo de conversão.',
      cta:
        'Saiba Mais (LEARN_MORE) ou nenhum CTA. Aqui o objetivo é fixar marca, não converter — botão forte distrai.',
    },
    geo_default: {
      pais: 'BR',
      raio_km_default: 50,
      raio_km_max: 100,
    },
    duracao_minima_dias: 14,
    warnings_setup: [
      'Identidade visual consistente (mesma logo, mesma paleta em todo criativo)',
      'Mensagem central única (não mistura 5 promessas diferentes)',
      'Não medir por ROAS (medir por brand lift, recall, view-through)',
      'Rodar em paralelo com campanha de conversão (não isoladamente)',
      'Briefing alinhado: cliente sabe que awareness não vira venda imediata',
    ],
  },
};

// ------------------------------------------------------------
// Lista canônica das verticais (pra iteração no front-end)
// ------------------------------------------------------------
export const VERTICAL_KEYS: VerticalKey[] = [
  'delivery',
  'servicos',
  'ecommerce',
  'awareness',
];

// ------------------------------------------------------------
// Funções utilitárias
// ------------------------------------------------------------

/**
 * Retorna o template canônico de uma vertical.
 * Use no wizard de criação pra pré-popular campos.
 */
export function pickTemplate(vertical: VerticalKey): TemplateSobral {
  return TEMPLATES_SOBRAL[vertical];
}

/**
 * Retorna tooltips PT-BR. Sem vertical, devolve os genéricos.
 * Com vertical, devolve os específicos (mais opinativos).
 */
export function getTooltips(vertical?: VerticalKey): SobralTooltips {
  if (!vertical) return TOOLTIPS_GERAL;
  return TEMPLATES_SOBRAL[vertical].tooltips;
}

/**
 * Valida um budget diário (em centavos) contra os limites Sobral
 * pra vertical escolhida. Devolve `ok=false` se abaixo do piso;
 * `ok=true` com warning se acima do teto de aviso.
 */
export function validateBudget(
  cents: number,
  vertical: VerticalKey,
): { ok: boolean; warning?: string } {
  const t = TEMPLATES_SOBRAL[vertical];
  if (cents < t.budget_min_diario_cents) {
    return {
      ok: false,
      warning: `Abaixo do mínimo Sobral pra ${t.nome_exibicao}: R$${
        t.budget_min_diario_cents / 100
      }/dia`,
    };
  }
  if (cents > t.budget_max_aviso_diario_cents) {
    return {
      ok: true,
      warning: `Acima de R$${
        t.budget_max_aviso_diario_cents / 100
      }/dia — confirma se tem caixa pra sustentar`,
    };
  }
  return { ok: true };
}

/**
 * Valida a duração planejada (em dias) contra o mínimo Sobral
 * pra vertical. Adset abaixo da duração mínima não estabiliza.
 */
export function suggestDuration(
  vertical: VerticalKey,
  dias: number,
): { ok: boolean; warning?: string } {
  const t = TEMPLATES_SOBRAL[vertical];
  if (dias < t.duracao_minima_dias) {
    return {
      ok: false,
      warning: `Sobral: ${t.nome_exibicao} precisa de ${t.duracao_minima_dias}+ dias pra adset estabilizar`,
    };
  }
  return { ok: true };
}
