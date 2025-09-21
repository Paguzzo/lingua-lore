# 🚀 SETUP RÁPIDO - Blog.IA

## ⚡ Configuração em 5 Minutos

### **1. 📋 Pré-requisitos**
- Node.js 18+
- Banco PostgreSQL (recomendo [Neon.tech](https://neon.tech) - gratuito)

### **2. 🔧 Configuração Básica**

```bash
# 1. Clone e instale dependências
cd lingua-lore
npm install

# 2. Configure o banco de dados
cp .env.example .env
# Edite o .env e configure pelo menos DATABASE_URL e JWT_SECRET

# 3. Configure o banco e crie admin
npm run setup

# 4. Inicie o servidor
npm run dev
```

### **3. 🔑 Configurações Obrigatórias no .env**

```env
# OBRIGATÓRIO - Banco de dados
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# OBRIGATÓRIO - Segurança  
JWT_SECRET=sua-chave-jwt-super-secreta-aqui
SESSION_SECRET=sua-chave-sessao-diferente-aqui
```

### **4. 🤖 Para Funcionalidades de IA (Opcional)**

Configure **pelo menos uma** dessas APIs:

```env
# OpenAI (recomendado)
OPENAI_API_KEY=sk-sua-chave-openai-aqui

# OU GROK (X.AI)
GROK_API_KEY=xai-sua-chave-grok-aqui
```

### **5. 🖼️ Para Upload de Imagens (Opcional)**

```env
# Cloudinary (recomendado)
CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=seu-api-secret

# Pexels (busca de imagens - gratuito)
PEXELS_API_KEY=sua-chave-pexels
```

### **6. 🎯 Acesso ao Sistema**

Após executar `npm run setup`:

- **URL**: http://localhost:3000
- **Admin**: admin@blog.ia  
- **Senha**: admin123456

**⚠️ Altere a senha após primeiro login!**

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build           # Build para produção
npm run start           # Servidor de produção

# Banco de dados
npm run db:generate     # Gerar migrations
npm run db:migrate      # Aplicar migrations
npm run db:studio       # Abrir Drizzle Studio
npm run db:seed         # Criar usuário admin

# Setup completo
npm run setup           # Migrate + Seed (primeiro uso)
```

## 🐛 Problemas Comuns

### **Posts não salvam / desaparecem**
❌ **Problema**: DATABASE_URL não configurada  
✅ **Solução**: Configure DATABASE_URL no .env

### **IA não funciona**
❌ **Problema**: API keys não configuradas  
✅ **Solução**: Configure OPENAI_API_KEY ou GROK_API_KEY

### **Upload de imagem falha**
❌ **Problema**: Cloudinary não configurado  
✅ **Solução**: Configure CLOUDINARY_* no .env

### **Erro de JWT**
❌ **Problema**: JWT_SECRET não configurado  
✅ **Solução**: Configure JWT_SECRET forte no .env

## 📚 Recursos

- **Neon Database**: https://neon.tech (PostgreSQL gratuito)
- **OpenAI API**: https://platform.openai.com/api-keys
- **Cloudinary**: https://cloudinary.com (upload gratuito)
- **Pexels API**: https://www.pexels.com/api (imagens gratuitas)

## 🆘 Suporte

Se algo não funcionar:

1. Verifique o arquivo `.env`
2. Execute `npm run setup` novamente
3. Verifique os logs no terminal
4. Consulte o arquivo `CLAUDE.md` para detalhes técnicos

---

**🎉 Pronto! Seu blog com IA está funcionando!**