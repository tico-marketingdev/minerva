// SERVIDOR SEGURO — Minerva Digital Form Handler
// ═══════════════════════════════════════════════════════════════

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const axios      = require('axios');

// ── [1/3] IMPORTA A LIB DE VALIDAÇÃO ─────────────────────────
const { validarTelefone } = require('./lib/phone');

const app = express();

// ─── Configurações ────────────────────────────────────────────
const PORT        = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;
const CORS_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');

// ─── Middleware: CORS ─────────────────────────────────────────
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

// ─── Middleware: Rate Limiting ────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Muitas requisições. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ─── Funções Auxiliares ───────────────────────────────────────

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '').substring(0, 100);
}

// ── [2/3] VALIDATEFORMDATA — usa lib/phone no lugar de isValidPhone ──
function validateFormData(data) {
  const errors = [];
  let telefoneValidado = null;

  if (!data.nome || data.nome.trim().length < 3) {
    errors.push('Nome deve ter pelo menos 3 caracteres');
  }

  if (!data.escola || data.escola.trim().length < 2) {
    errors.push('Nome da escola inválido');
  }

  if (!data.cidade || data.cidade.trim().length < 2) {
    errors.push('Cidade inválida');
  }

  // Validação de telefone com DDD real + normalização E.164
  const phoneResult = validarTelefone(data.whatsapp || '');
  if (!phoneResult.valido) {
    errors.push(phoneResult.mensagem);
  } else {
    telefoneValidado = phoneResult;
  }

  return {
    isValid: errors.length === 0,
    errors,
    telefoneValidado, // { e164, tipo, whatsapp: "alta"|"baixa" }
  };
}

// ─── ROTAS ────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/forms/submit', async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] Formulário recebido de: ${req.ip}`);
    console.log('Dados:', JSON.stringify(req.body, null, 2));

    // ─── VALIDAÇÃO ──────────────────────────────────────────
    const validation = validateFormData(req.body);
    if (!validation.isValid) {
      console.warn('Validação falhou:', validation.errors);
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: validation.errors,
      });
    }

    // ── [3/3] SANITIZAÇÃO — inclui campos normalizados do telefone ──
    const { telefoneValidado } = validation;

    const sanitizedData = {
      nome:               sanitizeString(req.body.nome),
      escola:             sanitizeString(req.body.escola),
      categoria:          sanitizeString(req.body.categoria || ''),
      cidade:             sanitizeString(req.body.cidade),
      alunos:             parseInt(String(req.body.alunos).replace(/\D/g, '')) || 0,
      whatsapp:           telefoneValidado.e164,           // "+5511999999999" (E.164)
      whatsapp_original:  String(req.body.whatsapp).trim(), // o que o usuário digitou
      whatsapp_provavel:  telefoneValidado.whatsapp,       // "alta" | "baixa"
      tipo_telefone:      telefoneValidado.tipo,           // "celular" | "fixo"
      origem:             sanitizeString(req.body.origem || 'Site Minerva'),
      data:               sanitizeString(req.body.data || ''),
      timestamp:          new Date().toISOString(),
    };

    // ─── CHAMAR WEBHOOK MAKE ────────────────────────────────
    console.log('Enviando para Make webhook...');

    const makeResponse = await axios.post(WEBHOOK_URL, sanitizedData, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Make webhook respondeu com sucesso');

    res.status(200).json({
      success: true,
      message: 'Formulário enviado com sucesso!',
      id: makeResponse.data?.id || new Date().getTime(),
    });

  } catch (error) {
    console.error('Erro ao processar formulário:', error.message);

    if (error.response?.status) {
      return res.status(502).json({
        success: false,
        message: 'Erro ao enviar formulário. Tente novamente.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }

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

process.on('unhandledRejection', (err) => {
  console.error('Erro não capturado:', err);
});
