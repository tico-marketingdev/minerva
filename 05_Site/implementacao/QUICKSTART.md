# ⚡ QUICK START — Começar Agora!

> **Tempo**: 5-6 horas | **Dificuldade**: 🟢 Fácil | **Código**: Pronto!

---

## 🎯 Objetivo
Ter um site seguro, funcional e em produção com formulário trabalhando.

---

## 📖 PASSO 0: Ler Documentação (10 min)

Abra estes 2 arquivos ANTES de começar:

1. **[SUMARIO_EXECUTIVO.md](SUMARIO_EXECUTIVO.md)** — O que foi feito
2. **[PASSO_A_PASSO.md](PASSO_A_PASSO.md)** — Como implementar

Eles têm tudo que você precisa. Os próximos passos resumem o essencial.

---

## 🚀 FASE 1: TESTE LOCAL (30 minutos)

### Terminal 1: Servidor Frontend

```powershell
cd C:\Users\hewerton.ferreira\Desktop\Educacao_Skills\05_Site
python -m http.server 8000
```

Abra navegador: **http://localhost:8000/index-novo.html**

✅ Checklist:
- [ ] Página carrega
- [ ] Clique "Comece Agora" → Formulário abre
- [ ] F12 (DevTools) → Console → Sem erros vermelhos

---

## 🔧 FASE 2: BACKEND (2 horas)

### Terminal 2: Criar Projeto Node.js

```powershell
cd C:\Users\hewerton.ferreira\Desktop\Educacao_Skills
mkdir backend
cd backend
npm init -y
npm install express cors express-rate-limit axios dotenv
```

### Criar `.env`

Arquivo: `backend\.env`

```env
NODE_ENV=development
PORT=3000
MAKE_WEBHOOK_URL=https://hook.us2.make.com/h8rfq7xc5kcq8g6lpwt6pvqw2j8hcu1n
CORS_ORIGINS=http://localhost:8000,http://localhost:3000
LOG_LEVEL=debug
```

### Criar `server.js`

Arquivo: `backend\server.js`

Copie o código completo de **[PASSO_A_PASSO.md](PASSO_A_PASSO.md)** seção **Passo 2.4**.

(Código está pronto, é só copiar/colar!)

### Iniciar Backend

```powershell
cd backend
node server.js
```

Esperado: Mensagem com 🚀 e porta 3000.

✅ Checklist:
- [ ] Server iniciou com sucesso
- [ ] Porta 3000 disponível

---

## 🔗 FASE 3: INTEGRAÇÃO (1 hora)

### Atualizar `app.js`

No arquivo `05_Site\app.js`:

1. Procure: `formularioEnvio.addEventListener('click'`
2. Substitua TODO aquele bloco pelo código em **[PASSO_A_PASSO.md](PASSO_A_PASSO.md)** seção **Passo 3.1**.

### Testar

1. Frontend rodando: `http://localhost:8000/index-novo.html`
2. Backend rodando: `http://localhost:3000`
3. Clique "Comece Agora"
4. Preencha formulário (todos os 4 passos)
5. Clique "Enviar"

Esperado: ✅ **"Formulário enviado com sucesso!"**

✅ Checklist:
- [ ] Formulário envia sem erro
- [ ] Make webhook recebeu dados
- [ ] DevTools console sem erros

---

## 📤 FASE 4: GITHUB (30 minutos)

### 1. Criar `.gitignore`

Arquivo: `C:\Users\hewerton.ferreira\Desktop\Educacao_Skills\.gitignore`

```
.env
node_modules/
*.log
.DS_Store
```

### 2. Inicializar Git

```powershell
cd C:\Users\hewerton.ferreira\Desktop\Educacao_Skills
git init
git config user.name "Seu Nome"
git config user.email "seu-email@gmail.com"
```

### 3. Fazer Commit

```powershell
git add .
git commit -m "refactor: arquitetura segura (HTML/CSS/JS separados, backend)"
```

### 4. Conectar GitHub

1. Crie repo em https://github.com/new
2. Nome: `minerva-site`
3. Terminal:

```powershell
git remote add origin https://github.com/SEU_USUARIO/minerva-site.git
git branch -M main
git push -u origin main
```

✅ Checklist:
- [ ] Repositório criado em GitHub
- [ ] Código pushado com sucesso

---

## 🌍 FASE 5: DEPLOY (1 hora 30 minutos)

### Opção Recomendada: Railway

1. Acesse https://railway.app
2. Sign up com GitHub
3. "New Project" → "Deploy from GitHub"
4. Selecione repo `minerva-site`
5. Configure pasta: `backend`
6. Adicionar variáveis (igual ao `.env` local)
7. Deploy automático ✨

Você receberá URL: `https://seu-projeto.railway.app`

### Atualizar Frontend

Em `05_Site\app.js`, procure:

```javascript
const response = await fetch('/api/forms/submit', {
```

Substitua por:

```javascript
const response = await fetch('https://seu-projeto.railway.app/api/forms/submit', {
```

### Deploy Frontend

Use Vercel (mais fácil):
1. https://vercel.com
2. Sign up com GitHub
3. "New Project"
4. Deploy pasta `05_Site`
5. Pronto!

Você receberá URL: `https://seu-site.vercel.app`

✅ Checklist:
- [ ] Backend em produção
- [ ] Frontend em produção
- [ ] Teste end-to-end: formulário envia

---

## ✅ VALIDAÇÃO FINAL

Teste em produção (https://seu-site.vercel.app):

1. [ ] Clique "Comece Agora"
2. [ ] Preencha: Nome, email, telefone
3. [ ] Clique "Próximo" × 3 passos
4. [ ] Clique "Enviar"
5. [ ] Esperado: ✅ "Enviado com sucesso!"
6. [ ] Verifique Make webhook (recebeu dados?)

**Se tudo funcionou** 🎉 **Parabéns! Você terminou!**

---

## 📚 REFERÊNCIA RÁPIDA

| O que | Onde |
|------|------|
| Entender problemas | ANALISE_FALHAS.md |
| Implementação detalhada | PASSO_A_PASSO.md |
| Código backend | PASSO_A_PASSO.md (Passo 2.4) |
| Código app.js | PASSO_A_PASSO.md (Passo 3.1) |
| Testes locais | GUIA_TESTES_LOCAIS.md |
| Checklist deploy | CHECKLIST_PRE_DEPLOY.md |
| Todos os docs | INDICE.md |

---

## 🆘 PROBLEMA? 

**Procure em**:
1. `PASSO_A_PASSO.md` (seção "Troubleshooting")
2. `GUIA_TESTES_LOCAIS.md` (seção "Problemas Comuns")

**Não encontrou?** Faça:
```powershell
# Terminal 1: Servidor frontend
cd 05_Site
python -m http.server 8000

# Terminal 2: Backend
cd backend
node server.js

# Terminal 3: Ver logs/erros
tail -f backend.log
```

Verifique `DevTools F12 → Console` e `logs do backend`.

---

## ⏱️ VELOCIDADE

- **Experiência**: Pode ser 2-3h
- **Iniciante**: Pode ser 6-8h
- **Com ajuda**: ~4h

Não tenha pressa. Faça com qualidade.

---

## 🎓 APRENDIZADO

Depois de terminar, você vai saber:
- ✅ Segurança web (XSS, CSRF, CSP)
- ✅ Arquitetura modular (HTML/CSS/JS)
- ✅ Backend Node.js/Express
- ✅ Integração frontend-backend
- ✅ Deploy em produção
- ✅ Git/GitHub

---

## 🚀 COMECE!

👉 **Abra**: **[PASSO_A_PASSO.md](PASSO_A_PASSO.md)**

👉 **Comece**: **FASE 1 (Testes Locais)**

---

*Boa sorte! 🎉*
