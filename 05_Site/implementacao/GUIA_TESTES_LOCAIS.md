# 🚀 GUIA RÁPIDO DE TESTES LOCAIS

## 1️⃣ Preparar Ambiente

### Windows (PowerShell)
```powershell
cd C:\Users\hewerton.ferreira\Desktop\Educacao_Skills\05_Site
python -m http.server 8000
```

### macOS/Linux
```bash
cd ~/Educacao_Skills/05_Site
python3 -m http.server 8000
```

**Esperado**: Servidor iniciando em `http://localhost:8000`

---

## 2️⃣ Abrir Navegador

Acesse: **http://localhost:8000/index-novo.html**

---

## 3️⃣ Validação de Carregamento

### ✅ Checklist Visual
- [ ] Página carrega (sem erros branco)
- [ ] Logo aparece no topo
- [ ] Menu de navegação visível
- [ ] Seção hero com imagem
- [ ] Seções de conteúdo aparecem
- [ ] Rodapé visível
- [ ] Nenhuma mensagem de erro visível

### ✅ Checklist DevTools (F12 → Console)
- [ ] **0 erros vermelhos** em console
- [ ] **0 avisos de segurança** (CSP)
- [ ] Nenhuma linha amarela de warning
- [ ] Mensagens como "Página carregada com sucesso" (se houver)

---

## 4️⃣ Teste de Formulário

### Passo 1: Clicar no Botão CTA
- Procure o botão **"Comece Agora"** ou **"Envie Seu Contato"**
- Clique nele

### Passo 2: Wizard do Formulário
Você deve ver um formulário em 4 passos:
1. **Dados Básicos** (nome, email, telefone)
2. **Tipo de Cliente** (qual tipo sua empresa é)
3. **Desafios** (quais são seus desafios)
4. **Revisão e Envio**

### Passo 3: Preencher Dados Teste
```
Nome: João Silva
Email: joao@test.com
Telefone: (11) 98765-4321
```

### Passo 4: Avançar pelos Passos
- [ ] Clique em "Próximo" em cada tela
- [ ] Validação funciona (tenta enviar sem preencher)
- [ ] Último passo mostra resumo
- [ ] Botão "Enviar" aparece no final

---

## 5️⃣ Teste de Segurança (CSP)

### Teste XSS Prevention
Abra console (F12) e execute:
```javascript
// Teste 1: Validar sanitização
console.log("Se sanitize.html() existe:", typeof sanitize.html === 'function');

// Teste 2: Verificar CSP headers
fetch(window.location.href).then(r => {
  console.log("CSP Header:", r.headers.get('content-security-policy'));
});
```

**Esperado**: 
- `sanitize.html()` deve existir
- CSP header deve estar presente

### Teste Webhook Seguro
```javascript
// Verificar que webhook NÃO está no frontend
console.log("CONFIG.formulario.apiEndpoint:", CONFIG.formulario.apiEndpoint);
// Esperado: "/api/forms/submit" (não uma URL do Make!)

console.log("Webhook no frontend?", CONFIG.formulario.webhook);
// Esperado: undefined ou erro
```

---

## 6️⃣ Teste de Performance

### F12 → Performance Tab
1. Clique em **Record** (círculo vermelho)
2. Aguarde 3 segundos
3. Clique em **Stop**
4. Analise o gráfico

**Esperado**:
- Renderização inicial < 1 segundo
- Nenhum layout thrashing
- Nenhum script long-running

### F12 → Network Tab
1. Recarregue página (Ctrl+R)
2. Observe requisições

**Esperado**:
- index-novo.html: ~80 linhas
- styles.css: ~1200 linhas  
- config.js: ~350 linhas
- app.js: ~400 linhas
- Total ~80KB (antes era 1500+ linhas em 1 arquivo!)

---

## 7️⃣ Problemas Comuns e Soluções

### ❌ "Erro: Cannot find element"
**Causa**: HTML não renderizado  
**Solução**: Verifique que `index-novo.html` (não index.html antigo) está sendo usado

### ❌ "fetch is not defined"
**Causa**: Navegador muito antigo  
**Solução**: Use Chrome/Firefox/Safari moderno (2020+)

### ❌ "CSP violation: inline script"
**Causa**: JavaScript inline ainda presente  
**Solução**: Verifique que `app.js` está carregando externamente

### ❌ "API endpoint returns 404"
**Causa**: Backend não implementado ainda  
**Esperado**: Por enquanto, pois backend não foi criado. Próxima fase!

### ❌ Formulário não envia
**Checklist**:
1. [ ] Backend implementado?
2. [ ] .env configurado?
3. [ ] CORS habilitado?
4. [ ] Webhook Make URL correta?

---

## 8️⃣ Validação de Segurança Completa

### Script de Teste Automático
Cole no DevTools Console:
```javascript
// TESTE 1: Verificar isolamento de dados
const testXSS = () => {
  const malicious = "<img src=x onerror='alert(1)'>";
  const sanitized = sanitize.html(malicious);
  console.log("XSS Test:", !sanitized.includes("onerror"));
};
testXSS();

// TESTE 2: Verificar que webhook não está exposto
const testWebhook = () => {
  const hasWebhookInConfig = Object.values(CONFIG).some(
    obj => typeof obj === 'object' && obj.webhook && obj.webhook.includes('hook.us2.make.com')
  );
  console.log("Webhook Exposed?", hasWebhookInConfig);
};
testWebhook();

// TESTE 3: Verificar CSP
const testCSP = () => {
  const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  console.log("CSP Enabled?", !!meta);
  console.log("CSP Value:", meta?.getAttribute('content'));
};
testCSP();

// TESTE 4: Verificar duplicação
const allScripts = document.querySelectorAll('script');
console.log("Scripts no DOM:", allScripts.length, "(esperado: 4)");
```

**Resultado Esperado**:
```
XSS Test: true ✅
Webhook Exposed? false ✅
CSP Enabled? true ✅
Scripts no DOM: 4 ✅
```

---

## 9️⃣ Checklist Final de Aceitação

- [ ] Página carrega sem erros
- [ ] Todas as seções visíveis e bem formatadas
- [ ] DevTools Console sem erros vermelhos
- [ ] Formulário abre ao clicar CTA
- [ ] Formulário tem 4 passos
- [ ] Validação funciona (campos obrigatórios)
- [ ] XSS test passa
- [ ] Webhook não está exposto no frontend
- [ ] CSP headers presentes
- [ ] Performance aceitável (<1s renderização)
- [ ] Links funcionam
- [ ] Animações carregam

**Se todos os checks passam**: ✅ **Pronto para deploy!**

---

## 🔟 Próximas Fases

### Fase 1: Backend (Próxima)
```bash
npm init -y
npm install express cors express-rate-limit axios dotenv
# ... implementar server.js usando IMPLEMENTACAO_SEGURA.md
```

### Fase 2: Deploy
```bash
# Setup .env com valores reais
# Deploy em Railway/Render/Vercel
# Teste end-to-end com Make webhook
```

### Fase 3: Produção
```bash
# Setup HTTPS
# Configurar Sentry
# Monitoramento
# Backup automático
```

---

## 📝 Exemplo de Teste Manual Passo a Passo

### Executar Teste Completo (5 min)
1. **Abrir página** → `http://localhost:8000/index-novo.html`
2. **Validar renderização** → Todas seções aparecem?
3. **Abrir DevTools** → `F12` → Aba Console → Erros?
4. **Clicar no CTA** → Formulário abre?
5. **Preencher 1º passo** → Nome, email, telefone
6. **Clicar Próximo** → Vai pro 2º passo?
7. **Preencher até final** → Resumo aparece?
8. **Clicar Enviar** → Qual é o erro? (esperado: 404 do backend por enquanto)
9. **Executar script de teste** → Todos os testes passam?
10. **Conclusão** → ✅ Pronto para backend!

---

## 📞 Se Algo Não Funcionar

1. **Verifique se está no arquivo CORRETO**
   ```
   ❌ http://localhost:8000/index.html (ANTIGO)
   ✅ http://localhost:8000/index-novo.html (NOVO)
   ```

2. **Recarregue a página** (Ctrl+Shift+R para cache limpo)

3. **Verifique a abinha Network no DevTools** para 404s

4. **Revise logs no Console** (F12)

5. **Consulte ANALISE_FALHAS.md** se tiver dúvidas

---

**🎉 Boa sorte com os testes!**
