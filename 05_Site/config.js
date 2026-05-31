// ═══════════════════════════════════════════════════════════════
// CONFIG.JS — Dados Públicos do Site
// Seguro para commit no GitHub (sem secrets!)
// ═══════════════════════════════════════════════════════════════

const CONFIG = {

  // ── Dados gerais da empresa ──────────────────────────────────
  empresa: {
    nome: "Minerva",
    slogan: "Performance Digital para Educação",
    local: "São Paulo, Brasil",
    ano: "2025",
    cta_link: "#formulario",
    whatsapp_link: "#", // Deve ser validado no backend
  },

  // ── Menu de navegação ────────────────────────────────────────
  nav: [
    { texto: "Os 3 Pilares",      href: "#servicos" },
    { texto: "Performance Real",   href: "#ia" },
    { texto: "Acompanhamento",     href: "#acompanhamento" },
    { texto: "Case",               href: "#case" },
  ],

  // ── Seção Hero (topo) ────────────────────────────────────────
  hero: {
    tag: "Performance Digital para Educação",
    titulo: "Aquisição + Automações<br>+ <em>CRM Educacional</em>.<br>Integrados.",
    subtitulo: "Não somos uma agência generalista. Somos especialistas em performance digital para escolas — integrando captação (Google, Meta & TikTok Ads), nurturing automático (WhatsApp + Email) e CRM desenhado para jornada educacional. Tudo conectado e monitorado por IA 24h por dia.",
    btn_primario:   { texto: "Agendar reunião gratuita", href: "#cta" },
    btn_secundario: { texto: "Ver os 3 pilares",          href: "#servicos" },

    metricas: [
      { num: "R$14–18",  label: "CPL alvo (educação)" },
      { num: "+40%",     label: "Aumento em 90 dias" },
      { num: "3 pilares", label: "Integrados na operação" },
    ],

    phone: {
      escola: "Colégio São Lucas",
      hora:   "07h42",
      mensagem: "Bom dia! Ontem: <strong>24 leads</strong>, CPL <strong>R$16</strong>. Nurturing automático em dia. <strong>2 matrículas confirmadas</strong> de leads da semana anterior. Meta do mês: 78% ✓",
      stats: [
        { num: "24",     label: "Leads ontem" },
        { num: "R$16",   label: "CPL médio" },
        { num: "2",      label: "Matrículas conf." },
        { num: "78%",    label: "Meta do mês" },
      ],
    },
  },

  // ── Clientes atendidos (barra de logos) ─────────────────────
  clientes: [
    "Escola Mais — SP",
    "Colégio São Lucas — SP",
    "Colégio Lourenço Castanho — SP",
    "Escola Concept — SP & Salvador",
    "Colégio Einstein — Ribeirão Preto",
    "Faculdade do Comércio — SP",
  ],

  // ── Seção "Por que Minerva" ──────────────────────────────────
  proposta: {
    tag:    "Por que escolher a Minerva",
    titulo: "3 pilares integrados<br>pensados para <em>educação.</em>",
    textos: [
      "Tráfego pago isolado não gera matrículas sustentáveis. Responsáveis entram no funil, mas sem nurturing dedicado, morrem na conversão. Relatórios chegam tarde. Dados são tratados como e-commerce, não como educação.",
      "A Minerva integra Tráfego Pago + Automações Criativas + CRM Educacional. Cada pilar conversa com o outro. Você vê o resultado real: de clique até matrícula confirmada e aluno engajado.",
    ],
    cards: [
      {
        icone: "🎯",
        titulo: "Tráfego Pago Educacional",
        texto:  "Google Ads + Meta Ads segmentado para responsáveis. Estratégias que respeitam o ciclo escolar (jan/fev e jun/jul como janelas principais).",
      },
      {
        icone: "🤖",
        titulo: "Automações Criativas & Relatórios",
        texto:  "WhatsApp bots + Email nurturing + Relatórios diários até 8h. Sem manualidade. Sem espera. Conversão por meio da jornada, não por força.",
      },
      {
        icone: "📊",
        titulo: "CRM Educacional",
        texto:  "Ferramenta desenhada para educação, não genérica. Lead scoring por engajamento. Rastreamento: interessado → aluno → engajado.",
      },
    ],
  },

  // ── Seção IA ─────────────────────────────────────────────────
  ia: {
    tag:      "Foco em Resultado Real",
    titulo:   "Performance Digital significa<br><em>matrícula confirmada</em>,<br>não apenas lead.",
    subtitulo: "Tráfego isolado é insuficiente. Responsável entra no funil, mas sem nurturing, automation e CRM educacional integrados, o lead morre. A Minerva mede sucesso diferente.",
    cards: [
      {
        num:    "01 / Tráfego Pago",
        titulo: "Captação com intenção",
        texto:  "Google Ads + Meta Ads + WhatsApp Ads. Responsáveis buscando ativamente ou abertos à descoberta. Segmentação por fase escolar e perfil decisório.",
        bullets: [
          "CPL alvo: R$14–18 (educação)",
          "Remarketing para quem visitou",
          "Otimizações baseadas em padrão educacional",
        ],
      },
      {
        num:    "02 / Automações",
        titulo: "Nurturing contínuo, 24h",
        texto:  "WhatsApp bots + Email templates + Relatórios automáticos. Sem esperar reunião. Sem manual. Jornada educacional integrada.",
        bullets: [
          "Resposta imediata via WhatsApp",
          "Email sequences por fase da jornada",
          "Relatório diário até 8h no seu celular",
        ],
      },
      {
        num:    "03 / CRM Educacional",
        titulo: "Lead scoring por engajamento",
        texto:  "Plataforma pensada para jornada educacional. Rastreia: interessado → aluno → engajado. Diferentes de CRM genérico.",
        bullets: [
          "Score: probabilidade real de matrícula",
          "Histórico completo de jornada",
          "Integração com plataformas de matrículas",
        ],
      },
    ],
  },

  // ── Seção Acompanhamento ─────────────────────────────────────
  acompanhamento: {
    tag:      "Acompanhamento & Transparência",
    titulo:   "Você sabe exatamente<br>onde estão as <em>matrículas.</em>",
    subtitulo: "Não é um lead que chegou e desapareceu. Você rastreia de verdade: de clique, até matrícula confirmada, até aluno engajado. Transparência ativa todos os dias.",
    itens: [
      {
        freq:   "📲 Todo dia até 8h",
        titulo: "Briefing no WhatsApp",
        texto:  "Resumo em texto claro, sem jargão, sem planilha. Leva 30 segundos para ler.",
        bullets: [
          "Leads que chegaram ontem",
          "CPL do dia",
          "Status de campanhas (ótimo/bom/atenção)",
          "Matrículas confirmadas (não só leads)",
          "Se houve ação da equipe",
        ],
      },
      {
        freq:   "📊 Toda semana",
        titulo: "Relatório de Performance",
        texto:  "Painel web com evolução semanal, comparativos, análise de canais e recomendações claras.",
        bullets: [
          "Leads vs. Matrículas vs. Meta",
          "Desempenho por canal",
          "Análise de criativos",
          "Projeção para o mês",
          "Próximos passos",
        ],
      },
      {
        freq:   "📅 Todo mês",
        titulo: "Reunião Estratégica",
        texto:  "Revisão completa + planejamento da próxima janela de matrículas (jan/fev ou jun/jul).",
        bullets: [
          "Análise de resultado: leads, matrículas, retenção",
          "O que funcionou, o que precisa ajuste",
          "Planejamento antecipado para próxima sazonalidade",
          "Estratégia de budget e canais",
        ],
      },
    ],
    highlight: {
      titulo:   "Você acorda informado. Sem esperar reunião. Sem planilha.",
      texto:    "Quando algo muda — para melhor ou pior — você é o primeiro a saber. Em tempo real. Direto.",
      mensagem: "Bom dia! Ontem: 24 leads, CPL R$16. Nurturing em dia. 2 matrículas confirmadas de leads da semana anterior. Budget utilizado 76%. Nenhuma ação necessária hoje. Campanha estável ✓",
    },
  },

  // ── Ciclo Escolar ────────────────────────────────────────────
  ciclo: {
    tag:      "Estratégia Sazonal",
    titulo:   "O ciclo escolar<br>é <em>core</em> da estratégia.",
    subtitulo: "Escolas não têm procura constante. Há janelas bem definidas: out/fev (matrículas novas + rematrícula) e jun/jul (meio de ano). Agências generalistas não sabem isso. A Minerva planeja antecipadamente para cada janela.",
    periodos: [
      {
        trimestre: "Jul–Set",
        titulo: "Aquecimento da audiência",
        acao: "Prospecção antecipada, testes de público, conteúdo educacional",
        budget: "20% do orçamento anual",
      },
      {
        trimestre: "Out–Dez",
        titulo: "Matrículas novas",
        acao: "🔴 MÁXIMO INVESTIMENTO — campanhas em alta velocidade",
        budget: "40–50% do orçamento anual",
      },
      {
        trimestre: "Jan–Fev",
        titulo: "Conversão + Rematrícula",
        acao: "🔴 Acompanhamento intensivo — finalizar leads, confirmações",
        budget: "Continuação intensa",
      },
      {
        trimestre: "Mar–Jun",
        titulo: "Planejamento e matrículas de meio de ano",
        acao: "Análise de resultados + preparação da janela de julho",
        budget: "20–30% do orçamento anual",
      },
    ],
    destaque: "Isso significa: sua estratégia muda a cada 8–10 semanas. Não é campanha que roda o ano todo. É planejamento antecipado, execução ajustada e resultado medido por sazonalidade.",
  },

  // ── Seção Serviços ──────────────────────────────────────────
  servicos: {
    tag:    "Os 3 Pilares",
    titulo: "Tráfego + Automações<br>+ <em>CRM Educacional</em>",
    cards: [
      {
        icone: "📊",
        titulo: "Pilar 1: Tráfego Pago",
        texto:  "Google Ads para captação intencional (pais buscando ativamente). Meta Ads com segmentação por responsável. WhatsApp Ads com conversão direta. Remarketing educacional para quem visitou e ainda não converteu.",
      },
      {
        icone: "🔄",
        titulo: "Pilar 2: Automações & Relatórios",
        texto:  "WhatsApp bots para atendimento inicial. Email marketing com jornada de nurturing respeitando sazonalidade. Relatórios diários até 8h no seu celular. Nada manual. Tudo integrado.",
      },
      {
        icone: "💾",
        titulo: "Pilar 3: CRM Educacional",
        texto:  "Plataforma própria para lead scoring, nurturing e acompanhamento de jornada. Diferente de CRM genérico, entende: interessado vs aluno, retenção, ciclo escolar.",
      },
      {
        icone: "🛠️",
        titulo: "Landing Pages Otimizadas",
        texto:  "Páginas criadas para converter visitas em leads qualificados. Testadas com responsáveis de educação. Velocidade mobile otimizada.",
      },
      {
        icone: "📈",
        titulo: "Rastreamento do Funil Completo",
        texto:  "Do clique ao relatório de matrícula confirmada. Dados conectados. Sem silos. Você vê a jornada inteira.",
      },
      {
        icone: "🎓",
        titulo: "Consultoria Educacional",
        texto:  "Especialista que entende ciclo escolar, sazonalidade de matrículas e nuances da educação. Não genérico.",
      },
    ],
  },

  // ── Tabela comparativa ───────────────────────────────────────
  comparativo: {
    tag:    "Diferença Real",
    titulo: "Agência generalista<br>vs. <em>Performance Digital Integrada</em>",
    linhas: [
      { criterio: "Especialização",                agencia: "Multi-segmento (e-commerce, SaaS, tudo)",      minerva: "100% educação desde o dia 1" },
      { criterio: "O que oferece",                 agencia: "Tráfego pago isolado",                        minerva: "Tráfego + Automações + CRM integrados" },
      { criterio: "Conhecimento de educação",     agencia: "Genérico, aprendido no contrato",             minerva: "Profundo: ciclo escolar, sazonalidade, jornada responsável" },
      { criterio: "Métrica de sucesso",           agencia: "CPL (número de leads)",                       minerva: "Matrícula confirmada + Aluno engajado na jornada" },
      { criterio: "Relatório",                    agencia: "Mensal, se você cobrar",                      minerva: "Diário no seu celular, antes das 8h" },
      { criterio: "Detecção de problemas",        agencia: "Quando já afetou o resultado",                minerva: "Antes de virar prejuízo (IA 24h)" },
      { criterio: "Decisões baseadas em",         agencia: "Intuição do account",                         minerva: "Dados + padrões educacionais" },
      { criterio: "Integração com CRM",           agencia: "Não (CRM genérico, se houver)",               minerva: "Sim, desenhado para jornada educacional" },
    ],
  },

  // ── Case de sucesso ──────────────────────────────────────────
  case: {
    tag:    "Case de Sucesso",
    titulo: "Colégio São Lucas<br>Integração Performance Digital",
    texto:  "Escola de médio porte em SP. Campanhas anteriores com tráfego pago isolado, sem automação, sem CRM integrado. Resultado: CPL alto (R$80+), leads perdidos, matrículas baixas. Em 90 dias com a Minerva (3 pilares integrados): mudança completa.",
    rodape: "Google Ads + Meta Ads + WhatsApp + Email Nurturing + CRM · 90 dias",
    metricas: [
      { num: "R$14",  label: "CPL (era R$82)" },
      { num: "3.2k",  label: "Leads gerados" },
      { num: "127",   label: "Matrículas confirmadas (+42% vs. ano anterior)" },
    ],
  },

  // ── CTA final ────────────────────────────────────────────────
  cta: {
    titulo:   "Performance Digital não é só tráfego pago.<br>É <em>matrícula confirmada.</em>",
    subtitulo: "Quando Tráfego + Automações + CRM Educacional trabalham integrados, com IA monitorando 24h e você informado todos os dias, o resultado é diferente. Matrículas crescem. Ciclo de conversão cai. Você dorme tranquilo.",
    btn:      "Agendar reunião gratuita",
    micro:    "30 min. Sem compromisso. Você sai com diagnóstico das suas campanhas.",
    link:     "#formulario",
  },

  // ── Formulário ───────────────────────────────────────────────
  formulario: {
    // ⚠️ IMPORTANTE: Webhook NUNCA deve estar aqui!
    // Deve ser chamado via API backend: POST /api/forms/submit
    categorias: ["Infantil", "Fund. I", "Fund. II", "Ensino Médio"],
    apiEndpoint: "https://minerva-production-3979.up.railway.app/api/forms/submit", // Endpoint seguro no backend
  },
};

// Validação básica (evita erros se alguém editar CONFIG)
if (typeof CONFIG !== 'object') throw new Error('CONFIG não é um objeto válido');
if (!CONFIG.empresa?.nome) throw new Error('CONFIG.empresa.nome é obrigatório');
