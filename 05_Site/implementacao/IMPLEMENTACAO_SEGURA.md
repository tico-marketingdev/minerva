# 🔒 GUIA DE IMPLEMENTAÇÃO SEGURA

## Estrutura Arquivos Criados

```
05_Site/
├── index-novo.html          ✅ HTML limpo + CSP headers
├── styles.css               ✅ CSS externo (seguro)
├── config.js                ✅ Dados públicos
├── app.js                   ✅ Lógica segura (sem innerHTML direto)
├── .env.example             📋 Variáveis de ambiente
├── ANALISE_FALHAS.md        📋 Análise completa de problemas
└── index.html               ⚠️ ANTIGO (manter como backup)
```

---

## 🔐 Melhorias de Segurança Implementadas

### 1. **XSS Protection (Prevenção de injeção de código)**
- ❌ **ANTES**: `innerHTML` com template literals diretos
- ✅ **DEPOIS**: Função `sanitize.html()` que escapa caracteres perigosos

### 2. **Separação de Responsabilidades**
- ❌ **ANTES**: Tudo em 1 arquivo (1500+ linhas)
- ✅ **DEPOIS**: 
  - `index.html` — Estrutura apenas
  - `styles.css` — Estilos apenas
  - `config.js` — Dados públicos apenas
  - `app.js` — Lógica renderização + eventos

### 3. **Webhook Seguro**
- ❌ **ANTES**: Webhook Make exposto no frontend
- ✅ **DEPOIS**: 
  - Frontend faz POST para `/api/forms/submit` (backend)
  - Backend valida dados
  - Backend encaminha para Make (URL segura no servidor)

### 4. **Content Security Policy (CSP)**
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self';
  style-src 'self' https://fonts.googleapis.com;
  ...
">
```
- 🛡️ Bloqueia scripts inline
- 🛡️ Bloqueia XSS externo
- 🛡️ Bloqueia CORS não autorizado

### 5. **Sem Duplicação de Código**
- ❌ **ANTES**: Renderização executada 2x (linhas 943 e 1326)
- ✅ **DEPOIS**: Renderização executada 1x apenas (app.js)

---

## 📋 Próximos Passos: Backend (Node.js + Express)

### 1. Criar arquivo `/backend/routes/forms.js`

```javascript
const express = require('express');
const router = express.Router();
const axios = require('axios');

// ✅ Webhook Make SEGURO (só no backend)
const MAKE_WEBHOOK = process.env.MAKE_WEBHOOK_URL;

if (!MAKE_WEBHOOK) {
  throw new Error('MAKE_WEBHOOK_URL não configurada em .env');
}

// CSRF Protection: verificar origin
const isValidOrigin = (req) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://minerva-digital.com',
    'https://www.minerva-digital.com',
    'http://localhost:3000', // dev
  ];
  return allowedOrigins.includes(origin);
};

// Validação básica
const validateFormData = (data) => {
  const errors = [];
  
  if (!data.nome || data.nome.trim().length < 3) {
    errors.push('Nome deve ter no mínimo 3 caracteres');
  }
  if (!data.escola || data.escola.trim().length < 3) {
    errors.push('Escola deve ter no mínimo 3 caracteres');
  }
  if (!data.whatsapp || data.whatsapp.trim().length < 10) {
    errors.push('WhatsApp inválido');
  }
  
  return errors;
};

// POST /api/forms/submit
router.post('/submit', async (req, res) => {
  try {
    // ✅ 1. Validar CORS
    if (!isValidOrigin(req)) {
      return res.status(403).json({ error: 'Origin não autorizada' });
    }

    // ✅ 2. Validar dados
    const errors = validateFormData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // ✅ 3. Rate limiting (evitar spam)
    // TODO: Implementar Redis rate limiting

    // ✅ 4. Sanitizar dados
    const payload = {
      nome: req.body.nome.trim(),
      escola: req.body.escola.trim(),
      categoria: req.body.categoria.trim(),
      cidade: req.body.cidade.trim(),
      turmas: parseInt(req.body.turmas),
      whatsapp: req.body.whatsapp.trim(),
      origem: 'Site Minerva', // Hardcoded no backend (seguro)
      data: new Date().toLocaleString('pt-BR'),
      ip: req.ip, // Log para segurança
    };

    // ✅ 5. Enviar para Make (webhook seguro)
    const response = await axios.post(MAKE_WEBHOOK, payload, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Minerva Backend',
      },
    });

    // ✅ 6. Log para auditoria
    console.log(`[FORM] ${payload.nome} (${payload.whatsapp}) - ${payload.escola}`);

    // ✅ 7. Responder sucesso
    return res.status(200).json({ 
      success: true,
      message: 'Formulário recebido com sucesso' 
    });

  } catch (error) {
    console.error('Erro ao processar formulário:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar sua solicitação. Tente novamente.' 
    });
  }
});

module.exports = router;
```

### 2. Arquivo `.env` (não fazer commit no Git!)

```env
# ═════════════════════════════════════════════
# VARIÁVEIS DE AMBIENTE — NÃO FAZER COMMIT!
# ═════════════════════════════════════════════

# Backend
PORT=3000
NODE_ENV=production

# Make.com Webhook (SEGURO — só no backend)
MAKE_WEBHOOK_URL=https://hook.us2.make.com/h8rfq7xc5kcq8g6lpwt6pvqw2j8hcu1n

# CORS
CORS_ORIGINS=https://minerva-digital.com,https://www.minerva-digital.com

# Rate Limiting (Redis)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info
```

### 3. Arquivo `.gitignore`

```gitignore
# Variáveis de ambiente
.env
.env.local
.env.*.local

# Node modules
node_modules/
npm-debug.log

# Build
/dist
/build

# Editor
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
```

### 4. No `server.js` (Express app)

```javascript
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const formsRouter = require('./routes/forms');

const app = express();

// ✅ Segurança básica
app.set('trust proxy', 1);
app.use(express.json({ limit: '1kb' })); // Limite de payload
app.use(express.urlencoded({ limit: '1kb', extended: false }));

// ✅ CORS seguro
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(','),
  credentials: false,
  methods: ['GET', 'POST'],
  maxAge: 86400,
}));

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 requisições por IP
  message: 'Muitas requisições. Tente novamente em 15 minutos.',
});

app.use('/api/forms/submit', limiter);

// ✅ Headers de segurança
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// ✅ Rotas
app.use('/api/forms', formsRouter);

// ✅ Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server rodando em porta ${process.env.PORT || 3000}`);
});
```

---

## 🚀 Como Implementar

### Passo 1: Backup do antigo
```bash
cd 05_Site
cp index.html index-backup.html
cp index.html index-antigo.html
```

### Passo 2: Usar novo HTML
```bash
mv index-novo.html index.html
```

### Passo 3: Testar localmente
```bash
python -m http.server 8000
# Abrir http://localhost:8000
```

### Passo 4: Setup backend (se não tiver)
```bash
npm init -y
npm install express cors express-rate-limit axios
npm install --save-dev dotenv
```

### Passo 5: Criar `.env` (do exemplo acima)

### Passo 6: Deploy
- Fazer commit dos arquivos públicos (HTML, CSS, JS)
- **NÃO** fazer commit de `.env`
- Deploy do backend com `.env` via:
  - Railway
  - Render
  - Vercel
  - AWS Lambda

---

## ✅ Checklist de Segurança

- [x] Remover webhook do frontend
- [x] Remover duplicação de código
- [x] Adicionar CSP headers
- [x] Usar sanitização de HTML
- [x] Separar responsabilidades (HTML/CSS/JS)
- [x] Validação no backend
- [x] Rate limiting
- [ ] CORS seguro
- [ ] HTTPS obrigatório
- [ ] Logging de auditoria
- [ ] Testes de segurança automatizados
- [ ] Monitoramento de erros (Sentry)

---

## 📚 Referências

- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [CWE-79: Improper Neutralization of Input During Web Page Generation](https://cwe.mitre.org/data/definitions/79.html)

---

## ❓ Dúvidas?

Se tiver dúvidas sobre a implementação, consulte:
- ANALISE_FALHAS.md — Detalhes dos problemas encontrados
- Este arquivo — Instruções de correção
- config.js — Como estruturar dados públicos
- app.js — Como renderizar sem XSS

