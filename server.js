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

  if (!data.nome || data.nome.trim().length < 3) {
    errors.push('Nome deve ter pelo menos 3 caracteres');
  }

  if (!data.escola || data.escola.trim().length < 2) {
    errors.push('Nome da escola inválido');
  }

  if (!data.whatsapp || data.whatsapp.replace(/\D/g, '').length < 10) {
    errors.push('WhatsApp inválido');
  }

  if (!data.cidade || data.cidade.trim().length < 2) {
    errors.push('Cidade inválida');
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
  nome:      sanitizeString(req.body.nome),
  escola:    sanitizeString(req.body.escola),
  categoria: sanitizeString(req.body.categoria || ''),
  cidade:    sanitizeString(req.body.cidade),
  alunos:    parseInt(String(req.body.alunos).replace(/\D/g, '')) || 0,
  whatsapp:  req.body.whatsapp.replace(/\D/g, ''),
  origem:    sanitizeString(req.body.origem || 'Site Minerva'),
  data:      sanitizeString(req.body.data || ''),
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

