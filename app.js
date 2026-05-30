// ═══════════════════════════════════════════════════════════════
// APP.JS — Lógica de Renderização e Eventos (SEGURA)
// ═══════════════════════════════════════════════════════════════

// ── Utilitário: Escapar HTML para evitar XSS ──────────────────
const sanitize = {
  // Escapa HTML especial
  html(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },
  // Apenas texto (total segurança)
  text(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.textContent;
  },
};

function validarWhatsApp(numero) {
  const limpo = numero.replace(/\D/g, '');
  // DDD (2 dígitos) + 9 números (móvel) ou 8 números (fixo)
  return /^\d{2}(9\d{8}|\d{8})$/.test(limpo);
}

function applyPhoneMask(value) {
  const digits = value.replace(/\D/g, '').substring(0, 11);
  const len = digits.length;
  if (len === 0) return '';
  if (len <= 2) return `(${digits}`;
  if (len <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  if (len === 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
}

// ── Inicializar quando DOM estiver pronto ─────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (typeof CONFIG === 'undefined') {
    console.error('CONFIG não carregado. Certifique-se de incluir config.js antes de app.js');
    return;
  }

  // Título da página
  document.title = `${sanitize.text(CONFIG.empresa.nome)} — ${sanitize.text(CONFIG.empresa.slogan)}`;

  // Renderizar uma única vez, sem duplicação
  renderAll();
  setupFormulario();
  setupAnimacoes();
});

// ═══════════════════════════════════════════════════════════════
// RENDERIZAÇÃO SEGURA (sem innerHTML direto com dados do usuário)
// ═══════════════════════════════════════════════════════════════

function renderAll() {
  renderNav();
  renderHero();
  renderLogos();
  renderProposta();
  renderIA();
  renderAcompanhamento();
  renderCiclo();
  renderServicos();
  renderComparativo();
  renderCase();
  renderCTA();
  renderFooter();
}

// NAV
function renderNav() {
  const nav = document.getElementById('nav-placeholder');
  nav.innerHTML = ''; // Limpar
  
  const a = document.createElement('a');
  a.href = '#';
  a.className = 'nav-logo';
  a.innerHTML = `<span class="nav-logo-bar"></span>${sanitize.html(CONFIG.empresa.nome)}<span>.</span>`;
  nav.appendChild(a);

  const ul = document.createElement('ul');
  CONFIG.nav.forEach(item => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.texto;
    li.appendChild(link);
    ul.appendChild(li);
  });
  nav.appendChild(ul);

  const cta = document.createElement('a');
  cta.href = CONFIG.empresa.cta_link;
  cta.className = 'nav-cta';
  cta.textContent = 'Agendar Reunião';
  nav.appendChild(cta);
}

// HERO
function renderHero() {
  const h = CONFIG.hero;
  
  // Hero Content
  const heroContent = document.getElementById('hero-content-placeholder');
  heroContent.innerHTML = '';
  
  const tag = document.createElement('span');
  tag.className = 'hero-tag';
  tag.textContent = h.tag;
  heroContent.appendChild(tag);

  const h1 = document.createElement('h1');
  h1.innerHTML = h.titulo; // innerHTML ok aqui porque texto é do CONFIG, não do usuário
  heroContent.appendChild(h1);

  const sub = document.createElement('p');
  sub.className = 'hero-sub';
  sub.textContent = h.subtitulo;
  heroContent.appendChild(sub);

  const actions = document.createElement('div');
  actions.className = 'hero-actions';
  
  const btnPrim = document.createElement('a');
  btnPrim.href = h.btn_primario.href;
  btnPrim.className = 'btn-primary';
  btnPrim.textContent = h.btn_primario.texto;
  actions.appendChild(btnPrim);

  const btnSec = document.createElement('a');
  btnSec.href = h.btn_secundario.href;
  btnSec.className = 'btn-ghost';
  btnSec.textContent = h.btn_secundario.texto;
  actions.appendChild(btnSec);

  heroContent.appendChild(actions);

  // Métricas
  const metrics = document.createElement('div');
  metrics.className = 'hero-metrics';
  h.metricas.forEach(m => {
    const metric = document.createElement('div');
    metric.className = 'hero-metric';
    metric.innerHTML = `
      <span class="hero-metric-num">${sanitize.html(m.num)}</span>
      <div class="hero-metric-label">${sanitize.html(m.label)}</div>
    `;
    metrics.appendChild(metric);
  });
  heroContent.appendChild(metrics);

  // Phone Mockup
  const heroRight = document.getElementById('hero-right-placeholder');
  heroRight.innerHTML = `
    <div class="phone-wrap">
      <div class="phone">
        <div class="phone-notch"></div>
        <div class="phone-header">📲 ${sanitize.html(CONFIG.empresa.nome)} · Resumo do dia</div>
        <div class="phone-msg">
          <div class="phone-msg-label">${sanitize.html(h.phone.escola)} · Hoje, ${sanitize.html(h.phone.hora)}</div>
          <p>${h.phone.mensagem}</p>
        </div>
        <div class="phone-stats">
          ${h.phone.stats.map(s => `
            <div class="phone-stat">
              <span class="phone-stat-num">${sanitize.html(s.num)}</span>
              <span class="phone-stat-label">${sanitize.html(s.label)}</span>
            </div>
          `).join('')}
        </div>
        <div class="phone-divider"></div>
        <div class="phone-chip">IA · Operação normal</div>
      </div>
    </div>
  `;
}

// LOGOS
function renderLogos() {
  const el = document.getElementById('logos-placeholder');
  el.innerHTML = '<span class="logos-label">Escolas atendidas</span>';
  
  const track = document.createElement('div');
  track.className = 'logos-track';
  
  CONFIG.clientes.forEach(c => {
    const pill = document.createElement('div');
    pill.className = 'logo-pill';
    pill.textContent = c;
    track.appendChild(pill);
  });
  
  el.appendChild(track);
}

// PROPOSTA
function renderProposta() {
  const p = CONFIG.proposta;
  const el = document.getElementById('proposta-placeholder');
  el.innerHTML = '';

  const left = document.createElement('div');
  const tag = document.createElement('span');
  tag.className = 'section-tag';
  tag.textContent = p.tag;
  left.appendChild(tag);

  const h2 = document.createElement('h2');
  h2.innerHTML = p.titulo;
  left.appendChild(h2);

  p.textos.forEach(t => {
    const txt = document.createElement('p');
    txt.textContent = t;
    left.appendChild(txt);
  });

  el.appendChild(left);

  // Cards
  const cards = document.createElement('div');
  cards.className = 'proposta-cards';
  
  p.cards.forEach(c => {
    const card = document.createElement('div');
    card.className = 'proposta-card';
    card.innerHTML = `
      <div class="proposta-card-icon">${c.icone}</div>
      <div>
        <h3>${sanitize.html(c.titulo)}</h3>
        <p>${sanitize.html(c.texto)}</p>
      </div>
    `;
    cards.appendChild(card);
  });
  
  el.appendChild(cards);
}

// IA
function renderIA() {
  const ia = CONFIG.ia;
  const el = document.getElementById('ia-placeholder');
  el.innerHTML = '';

  const tag = document.createElement('span');
  tag.className = 'section-tag';
  tag.textContent = ia.tag;
  el.appendChild(tag);

  const h2 = document.createElement('h2');
  h2.innerHTML = ia.titulo;
  el.appendChild(h2);

  const sub = document.createElement('p');
  sub.className = 'ia-subtitle';
  sub.textContent = ia.subtitulo;
  el.appendChild(sub);

  const grid = document.createElement('div');
  grid.className = 'ia-grid';
  
  ia.cards.forEach(c => {
    const card = document.createElement('div');
    card.className = 'ia-card';
    card.innerHTML = `
      <div class="ia-card-num">${sanitize.html(c.num)}</div>
      <h3>${sanitize.html(c.titulo)}</h3>
      <p>${sanitize.html(c.texto)}</p>
      <ul>
        ${c.bullets.map(b => `<li>${sanitize.html(b)}</li>`).join('')}
      </ul>
    `;
    grid.appendChild(card);
  });
  
  el.appendChild(grid);
}

// ACOMPANHAMENTO
function renderAcompanhamento() {
  const ac = CONFIG.acompanhamento;
  const el = document.getElementById('acomp-placeholder');
  el.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'acomp-header';
  header.innerHTML = `
    <span class="section-tag">${sanitize.html(ac.tag)}</span>
    <h2>${ac.titulo}</h2>
    <p>${sanitize.html(ac.subtitulo)}</p>
  `;
  el.appendChild(header);

  const timeline = document.createElement('div');
  timeline.className = 'acomp-timeline';
  
  ac.itens.forEach((i, idx) => {
    const item = document.createElement('div');
    item.className = 'acomp-item';
    item.innerHTML = `
      <div class="acomp-freq">${i.freq}</div>
      <h3>${sanitize.html(i.titulo)}</h3>
      <p>${sanitize.html(i.texto)}</p>
      <ul class="acomp-bullets">
        ${i.bullets.map(b => `<li>${sanitize.html(b)}</li>`).join('')}
      </ul>
    `;
    timeline.appendChild(item);
  });
  
  el.appendChild(timeline);

  // Highlight
  const highlight = document.createElement('div');
  highlight.className = 'acomp-highlight';
  highlight.innerHTML = `
    <div class="acomp-highlight-icon">📱</div>
    <div>
      <h3>${sanitize.html(ac.highlight.titulo)}</h3>
      <p>${sanitize.html(ac.highlight.texto)}</p>
    </div>
    <div class="msg-preview">${ac.highlight.mensagem}</div>
  `;
  el.appendChild(highlight);
}

// CICLO (simplificado)
function renderCiclo() {
  const ciclo = CONFIG.ciclo;
  const el = document.getElementById('ciclo-placeholder');
  el.innerHTML = `
    <span class="section-tag">${sanitize.html(ciclo.tag)}</span>
    <h2>${ciclo.titulo}</h2>
    <p class="ciclo-subtitulo">${sanitize.html(ciclo.subtitulo)}</p>
    <div class="ciclo-grid">
      ${ciclo.periodos.map(per => `
        <div class="ciclo-card">
          <div class="ciclo-trimestre">${sanitize.html(per.trimestre)}</div>
          <h3 class="ciclo-card-titulo">${sanitize.html(per.titulo)}</h3>
          <p class="ciclo-card-acao">${sanitize.html(per.acao)}</p>
          <p class="ciclo-card-budget">${sanitize.html(per.budget)}</p>
        </div>
      `).join('')}
    </div>
  `;
}

// SERVIÇOS
function renderServicos() {
  const srv = CONFIG.servicos;
  const el = document.getElementById('servicos-placeholder');
  el.innerHTML = `
    <span class="section-tag">${sanitize.html(srv.tag)}</span>
    <h2>${srv.titulo}</h2>
    <div class="servicos-grid">
      ${srv.cards.map(c => `
        <div class="servico-card">
          <div class="servico-icon">${c.icone}</div>
          <h3>${sanitize.html(c.titulo)}</h3>
          <p>${sanitize.html(c.texto)}</p>
        </div>
      `).join('')}
    </div>
  `;
}

// COMPARATIVO
function renderComparativo() {
  const comp = CONFIG.comparativo;
  const el = document.getElementById('comparativo-placeholder');
  el.innerHTML = `
    <span class="section-tag">${sanitize.html(comp.tag)}</span>
    <h2>${comp.titulo}</h2>
    <div class="comp-table">
      <div class="comp-row header">
        <div class="comp-cell"></div>
        <div class="comp-cell">Agência Generalista</div>
        <div class="comp-cell">${sanitize.html(CONFIG.empresa.nome)}</div>
      </div>
      ${comp.linhas.map(l => `
        <div class="comp-row">
          <div class="comp-cell comp-criterio">${sanitize.html(l.criterio)}</div>
          <div class="comp-cell">${sanitize.html(l.agencia)}</div>
          <div class="comp-cell comp-destaque">${sanitize.html(l.minerva)}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// CASE
function renderCase() {
  const cs = CONFIG.case;
  const el = document.getElementById('case-placeholder');
  el.innerHTML = `
    <div class="case-inner">
      <div>
        <span class="case-label">${sanitize.html(cs.tag)}</span>
        <h3>${cs.titulo}</h3>
        <p>${sanitize.html(cs.texto)}</p>
        <p style="margin-top: 1.5rem; font-size: 0.8rem; color: rgba(255,255,255,0.35); font-weight: 300;">
          ${sanitize.html(cs.rodape)}
        </p>
      </div>
      <div class="case-metrics">
        ${cs.metricas.map(m => `
          <div class="case-metric">
            <span class="case-metric-num">${sanitize.html(m.num)}</span>
            <span class="case-metric-label">${sanitize.html(m.label)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// CTA
function renderCTA() {
  const cta = CONFIG.cta;
  const el = document.getElementById('cta-placeholder');
  el.innerHTML = `
    <h2>${cta.titulo}</h2>
    <p>${sanitize.html(cta.subtitulo)}</p>
    <a href="${cta.link}" class="btn-white">${sanitize.html(cta.btn)}</a>
    <div class="cta-micro">${sanitize.html(cta.micro)}</div>
  `;
}

// FOOTER
function renderFooter() {
  const el = document.getElementById('footer-placeholder');
  el.innerHTML = `
    <div class="footer-logo"><span class="nav-logo-bar"></span>${sanitize.html(CONFIG.empresa.nome)}<span>.</span></div>
    <p>&copy; ${sanitize.text(CONFIG.empresa.ano)} ${sanitize.text(CONFIG.empresa.nome)}. Todos os direitos reservados.</p>
  `;
}

// ═══════════════════════════════════════════════════════════════
// FORMULÁRIO WIZARD
// ═══════════════════════════════════════════════════════════════

function setupFormulario() {
  const passos = [
    { campo: 'nome',   tipo: 'text',        pergunta: 'Qual é o seu nome?',           placeholder: 'Maria Silva',       dica: 'Responsável pelo contato' },
    { campo: 'escola', tipo: 'text',        pergunta: 'Nome da escola?',              placeholder: 'Colégio São Paulo', dica: '' },
    { campo: 'cat',    tipo: 'multiselect', pergunta: 'Categoria da escola?',         opcoes: CONFIG.formulario.categorias, dica: 'Pode selecionar mais de uma' },
    { campo: 'cidade', tipo: 'text',        pergunta: 'Em qual cidade?',              placeholder: 'São Paulo',         dica: '' },
    { campo: 'alunos', tipo: 'number',      pergunta: 'Quantos alunos a escola tem?', placeholder: '250',                dica: 'Número aproximado está ótimo' },
    { campo: 'zap',    tipo: 'tel',         pergunta: 'Qual é o seu WhatsApp?',       placeholder: '(11) 9 9999-8888',  dica: 'Entraremos em contato por aqui' },
  ];

  let atual = 0;
  const dados = {};
  const wizard = document.getElementById('form-wizard');

  function dots() {
    return passos.map((_, i) =>
      `<div class="form-dot ${i === atual ? 'ativo' : i < atual ? 'feito' : ''}"></div>`
    ).join('');
  }

  function render() {
    const p = passos[atual];
    let corpo = '';

    if (p.tipo === 'multiselect') {
      corpo = `<div class="form-pills" id="form-pills">
        ${p.opcoes.map(o => `
          <button type="button" class="form-pill ${(dados[p.campo] || []).includes(o) ? 'selecionado' : ''}" data-val="${sanitize.html(o)}">${sanitize.html(o)}</button>
        `).join('')}
      </div>`;
    } else {
      corpo = `<input class="form-input" id="form-campo" type="${p.tipo}" placeholder="${sanitize.html(p.placeholder)}" value="${sanitize.html(dados[p.campo] || '')}" autocomplete="off">`;
    }

    wizard.innerHTML = `
      <div class="form-progress">${dots()}</div>
      <div class="form-pergunta">${sanitize.html(p.pergunta)}</div>
      ${corpo}
      ${p.dica ? `<p class="form-hint">${sanitize.html(p.dica)}</p>` : ''}
      <div class="form-actions">
        ${atual > 0 ? `<button type="button" class="form-btn-voltar" id="form-voltar">← Voltar</button>` : ''}
        <button type="button" class="form-btn-avancar" id="form-avancar">
          ${atual === passos.length - 1 ? 'Enviar' : 'Continuar →'}
        </button>
      </div>
    `;

    // Event listeners
if (p.tipo === 'multiselect') {
  document.querySelectorAll('.form-pill').forEach(pill => {
    pill.addEventListener('click', function() {
      this.classList.toggle('selecionado');
      if (!dados[p.campo]) dados[p.campo] = [];
      const val = this.dataset.val;
      if (this.classList.contains('selecionado')) {
        if (!dados[p.campo].includes(val)) dados[p.campo].push(val);
      } else {
        dados[p.campo] = dados[p.campo].filter(v => v !== val);
      }
    });
  });
} else {
  const input = document.getElementById('form-campo');

  // Máscara de telefone
  if (p.campo === 'zap') {
    input.addEventListener('input', () => {
      const masked = applyPhoneMask(input.value);
      input.value = masked;
    });
  }

  // Enter para avançar
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('form-avancar').click();
    }
  });

  input.focus();
}

    document.getElementById('form-avancar').addEventListener('click', () => {
      const campo = p.campo;
      
      if (p.tipo === 'multiselect') {
        if (!dados[campo] || dados[campo].length === 0) {
          alert('Selecione pelo menos uma opção');
          return;
        }
      } else {
       const val = document.getElementById('form-campo')?.value?.trim();
        if (!val) {
          alert('Preencha este campo');
          return;
        }
        if (campo === 'zap' && !validarWhatsApp(val)) {
          alert('Informe um WhatsApp válido: DDD + 9 números (móvel) ou DDD + 8 números (fixo)');
          return;
        }
       dados[campo] = sanitize.text(val);
      }

      atual++;
      if (atual === passos.length) {
        enviarFormulario();
      } else {
        render();
      }
    });

    if (atual > 0) {
      document.getElementById('form-voltar').addEventListener('click', () => {
        atual--;
        render();
      });
    }
  }

  function enviarFormulario() {
    const payload = {
      nome: dados.nome,
      escola: dados.escola,
      categoria: (dados.cat || []).join(', '),
      cidade: dados.cidade,
      alunos: parseInt(String(dados.alunos || '0').replace(/\D/g, '')) || 0,
      whatsapp: dados.zap,
      origem: 'Site Minerva',
      data: new Date().toLocaleString('pt-BR'),
    };

    // ✅ SEGURO: Chama endpoint no backend, NÃO direto para Make
    fetch(CONFIG.formulario.apiEndpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // CSRF protection
      },
      body: JSON.stringify(payload),
    })
    .then(r => r.json())
    .then(d => {
      const primeiro = dados.nome ? dados.nome.split(' ')[0] : '';
      wizard.innerHTML = `
        <div class="form-sucesso">
          <div class="form-sucesso-check">✓</div>
          <h3>Recebido, ${sanitize.html(primeiro)}.</h3>
          <p>Entraremos em contato pelo WhatsApp em breve.<br>Geralmente respondemos no mesmo dia.</p>
        </div>
      `;
    })
    .catch(e => {
      console.error('Erro ao enviar formulário:', e);
      alert('Erro ao enviar. Tente novamente ou envie um WhatsApp');
      atual--;
      render();
    });
  }

  render();
}

// ═══════════════════════════════════════════════════════════════
// ANIMAÇÕES
// ═══════════════════════════════════════════════════════════════

function setupAnimacoes() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}

// ── Scroll seguro (evita XSS) ─────────────────────────────────
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname);
}
