# CriativeIA - Sistema de Blog com IA

## Visão Geral

O CriativeIA é um sistema de blog moderno focado em inteligência artificial e criatividade, desenvolvido com React, TypeScript, Node.js e PostgreSQL. O projeto oferece uma plataforma completa para criação, gerenciamento e publicação de conteúdo sobre IA.

## Arquitetura do Sistema

### Frontend (Client)
- **Framework**: React 18 com TypeScript
- **Roteamento**: React Router DOM v6
- **Estado**: React Query (TanStack Query) para gerenciamento de estado do servidor
- **UI**: Componentes customizados com Tailwind CSS
- **Autenticação**: Context API com JWT

### Backend (Server)
- **Runtime**: Node.js com TypeScript
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Autenticação**: JWT com bcrypt
- **Validação**: Zod schemas

## Estrutura de Diretórios

```
língua-lore/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas públicas
│   │   │   └── admin/      # Páginas administrativas
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilitários e configurações
│   └── public/             # Arquivos estáticos
├── server/                 # Backend Node.js
│   ├── routes.ts           # Definição das rotas da API
│   ├── storage.ts          # Camada de acesso aos dados
│   └── index.ts            # Servidor principal
├── shared/                 # Código compartilhado
│   └── schema.ts           # Schemas do banco e validação
└── db/                     # Migrações do banco
```

## Funcionalidades Principais

### 1. Sistema de Posts
- **Criação e Edição**: Editor completo com suporte a markdown
- **Categorização**: Sistema de categorias para organização
- **SEO**: Metadados customizáveis (título, descrição, slug)
- **Imagens**: Upload e gerenciamento de imagens destacadas
- **Status**: Rascunho, publicado, arquivado
- **Visualização**: Página individual para cada post (/post/:slug)

### 2. Painel Administrativo
- **Dashboard**: Estatísticas e visão geral do sistema
- **Gerenciamento de Posts**: CRUD completo
- **Categorias**: Criação e organização de categorias
- **Analytics**: Métricas de visualização e engajamento
- **Configurações**: Personalização do site

### 3. Sistema de Autenticação
- **Login/Registro**: Autenticação segura com JWT
- **Proteção de Rotas**: Middleware para rotas administrativas
- **Gerenciamento de Usuários**: Sistema básico de usuários

### 4. Analytics e Métricas
- **Tracking de Visualizações**: Contagem automática de page views
- **Estatísticas do Dashboard**: Métricas em tempo real
- **Relatórios**: Dados de engajamento e performance

## Rotas do Sistema

### Rotas Públicas
- `/` - Página inicial com grid de posts
- `/post/:slug` - Visualização individual de posts
- `/auth` - Login e registro

### Rotas Administrativas (Protegidas)
- `/admin` - Dashboard principal
- `/admin/posts` - Listagem de posts
- `/admin/posts/new` - Criar novo post
- `/admin/posts/edit/:id` - Editar post existente
- `/admin/categories` - Gerenciar categorias
- `/admin/users` - Gerenciar usuários
- `/admin/analytics` - Visualizar métricas
- `/admin/settings` - Configurações do sistema

## API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário

### Posts
- `GET /api/posts` - Listar posts (com filtro published=true para público)
- `GET /api/posts/:id` - Buscar post por ID
- `GET /api/posts/slug/:slug` - Buscar post por slug
- `POST /api/posts` - Criar novo post (autenticado)
- `PUT /api/posts/:id` - Atualizar post (autenticado)
- `PATCH /api/posts/:id` - Atualização parcial (autenticado)
- `DELETE /api/posts/:id` - Deletar post (autenticado)

### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria (autenticado)

### Analytics
- `GET /api/analytics` - Buscar dados de analytics (autenticado)
- `POST /api/analytics` - Registrar evento de analytics
- `GET /api/dashboard/stats` - Estatísticas do dashboard (autenticado)

## Componentes Principais

### Frontend
- **AdminLayout**: Layout base para páginas administrativas
- **PostCard**: Componente para exibição de posts em grid
- **PostsGrid**: Grid responsivo de posts com categorização
- **Header**: Cabeçalho com navegação e acesso administrativo
- **PostEditor**: Editor completo para criação/edição de posts

### Backend
- **DatabaseStorage**: Camada de abstração para operações do banco
- **Authentication Middleware**: Proteção de rotas com JWT
- **Route Handlers**: Controladores para cada endpoint da API

## Configuração e Deploy

### Variáveis de Ambiente
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=5000
```

### Comandos de Desenvolvimento
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar migrações
npm run db:push
```

## Melhorias Implementadas

1. **Roteamento Corrigido**: 
   - Adicionada rota para visualização individual de posts
   - Corrigido AdminLayout para usar Outlet do React Router
   - Organizadas importações para usar páginas administrativas corretas

2. **Estrutura Organizada**:
   - Separação clara entre páginas públicas e administrativas
   - Componentes reutilizáveis bem estruturados
   - Sistema de navegação intuitivo

3. **Sistema Completo**:
   - Fluxo completo: criação → edição → publicação → visualização
   - Analytics funcionais com tracking de eventos
   - Dashboard com métricas em tempo real

## Próximos Passos Sugeridos

1. **Melhorias de UX**:
   - Implementar busca de posts
   - Adicionar sistema de comentários
   - Melhorar responsividade mobile

2. **Funcionalidades Avançadas**:
   - Sistema de tags além de categorias
   - Editor WYSIWYG mais avançado
   - Upload de múltiplas imagens

3. **Performance**:
   - Implementar cache de posts
   - Otimização de imagens
   - Lazy loading de componentes

4. **SEO e Marketing**:
   - Sitemap automático
   - Meta tags dinâmicas
   - Integração com Google Analytics

## Conclusão

O sistema CriativeIA está agora completamente organizado e funcional, com todas as rotas conectadas adequadamente, sistema de posts funcionando end-to-end, painel administrativo completo e analytics implementados. A arquitetura é escalável e mantível, seguindo as melhores práticas de desenvolvimento moderno.