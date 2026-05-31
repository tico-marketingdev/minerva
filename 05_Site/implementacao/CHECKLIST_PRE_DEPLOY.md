# ✅ CHECKLIST PRE-DEPLOY

## 🎯 Objetivo
Verificar se todos os itens de segurança, performance e funcionalidade estão prontos antes de fazer deploy em produção.

---

## 📋 FASE 1: Preparação de Arquivos

### Frontend (HTML/CSS/JavaScript)
- [ ] `index-novo.html` testado localmente sem erros
- [ ] `styles.css` carregando corretamente
- [ ] `config.js` com dados públicos apenas
- [ ] `app.js` com sanitização implementada
- [ ] Todos os 4 arquivos no mesmo diretório
- [ ] Nenhum arquivo antigo conflitando (backup index.html com outro nome)

### Variáveis de Ambiente
- [ ] `.env.example` criado (como referência)
- [ ] `.env` real criado (NUNCA fazer commit!)
- [ ] `.gitignore` contém `.env`
- [ ] `.gitignore` contém `node_modules/`
- [ ] `.gitignore` contém `*.log`
- [ ] `.gitignore` contém `.DS_Store`

### Backend (Node.js)
- [ ] `package.json` criado
- [ ] Dependências instaladas: `express`, `cors`, `express-rate-limit`, `axios`, `dotenv`
- [ ] `server.js` ou `app.js` implementado (usar IMPLEMENTACAO_SEGURA.md como referência)
- [ ] Rota `/api/forms/submit` implementada
- [ ] Validação de CORS implementada
- [ ] Rate limiting configurado
- [ ] Webhook Make chamado do backend (NUNCA do frontend!)

---

## 🔐 FASE 2: Validação de Segurança

### XSS Prevention
- [ ] `sanitize.html()` usado em todos os innerHTML
- [ ] Nenhum template literal direto em innerHTML
- [ ] `textContent` usado para texto puro (não HTML)
- [ ] Teste: Verificar no DevTools que `typeof sanitize.html === 'function'`

### Webhook Segurança
- [ ] Webhook Make **NÃO** aparece no `config.js`
- [ ] Webhook Make **APENAS** em `.env` (servidor)
- [ ] Frontend usa `/api/forms/submit` (backend)
- [ ] Backend valida origem da requisição (CORS)
- [ ] Teste: `console.log(CONFIG.formulario.apiEndpoint)` → `/api/forms/submit`

### CSP Headers
- [ ] Content-Security-Policy presente em index-novo.html
- [ ] CSP permite scripts apenas de `'self'`
- [ ] CSP permite styles apenas de `'self'`
- [ ] DevTools: Nenhum aviso de CSP violation
- [ ] Teste: `curl -I http://localhost/` → CSP header presente

### CORS Seguro
- [ ] Backend valida `Origin` header
- [ ] Backend retorna `Access-Control-Allow-Origin`
- [ ] CORS permite APENAS domínios da sua empresa
- [ ] Teste: Requisição de origin inválida → erro 403

### Rate Limiting
- [ ] Rate limit configurado no backend (ex: 5 req/15min por IP)
- [ ] Redis conectado (ou memory fallback)
- [ ] Teste: 6+ requisições rápidas → 429 Too Many Requests

### Validação de Dados
- [ ] Backend valida tipo de cada campo
- [ ] Backend sanitiza strings (trim, remove HTML)
- [ ] Backend rejeita dados malformados
- [ ] Teste: Enviar JSON inválido → erro 400

### HTTPS Força
- [ ] Certificado SSL válido no servidor
- [ ] HTTP redireciona para HTTPS
- [ ] HSTS header presente (Strict-Transport-Security)
- [ ] Mixed content bloqueado (sem http:// em HTTPS)

---

## ⚡ FASE 3: Performance

### Carregamento de Página
- [ ] Página carrega em < 2 segundos (inicial)
- [ ] First Paint < 1s
- [ ] DevTools Lighthouse score > 80
- [ ] Nenhum layout shift detectável

### Otimização de Recursos
- [ ] Imagens otimizadas (< 100KB cada)
- [ ] CSS minificado (ou usar build tool)
- [ ] JavaScript minificado (ou usar build tool)
- [ ] Config.js não repetido em múltiplos arquivos
- [ ] Cache headers configurados (Cache-Control)

### Monitoramento
- [ ] Sentry DSN configurado em `.env`
- [ ] Logs de erro sendo enviados para Sentry
- [ ] Analytics configurado (Google Analytics ou similar)
- [ ] Health check endpoint `/health` implementado

---

## 🧪 FASE 4: Testes Funcionais

### Formulário Completo
- [ ] Formulário abre ao clicar CTA
- [ ] Passo 1: Validação de campos (obrigatório)
- [ ] Passo 2: Seleção de tipo funciona
- [ ] Passo 3: Checkboxes de desafios funcionam
- [ ] Passo 4: Resumo mostra dados corretos
- [ ] Botão Enviar chama `/api/forms/submit`
- [ ] Resposta de sucesso exibida
- [ ] Resposta de erro exibida

### Validação Frontend
- [ ] Email com formato inválido rejeitado
- [ ] Telefone com menos de 10 dígitos rejeitado
- [ ] Nome vazio rejeita (campo obrigatório)
- [ ] Mensagens de erro claras (UX)

### Validação Backend
- [ ] Email duplicado rejeitado (se aplicável)
- [ ] Telefone inválido rejeitado
- [ ] Campos obrigatórios verificados
- [ ] SQL Injection impossível (usar parametrized queries)
- [ ] Campo name rejeita caracteres HTML

### Integração Make
- [ ] Webhook Make recebe dados corretamente
- [ ] Webhook Make executa ação esperada
- [ ] Email de confirmação enviado ao lead
- [ ] Lead aparece no banco de dados (se usar)
- [ ] Testes com Postman: POST `/api/forms/submit`

### Regressão Navegadores
- [ ] Chrome 90+ ✅
- [ ] Firefox 88+ ✅
- [ ] Safari 14+ ✅
- [ ] Edge 90+ ✅
- [ ] Mobile Safari (iOS) ✅
- [ ] Chrome Mobile (Android) ✅

---

## 📦 FASE 5: Deploy e Configuração

### Preparação do Servidor
- [ ] Node.js v14+ instalado
- [ ] npm ou yarn disponível
- [ ] Espaço em disco suficiente (> 500MB)
- [ ] Logs em `/var/log/minerva/` (ou similar)
- [ ] Backup automático configurado

### Variáveis de Ambiente (Produção)
- [ ] `NODE_ENV=production` ✅
- [ ] `MAKE_WEBHOOK_URL` preenchida ✅
- [ ] `CORS_ORIGINS` com domínios produção ✅
- [ ] `PORT` não é 3000 (usar 8080+ ou variável) ✅
- [ ] `REDIS_URL` configurada (ou comentada para memory)
- [ ] `SENTRY_DSN` preenchida ✅
- [ ] `JWT_SECRET` com 32+ caracteres aleatórios ✅
- [ ] `SESSION_SECRET` com 32+ caracteres aleatórios ✅

### Deploy Platform (Escolha 1)
- [ ] **Railway**: Conectar GitHub, deploy automático
- [ ] **Render**: Similar ao Railway, grátis Hobby plan
- [ ] **Vercel**: Para Next.js (se evoluir)
- [ ] **AWS Lambda**: Para serverless (mais complexo)
- [ ] **VPS**: DigitalOcean/Linode (mais controle)

### SSL/TLS
- [ ] Certificado Let's Encrypt obtido
- [ ] Auto-renewal configurado (Certbot)
- [ ] HTTPS funcionando (teste com `https://...`)
- [ ] Redirecionamento HTTP → HTTPS

### DNS
- [ ] Domínio apontando para servidor
- [ ] DNS propagação completa (< 24h)
- [ ] CNAME/A record verificado
- [ ] MX records (se usar email) corretos

### Firewall e Rede
- [ ] Porta 80 aberta (HTTP → HTTPS)
- [ ] Porta 443 aberta (HTTPS)
- [ ] Porta 22 bloqueada para o público (SSH)
- [ ] Rate limiting em nível de firewall (DDoS)
- [ ] IP whitelist para admin (opcional)

---

## 🔍 FASE 6: Validação Final

### Teste de Penetração Básica
```bash
# Teste XSS
curl "https://seu-site.com/api/forms/submit" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name": "<script>alert(1)</script>"}'
# Esperado: Campo rejeitado ou sanitizado

# Teste Rate Limit
for i in {1..10}; do curl "https://seu-site.com/api/forms/submit" -X POST; done
# Esperado: Depois de N requisições → 429 Too Many Requests

# Teste CORS
curl "https://seu-site.com/api/forms/submit" \
  -H "Origin: https://site-malicioso.com" \
  -X POST
# Esperado: Error 403 CORS

# Teste SQL Injection (se usar DB)
curl "https://seu-site.com/api/forms/submit" \
  -X POST \
  -d '{"email": "test@test.com\' OR 1=1 --"}'
# Esperado: Erro 400 ou campo rejeitado
```

### Monitoramento em Tempo Real
- [ ] Abrindo Sentry dashboard
- [ ] Verificando se erros aparecem
- [ ] Analytics rastreando usuários
- [ ] Logs centralizados funcionando
- [ ] Alertas configurados para erros críticos

### Teste de Carga
```bash
# Simular múltiplos usuários
ab -n 1000 -c 10 https://seu-site.com/
# Esperado: < 5% de erros 5xx, p99 < 2s

# Ou usar ferramenta como k6
k6 run load-test.js
```

---

## 📊 FASE 7: Pós-Deploy

### Primeiras 24 Horas
- [ ] Monitorar Sentry para erros
- [ ] Checar logs de servidor (`tail -f /var/log/minerva/app.log`)
- [ ] Testar formulário manualmente
- [ ] Validar que Make webhook recebeu dados
- [ ] Verificar tráfego em Analytics

### Primeira Semana
- [ ] Nenhum erro crítico 🎉
- [ ] Taxa de submissão de formulário esperada?
- [ ] Lead time para resposta aceitável?
- [ ] Feedback do time de vendas?
- [ ] Performance mantém padrão?

### Documentação Pós-Deploy
- [ ] Runbook criado (como reiniciar serviço?)
- [ ] Contato de suporte de emergência
- [ ] Backup schedule documentado
- [ ] Disaster recovery plan
- [ ] Escalation contacts

---

## 🎓 Decisões Importantes

**Qual plataforma de deploy?**
- [ ] Railway (recomendado - simples, barato)
- [ ] Render (alternativa boa)
- [ ] Vercel (se migrar para Next.js)
- [ ] AWS (se escala grande)
- [ ] VPS próprio (máximo controle)

**Database?**
- [ ] Não usar (apenas Make webhook)
- [ ] SQLite (simples local)
- [ ] PostgreSQL (produção real)
- [ ] MongoDB (alternativa)

**Email notificações?**
- [ ] Não enviar (apenas Make notifica)
- [ ] SendGrid (email robusto)
- [ ] Gmail SMTP (grátis, menos confiável)
- [ ] AWS SES (se usar AWS)

**Monitoring?**
- [ ] Sentry (recomendado)
- [ ] LogRocket (alternativa)
- [ ] DataDog (enterprise)
- [ ] ELK Stack (DIY complexo)

---

## ⚠️ STOP! Antes de Deploy

### Checklist CRÍTICO
```
🚫 NUNCA fazer commit de .env
🚫 NUNCA expor webhook no frontend
🚫 NUNCA usar senha fraca em JWT_SECRET
🚫 NUNCA desabilitar HTTPS em produção
🚫 NUNCA deixar rate limiting desligado
🚫 NUNCA confiar apenas em validação frontend
🚫 NUNCA esquecer backup automático
🚫 NUNCA ignorar alertas de segurança
```

---

## ✅ Assinatura de Aprovação

Quando TODOS os itens acima estão completos:

```
Deploy APROVADO:
Data: _____________
Por:  _____________
Observações: ______________________________
```

---

## 📞 Contatos de Suporte

**Se encontrar problemas:**
1. Consulte ANALISE_FALHAS.md
2. Consulte IMPLEMENTACAO_SEGURA.md
3. Verifique logs (Sentry + servidor)
4. Teste com Postman
5. Revise variáveis de ambiente

---

**🚀 Pronto para produção?** Marque todos os itens e boa sorte! 🎉
