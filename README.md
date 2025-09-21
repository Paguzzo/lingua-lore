# Blog.IA - Plataforma de Blog com IA

Uma plataforma moderna de blog construída com React, Express, TypeScript e PostgreSQL, integrada com serviços de IA para criação e otimização de conteúdo.

## 🚀 Funcionalidades

- **Sistema de Autenticação JWT** - Login seguro com tokens JWT
- **CRUD Completo de Posts** - Criação, edição e gerenciamento de posts
- **Sistema de Categorias** - Organização dinâmica de conteúdo
- **Upload de Imagens** - Integração com Cloudinary para armazenamento
- **Análise de Performance** - Dashboard com métricas e analytics
- **Sistema de Newsletter** - Gerenciamento de inscritos
- **IA para Conteúdo** - Melhoria automática de posts com IA

## 🛠️ Tecnologias

### Frontend
- React 18 com TypeScript
- Vite para build e desenvolvimento
- Tailwind CSS para estilização
- Radix UI para componentes
- React Hook Form para formulários
- Framer Motion para animações

### Backend
- Express.js com TypeScript
- PostgreSQL com Drizzle ORM
- JWT para autenticação
- Cloudinary para upload de imagens
- Nodemailer para e-mails

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL (ou Neon Database)
- Conta no Cloudinary (opcional)
- Conta no Vercel (para deploy)

## 🔧 Configuração Local

### 1. Clone o repositório
```bash
git clone <repository-url>
cd lingua-lore
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Copie o arquivo `.env.example` para `.env` e configure:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/blog_ia

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Session
SESSION_SECRET=your-session-secret

# Environment
NODE_ENV=development

# Server
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Blog.IA

# Analytics
GOOGLE_ANALYTICS_ID=your-ga-id
```

### 4. Execute as migrações do banco
```bash
npm run db:migrate
```

### 5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173` e o backend em `http://localhost:3000`.

## 🚀 Deploy no Vercel

### 1. Prepare o projeto
Certifique-se de que todas as configurações estão corretas:
- `vercel.json` configurado
- Scripts de build atualizados
- Variáveis de ambiente definidas

### 2. Configure o banco de dados
Recomendamos usar o [Neon Database](https://neon.tech) para PostgreSQL na nuvem:

1. Crie uma conta no Neon
2. Crie um novo projeto
3. Copie a connection string
4. Configure a variável `DATABASE_URL` no Vercel

### 3. Deploy via Vercel CLI
```bash
# Instale o Vercel CLI
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel
```

### 4. Configure as variáveis de ambiente no Vercel
No dashboard do Vercel, vá em Settings > Environment Variables e adicione:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `SESSION_SECRET`
- `NODE_ENV=production`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `FROM_EMAIL`
- `FROM_NAME`
- `GOOGLE_ANALYTICS_ID`

### 5. Execute as migrações em produção
Após o deploy, execute as migrações:
```bash
vercel env pull .env.local
npm run db:migrate
```

## 📁 Estrutura do Projeto

```
linguia-lore/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilitários
├── server/                # Backend Express
│   ├── routes/           # Rotas da API
│   ├── auth/             # Sistema de autenticação
│   ├── upload/           # Sistema de upload
│   └── index.ts          # Servidor principal
├── shared/               # Código compartilhado
│   └── schema.ts         # Schemas do banco
├── migrations/           # Migrações do banco
└── scripts/             # Scripts utilitários
```

## 🔑 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Dados do usuário
- `POST /api/auth/logout` - Logout

### Posts
- `GET /api/posts` - Listar posts
- `GET /api/posts/:id` - Obter post
- `POST /api/posts` - Criar post
- `PUT /api/posts/:id` - Atualizar post
- `DELETE /api/posts/:id` - Deletar post

### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/:id` - Atualizar categoria
- `DELETE /api/categories/:id` - Deletar categoria

### Upload
- `POST /api/upload/image` - Upload de imagem
- `POST /api/upload/images` - Upload múltiplo
- `GET /api/upload/config` - Configuração do upload
- `DELETE /api/upload/:id` - Deletar imagem

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Certifique-se de que o banco de dados está acessível
3. Verifique os logs do Vercel para erros de deploy
4. Abra uma issue no repositório

## 🔄 Atualizações

Para manter o projeto atualizado:

```bash
git pull origin main
npm install
npm run db:migrate
```

---

**Desenvolvido com ❤️ para a comunidade de desenvolvedores**