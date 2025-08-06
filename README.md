# CriativeIA - Blog & CMS Platform

## Sobre o Projeto
CriativeIA é uma plataforma de blog e CMS focada em inteligência artificial e criatividade. A aplicação utiliza React no frontend, Express.js no backend, com suporte para Neon Postgres e armazenamento em memória para desenvolvimento.

## Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: Neon Postgres com Drizzle ORM (ou armazenamento em memória)
- **Autenticação**: JWT + bcrypt
- **State Management**: TanStack React Query
- **Routing**: React Router DOM

## Configuração e Instalação

### 1. Instalação das Dependências
```bash
npm install
```

### 2. Configuração do Ambiente
Copie o arquivo `.env.example` para `.env` e configure as variáveis:
```bash
cp .env.example .env
```

**Variáveis importantes:**
- `DATABASE_URL`: String de conexão do Neon Postgres (opcional - usa memória se não definida)
- `JWT_SECRET`: Chave secreta para tokens JWT
- `NODE_ENV`: development/production

### 3. Configuração do Banco de Dados (Opcional)
Para usar Neon Postgres:
```bash
# Configure DATABASE_URL no .env
npm run db:push
```

### 4. Executar em Desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em: http://localhost:5000

## Recursos Implementados

### ✅ Sistema de Autenticação
- Login com usuário/senha
- JWT para sessões
- Rotas protegidas para admin
- **Credenciais padrão**: admin / admin123

### ✅ Gestão de Conteúdo
- Sistema completo de posts com editor
- Categorias temáticas (IA, Ferramentas, Automação, Tutoriais)
- Upload de imagens e mídia
- SEO otimizado

### ✅ Interface Moderna
- Design responsivo com gradientes IA
- Tema escuro/claro
- Componentes shadcn/ui
- Acesso discreto ao admin (ícone "A" no header)

### ✅ Analytics e Métricas
- Tracking de visualizações
- Estatísticas do dashboard
- Análise de engajamento

## Estrutura do Projeto

```
/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── hooks/          # Hooks customizados
│   │   └── lib/            # Utilitários
├── server/                 # Backend Express
│   ├── index.ts            # Servidor principal
│   ├── routes.ts           # Rotas da API
│   ├── memory-storage.ts   # Armazenamento em memória
│   └── db.ts               # Configuração do banco
├── shared/                 # Schemas compartilhados
└── migrations/             # Migrações do banco

```

## Scripts Disponíveis

- `npm run dev`: Inicia servidor de desenvolvimento
- `npm run build`: Build para produção
- `npm start`: Inicia em produção
- `npm run check`: Verificação de tipos TypeScript
- `npm run db:push`: Aplica schema no banco (Drizzle)

## Deploy

### Replit
A aplicação está configurada para deploy direto no Replit. Certifique-se de:
1. Configurar as variáveis de ambiente
2. Conectar ao Neon Postgres (se desejado)
3. A aplicação roda na porta 5000 (única porta desbloqueada)

### Outras Plataformas
Para deploy em outras plataformas:
1. Configure `DATABASE_URL` para Neon Postgres
2. Defina `JWT_SECRET` forte
3. Execute `npm run build`
4. Inicie com `npm start`

## Branding

**CriativeIA** - Inteligência Criativa
- Logo: Cérebro (Brain) + Raio (Zap) em gradiente purple-blue-cyan
- Cores: Gradientes de roxo, azul e ciano
- Foco: IA aplicada à criatividade e produtividade

## Status do Desenvolvimento
- ✅ Sistema básico funcionando
- ✅ Autenticação implementada
- ✅ CMS completo
- ✅ Design responsivo
- ✅ Dados de exemplo carregados
- ✅ Rotas corrigidas
- ✅ Vulnerabilidades resolvidas

---

**Desenvolvido para demonstrar o poder da IA na criação de conteúdo e gestão digital.**