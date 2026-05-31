'use strict';

// lib/phone.js — Minerva Digital
// Validação e normalização de telefone brasileiro (CommonJS)

const DDDS_VALIDOS = new Set([
  11,12,13,14,15,16,17,18,19,
  21,22,24,27,28,
  31,32,33,34,35,37,38,
  41,42,43,44,45,46,47,48,49,
  51,53,54,55,
  61,62,63,64,65,66,67,68,69,
  71,73,74,75,77,79,
  81,82,83,84,85,86,87,88,89,
  91,92,93,94,95,96,97,98,99,
]);

function soDigitos(valor) {
  return String(valor).replace(/\D/g, '');
}

function normalizarTelefone(telefone) {
  let digits = soDigitos(telefone);

  if (digits.startsWith('55') && digits.length > 11) {
    digits = digits.slice(2);
  }

  if (digits.length < 10 || digits.length > 11) return null;

  const ddd    = Number(digits.slice(0, 2));
  const numero = digits.slice(2);

  if (!DDDS_VALIDOS.has(ddd)) return null;

  const isCelular = numero.length === 9 && numero.startsWith('9');
  const isFixo    = numero.length === 8 && /^[2-8]/.test(numero);

  if (!isCelular && !isFixo) return null;

  return {
    e164:   `+55${ddd}${numero}`,
    ddd:    String(ddd).padStart(2, '0'),
    numero,
    tipo:   isCelular ? 'celular' : 'fixo',
  };
}

function validarTelefone(telefone) {
  if (!telefone || typeof telefone !== 'string') {
    return { valido: false, e164: null, tipo: null, whatsapp: 'invalido', mensagem: 'Telefone não informado.' };
  }

  const resultado = normalizarTelefone(telefone);

  if (!resultado) {
    return { valido: false, e164: null, tipo: null, whatsapp: 'invalido', mensagem: 'Número inválido. Verifique o DDD e os dígitos.' };
  }

  return {
    valido:   true,
    e164:     resultado.e164,
    tipo:     resultado.tipo,
    whatsapp: resultado.tipo === 'celular' ? 'alta' : 'baixa',
    mensagem: resultado.tipo === 'celular'
      ? 'Número válido — alta probabilidade de estar no WhatsApp.'
      : 'Número fixo — baixa probabilidade de estar no WhatsApp.',
  };
}

module.exports = { validarTelefone, normalizarTelefone };
