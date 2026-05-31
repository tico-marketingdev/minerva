# 🚀 PASSO A PASSO - IMPLEMENTAÇÃO COMPLETA

## 📍 Você está aqui
- ✅ Refatoração completada
- ✅ Arquivos separados criados
- ✅ Documentação completa
- 👉 **Agora: Implementação prática**

---

## 🎯 OBJETIVO FINAL
Ter um site seguro, funcional e pronto para produção com:
1. Frontend seguro (HTML/CSS/JS separados)
2. Backend seguro (Node.js + Express)
3. Webhook Make integrado
4. Formulário funcionando end-to-end

**Tempo total**: ~4 horas de trabalho

---

# FASE 1: TESTES LOCAIS (30 minutos)

## Passo 1.1: Abrir Terminal

Abra PowerShell no Windows:

```powershell
cd C:\Users\hewerton.ferreira\Desktop\Educacao_Skills\05_Site
```

## Passo 1.2: Iniciar Servidor Local

```powershell
python -m http.server 8000
```

**Esperado**: Mensagem como `Serving HTTP on 0.0.0.0 port 8000`

## Passo 1.3: Abrir Navegador

Cole na barra de endereço:
```
http://localhost:8000/index-novo.html
```

## Passo 1.4: Validar Carregamento

Abra DevTools (pressione `F12`) e vá para aba **Console**.

✅ **Checklist**:
- [ ] Página carrega normalmente
- [ ] **0 erros vermelhos** no console
- [ ] Todas as seções visíveis (nav, hero, propostas, footer)
- [ ] Clique no botão **"Comece Agora"** → formulário abre
- [ ] Formulário tem 4 passos

**Teste de Segurança**: No console, execute:
```javascript
console.log("Webhook exposto?", CONFIG.formulario.webhook);
console.log("API Endpoint:", CONFIG.formulario.apiEndpoint);
```

**Esperado**:
```
Webhook exposto? undefined (ou erro)
API Endpoint: /api/forms/submit
```

Se tudo passou ✅, continue para FASE 2.

---

# FASE 2: BACKEND NODEJS (2 horas)

## Passo 2.1: Inicializar Projeto Node

**Abra um NOVO terminal** (deixe o servidor local rodando no outro):

```powershell
cd C:\Users\hewerton.ferreira\Desktop\Educacao_Skills
mkdir backend
cd backend
npm init -y
```

**Esperado**: Arquivo `package.json` criado

## Passo 2.2: Instalar Dependências

```powershell
npm install express cors express-rate-limit axios dotenv
```

**Tempo**: ~2 minutos

**Pacotes instalados**:
- `express` — Framework web
- `cors` — Permitir requisições do frontend
- `express-rate-limit` — Proteger contra spam
- `axios` — Fazer requisições HTTP (chamar webhook)
- `dotenv` — Variáveis de ambiente (.env)

## Passo 2.3: Criar Arquivo `.env`

Crie arquivo `C:\Users\hewerton.ferreira\Desktop\Educacao_Skills\backend\.env`:

```env
NODE_ENV=development
PORT=3000
MAKE_WEBHOOK_URL=https://hook.us2.make.com/h8rfq7xc5kcq8g6lpwt6pvqw2j8hcu1n
CORS_ORIGINS=http://localhost:8000,http://localhost:3000
LOG_LEVEL=debug
```

⚠️ **IMPORTANTE**: Adicione `.env` ao `.gitignore`:

```
backend/.env
backend/node_modules/
backend/*.log
```

## Passo 2.4: Criar Arquivo `server.js`

Crie arquivo `C:\Users\hewerton.ferreira\Desktop\Educacao_Skills\backend\server.js`:

```javascript
// ═══════════════════════════════════════════════════════════════
// SERVIDOR SEGURO — Minerva Digital Form Handler
// ═══════════════════════════════════════════════════════════════

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const app = express();

// ─── Configurações ────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;
const CORS_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');

// ─── Middleware: CORS (Controle de Origem) ───────────────────
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || CORS_ORIGINS.includes(origin.trim())) {
      callback(null, true);
    } else {
      callback(new Error(`CORS não permitido: ${origin}`));
    }
  },
  credentials: true,
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// ─── Middleware: Rate Limiting (Proteção contra Spam) ────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 requisições por IP
  message: 'Muitas requisições. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ─── Funções Auxiliares ───────────────────────────────────────

// Validar email
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validar telefone (apenas dígitos, 10-11 números)
function isValidPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

// Sanitizar string (remover HTML)
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove < e >
    .substring(0, 100); // Limita a 100 caracteres
}

// Validar dados do formulário
function validateFormData(data) {
  const errors = [];

  // Nome
  if (!data.nome || data.nome.trim().length < 3) {
    errors.push('Nome deve ter pelo menos 3 caracteres');
  }

  // Email
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Email inválido');
  }

  // Telefone
  if (!data.telefone || !isValidPhone(data.telefone)) {
    errors.push('Telefone deve ter 10-11 dígitos');
  }

  // Empresa
  if (!data.empresa || data.empresa.trim().length < 2) {
    errors.push('Nome da empresa inválido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ─── ROTAS ────────────────────────────────────────────────────

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota POST: Receber formulário
app.post('/api/forms/submit', async (req, res) => {
  try {
    // Log da requisição
    console.log(`[${new Date().toISOString()}] Formulário recebido de: ${req.ip}`);
    console.log('Dados:', JSON.stringify(req.body, null, 2));

    // ─── VALIDAÇÃO ─────────────────────────────────
    const validation = validateFormData(req.body);
    if (!validation.isValid) {
      console.warn('Validação falhou:', validation.errors);
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: validation.errors,
      });
    }

    // ─── SANITIZAÇÃO ───────────────────────────────
    const sanitizedData = {
      nome: sanitizeString(req.body.nome),
      email: req.body.email.toLowerCase().trim(),
      telefone: req.body.telefone.replace(/\D/g, ''),
      empresa: sanitizeString(req.body.empresa),
      tipo: sanitizeString(req.body.tipo || ''),
      desafios: Array.isArray(req.body.desafios) 
        ? req.body.desafios.map(d => sanitizeString(d)) 
        : [],
      mensagem: sanitizeString(req.body.mensagem || ''),
      timestamp: new Date().toISOString(),
    };

    // ─── CHAMAR WEBHOOK MAKE ───────────────────────
    console.log('Enviando para Make webhook...');
    
    const makeResponse = await axios.post(WEBHOOK_URL, sanitizedData, {
      timeout: 10000, // 10 segundos de timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Make webhook respondeu com sucesso');

    // ─── RESPOSTA DE SUCESSO ───────────────────────
    res.status(200).json({
      success: true,
      message: 'Formulário enviado com sucesso!',
      id: makeResponse.data?.id || new Date().getTime(),
    });

  } catch (error) {
    // ─── TRATAMENTO DE ERROS ───────────────────────
    console.error('Erro ao processar formulário:', error.message);

    // Se o erro é do Make webhook
    if (error.response?.status) {
      return res.status(502).json({
        success: false,
        message: 'Erro ao enviar formulário. Tente novamente.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }

    // Erro genérico
    res.status(500).json({
      success: false,
      message: 'Erro interno. Tente novamente.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── INICIAR SERVIDOR ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   🚀 SERVIDOR INICIALIZADO COM SUCESSO        ║
╠════════════════════════════════════════════════╣
║   Porta: ${PORT}
║   Ambiente: ${process.env.NODE_ENV}
║   URL: http://localhost:${PORT}
║   Health: http://localhost:${PORT}/health
╚════════════════════════════════════════════════╝
  `);
});

// Tratamento de erro não capturado
process.on('unhandledRejection', (err) => {
  console.error('Erro não capturado:', err);
});
```

## Passo 2.5: Iniciar Backend

No terminal do backend:

```powershell
node server.js
```

**Esperado**: Mensagem como:
```
╔════════════════════════════════════════════════╗
║   🚀 SERVIDOR INICIALIZADO COM SUCESSO        ║
╠════════════════════════════════════════════════╣
║   Porta: 3000
...
```

---

## Passo 2.6: Testar Backend com Postman (ou curl)

Abra **Postman** (ou terminal novo) e faça uma requisição:

```powershell
# PowerShell
$body = @{
    nome = "João Silva"
    email = "joao@test.com"
    telefone = "(11) 98765-4321"
    empresa = "Tech Solutions"
    tipo = "SaaS"
    desafios = @("Marketing", "Growth")
    mensagem = "Interessado em parceria"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/forms/submit" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

**Esperado**: Resposta `200 OK` com:
```json
{
  "success": true,
  "message": "Formulário enviado com sucesso!",
  "id": 1234567890
}
```

✅ Se funcionou, o backend está pronto!

---

# FASE 3: INTEGRAÇÃO FRONTEND + BACKEND (1 hora)

## Passo 3.1: Atualizar `app.js` para Chamar Backend

Abra arquivo `C:\Users\hewerton.ferreira\Desktop\Educacao_Skills\05_Site\app.js`

Procure a função `setupFormulario()` (busque por **Ctrl+F** → `function setupFormulario`).

Encontre esta linha (por volta da linha 300):
```javascript
formularioEnvio.addEventListener('click', async () => {
```

**Substitua** todo o bloco de envio (de `formularioEnvio.addEventListener` até o `});` correspondente):

```javascript
formularioEnvio.addEventListener('click', async () => {
  // Coletar dados do formulário
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const telefone = document.getElementById('telefone').value;
  const empresa = document.getElementById('empresa').value;
  const tipo = document.getElementById('tipoCliente').value;
  const desafios = Array.from(document.querySelectorAll('input[name="desafios"]:checked'))
    .map(cb => cb.value);

  // Preparar dados
  const dados = {
    nome: sanitize.text(nome),
    email: email.toLowerCase().trim(),
    telefone,
    empresa: sanitize.text(empresa),
    tipo: sanitize.text(tipo),
    desafios,
    mensagem: sanitize.text(document.getElementById('mensagem')?.value || ''),
  };

  // Enviar para backend
  try {
    const response = await fetch('/api/forms/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // CSRF protection
      },
      body: JSON.stringify(dados),
    });

    const result = await response.json();

    if (response.ok) {
      // Sucesso!
      alert('✅ Formulário enviado com sucesso!');
      console.log('Resposta do servidor:', result);
      
      // Fechar modal
      formularioModal.style.display = 'none';
      
      // Limpar formulário
      formularioModal.querySelector('form')?.reset();
      
      // Voltar ao passo 1
      currentStep = 0;
      updateFormularioStep();
      
    } else {
      // Erro do servidor
      alert(`❌ Erro: ${result.message}\n\n${result.errors?.join('\n') || ''}`);
      console.error('Erro do servidor:', result);
    }

  } catch (error) {
    alert('❌ Erro ao conectar com servidor. Tente novamente.');
    console.error('Erro de rede:', error);
  }
});
```

## Passo 3.2: Testar Integração

1. **Terminal 1** (Servidor frontend): Continue rodando `python -m http.server 8000`
2. **Terminal 2** (Servidor backend): Continue rodando `node server.js`
3. **Navegador**: Acesse `http://localhost:8000/index-novo.html`

### Teste:
- [ ] Clique em **"Comece Agora"**
- [ ] Preencha o formulário (4 passos)
- [ ] Clique em **"Enviar"**
- [ ] Deve aparecer: ✅ **"Formulário enviado com sucesso!"**

Se funcionou ✅, continue para FASE 4.

---

# FASE 4: SETUP .GITIGNORE E GITHUB (30 minutos)

## Passo 4.1: Criar `.gitignore` na Raiz

Crie arquivo `C:\Users\hewerton.ferreira\Desktop\Educacao_Skills\.gitignore`:

```
# Ambiente
.env
.env.local
.env.*.local

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Sistema
.DS_Store
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
logs/

# Build
dist/
build/
.next/

# Backup
*.backup.html
index-old.html
```

## Passo 4.2: Inicializar Git (se ainda não fez)

```powershell
cd C:\Users\hewerton.ferreira\Desktop\Educacao_Skills
git init
git config user.name "Seu Nome"
git config user.email "seu-email@gmail.com"
```

## Passo 4.3: Primeiro Commit

```powershell
git add .
git commit -m "refactor: separação de código e implementação de segurança

- Refatorado index.html monolítico em 4 arquivos (HTML/CSS/JS/Config)
- Implementada sanitização contra XSS
- Webhook movido para backend
- Rate limiting implementado
- CSP headers adicionados
- Backend Node.js com Express + validação"
```

## Passo 4.4: Conectar ao GitHub

1. Crie repositório em https://github.com/new
2. Dê nome: `minerva-site`
3. **NÃO** inicializar com README (já temos files)
4. Clique em "Create repository"

5. No terminal:
```powershell
git remote add origin https://github.com/SEU_USUARIO/minerva-site.git
git branch -M main
git push -u origin main
```

---

# FASE 5: DEPLOY EM PRODUÇÃO (1 hora)

## Opção A: Railway (RECOMENDADO - Mais Fácil) 

### Passo 5.1: Criar Conta em Railway

Acesse https://railway.app/ e clique em **"Start Project"**

Use login com GitHub (é mais rápido).

### Passo 5.2: Novo Projeto

1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub"**
3. Conecte seu repositório `minerva-site`
4. Selecione **"backend"** como pasta do projeto

### Passo 5.3: Adicionar Variáveis de Ambiente

Na aba **"Variables"**, adicione:

```
NODE_ENV=production
PORT=3000
MAKE_WEBHOOK_URL=[cole aqui sua URL do Make webhook]
CORS_ORIGINS=https://minerva-digital.com,https://www.minerva-digital.com
LOG_LEVEL=info
```

### Passo 5.4: Deploy Automático

Railway vai fazer deploy automaticamente.

Aguarde ~5 minutos.

Você receberá uma URL: `https://seu-projeto.railway.app`

---

## Opção B: Render (Alternativa)

Acesse https://render.com, sign up, crie Web Service novo do GitHub.

Similiar ao Railway, mais um pouco mais manual.

---

## Passo 5.5: Atualizar Frontend para Chamar Backend

Abra `app.js` e procure:

```javascript
const response = await fetch('/api/forms/submit', {
```

**Substitua** por:

```javascript
const response = await fetch('https://seu-projeto.railway.app/api/forms/submit', {
```

(Troque `seu-projeto.railway.app` pela URL real que Railway forneceu)

## Passo 5.6: Deploy Frontend

Você pode:

**Opção 1**: Host estático (Recomendado)
- Usar Vercel (https://vercel.com)
- Conectar GitHub
- Deploy automático

**Opção 2**: Railway também hospeda frontend
- Mesma conta Railway
- Novo projeto, deploy pasta `05_Site`

**Opção 3**: Seu próprio servidor
- Upload via SFTP
- Usar nginx/Apache

---

## Passo 5.7: Teste End-to-End

1. Acesse seu site em produção (ex: https://minerva-digital.com)
2. Clique em **"Comece Agora"**
3. Preencha formulário
4. Clique em **"Enviar"**
5. Verifique se dados chegaram no Make webhook
6. Verifique se email foi enviado (se configurou)

---

# ✅ CHECKLIST FINAL

Marque os passos conforme completa:

### FASE 1: Testes Locais
- [ ] Servidor local rodando (python -m http.server 8000)
- [ ] index-novo.html carrega sem erros
- [ ] DevTools console limpo (0 erros)
- [ ] Formulário abre ao clicar CTA
- [ ] API Endpoint correto (/api/forms/submit)

### FASE 2: Backend
- [ ] npm install completado
- [ ] .env criado no backend
- [ ] server.js criado e testado
- [ ] Backend rodando em http://localhost:3000
- [ ] Health check funciona (GET /health)
- [ ] Teste Postman/curl funciona

### FASE 3: Integração
- [ ] app.js atualizado com novo código de envio
- [ ] Frontend rodando em http://localhost:8000
- [ ] Backend rodando em http://localhost:3000
- [ ] Teste end-to-end: formulário envia dados
- [ ] Make webhook recebeu dados com sucesso

### FASE 4: GitHub
- [ ] .gitignore criado
- [ ] Git inicializado
- [ ] Primeiro commit feito
- [ ] Repositório criado em GitHub
- [ ] Push para GitHub com sucesso

### FASE 5: Produção
- [ ] Conta em Railway/Render criada
- [ ] Backend feito deploy
- [ ] Frontend feito deploy
- [ ] URL de produção funciona
- [ ] Teste end-to-end em produção

---

# 🆘 TROUBLESHOOTING

## Problema: "ModuleNotFoundError: No module named 'http.server'"

**Solução**: Você está tentando usar Python 2. Use Python 3:
```powershell
python3 -m http.server 8000
# ou
python -m http.server 8000  # se Python 3 for default
```

---

## Problema: "Cannot find module 'express'"

**Solução**: Não rodou `npm install`. Execute:
```powershell
cd backend
npm install
```

---

## Problema: "CORS error" no navegador

**Solução**: `.env` backend com CORS_ORIGINS errado. Verifique:
```env
CORS_ORIGINS=http://localhost:8000,http://localhost:3000
```

---

## Problema: "Webhook não recebeu dados"

**Solução**: 
1. Verifique URL do webhook em `.env`
2. Teste com curl manualmente
3. Verifique logs do backend: `node server.js`

---

## Problema: "Não consigo fazer deploy"

**Solução**: 
1. `.env` tem que estar em `.gitignore` (não faça commit!)
2. `node_modules` tem que estar em `.gitignore`
3. Só fazer commit de: `server.js`, `package.json`, `package-lock.json`

---

# 🎯 ESTIMATIVA DE TEMPO

| Fase | Tarefa | Tempo |
|------|--------|-------|
| 1 | Testes locais | 30 min |
| 2 | Backend Node.js | 2h |
| 3 | Integração | 1h |
| 4 | GitHub | 30 min |
| 5 | Deploy produção | 1h 30 min |
| **TOTAL** | **COMPLETO** | **~5-6h** |

(Tempo varia dependendo de experiência com Node.js)

---

# 📞 PRÓXIMOS PASSOS

Após completar tudo:

1. **Monitorar erros**: Configure Sentry para alertas
2. **Analytics**: Implemente Google Analytics
3. **Email confirmação**: Setup SendGrid para confirmação
4. **Database**: Se precisar, adicione PostgreSQL
5. **Otimização**: Implemente cache, CDN, etc

---

**Pronto para começar? Comece pela FASE 1!** 🚀

Qualquer dúvida, consulte:
- `ANALISE_FALHAS.md` — Entender os problemas
- `IMPLEMENTACAO_SEGURA.md` — Detalhes técnicos
- `GUIA_TESTES_LOCAIS.md` — Como testar
- `CHECKLIST_PRE_DEPLOY.md` — Checklist completo
