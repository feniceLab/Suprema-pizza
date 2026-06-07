// ============================================================
// Dicionário PT-BR de tooltips do wizard — explica conceitos
// de tráfego pago pra cliente leigo (Sobral simplificado).
// ============================================================

export const TOOLTIPS: Record<string, string> = {
  objetivo: 'O que você quer que aconteça quando alguém clicar no anúncio? Venda, mensagem, ou só ser visto?',
  vertical: 'Qual o tipo do seu negócio? Cada tipo tem regras Sobral diferentes.',
  nome_campanha: 'Nome interno da campanha — você verá no relatório. Ex: "Promo Quinta - Pizza Calabresa".',
  idade: 'Faixa etária dos seus clientes. Sobral pra delivery sugere 25-55. Pra serviços, 28+.',
  genero: 'Quem compra mais? Se não tiver certeza, deixe ambos.',
  raio_km: 'Quão longe o anúncio aparece. Delivery: 5km (quem mora longe não pede). Serviços: 10-15km.',
  interesses: 'Hobbies, marcas ou assuntos que seu cliente curte. Quanto mais específico, melhor — mas com público pequeno demais, sai caro.',
  criativo: 'Imagem ou vídeo do anúncio. Vídeo curto (5-15s) costuma converter mais que foto. Evite muito texto.',
  cta: 'Botão de ação. "Pedir agora" pra delivery, "Saiba mais" pra awareness.',
  titulo: 'Frase principal do anúncio (até 40 caracteres). Direto ao ponto.',
  descricao: 'Frase complementar (até 125 caracteres). Justifica o clique.',
  orcamento: 'Quanto você gasta por dia. Mínimo Sobral: R$30/dia. Abaixo disso, o algoritmo não aprende.',
  periodo: 'Quando o anúncio começa e termina. Se não tiver data fim, ele roda até você pausar.',
  data_inicio: 'Quando o anúncio começa a aparecer. Hoje ou data futura.',
  data_fim: 'Quando para automaticamente. Deixe em branco se quiser controle manual.',
  estimativa: 'Estimativa Meta de alcance e custo. É um chute matemático — resultado real depende de leilão.',
  publico_quente: 'Quem já comprou de você. Funciona melhor que cold (público novo) — sempre.',
  pixel: 'Código no seu site/WhatsApp que mede conversões. Sem ele, o Meta não sabe quem comprou.',
  guardrail_budget: 'Sobral: budget abaixo de R$30/dia é desperdício. O Meta precisa de pelo menos 50 conversões/semana pra otimizar.',
};

/** Retorna texto do tooltip ou string vazia se chave não existir. */
export function tip(key: string): string {
  return TOOLTIPS[key] || '';
}
