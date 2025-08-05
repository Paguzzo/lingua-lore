# CriativeIA - Blog & CMS Platform

## Project Overview
CriativeIA é uma plataforma de blog e CMS focada em inteligência artificial e criatividade. A aplicação foi migrada com sucesso do ambiente Lovable para o Replit, substituindo o backend Supabase por uma solução custom com Express.js e Neon Postgres.

## Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: Neon Postgres com Drizzle ORM
- **Authentication**: JWT + bcrypt (custom implementation)
- **State Management**: TanStack React Query
- **Routing**: React Router DOM

## User Preferences
- Idioma: Português Brasileiro
- Design: Moderno com foco em IA, gradientes purple-blue-cyan
- Branding: "CriativeIA" - Inteligência Criativa
- Logo: Ícone de cérebro (Brain) com raio (Zap) em gradiente IA
- Admin Access: Ícone discreto "A" no header direito

## Project Architecture

### Authentication System
- Custom JWT-based authentication replacing Supabase Auth
- Username/password login (not email-based as requested)
- Session management with HTTP-only cookies
- Protected routes for admin dashboard

### Database Schema
- **Users**: Authentication and user management
- **Posts**: Blog posts with full CMS capabilities
- **Categories**: Post categorization
- **Analytics**: Basic analytics tracking
- **Profiles, Media, CTAs, etc**: Extended CMS features

### API Routes
- `/api/auth/*` - Authentication endpoints
- `/api/posts/*` - Post management
- `/api/categories/*` - Category management
- `/api/dashboard/stats` - Dashboard statistics
- `/api/analytics/*` - Analytics tracking

### Frontend Structure
- `/` - Homepage with blog posts grid
- `/auth` - Login/signup page
- `/admin/*` - Protected admin dashboard
- Discrete admin access via "A" icon in header

## Recent Changes
- **2024-01-05**: Migrated from Lovable to Replit
- **2024-01-05**: Replaced Supabase with Neon Postgres + Express
- **2024-01-05**: Implemented custom JWT authentication
- **2024-01-05**: Updated branding to "CriativeIA"
- **2024-01-05**: Added discrete admin access icon
- **2024-01-05**: Created modern AI-focused design with gradients

## Key Features
- ✅ Blog homepage with posts grid
- ✅ Admin dashboard for content management
- ✅ Post creation/editing with full CMS features
- ✅ Category management
- ✅ User authentication system
- ✅ Analytics tracking
- ✅ Responsive design
- ✅ SEO optimization

## Development Guidelines
- Use React Query for all API calls
- Follow Drizzle ORM patterns for database operations
- Maintain type safety with TypeScript
- Use shadcn/ui components for consistent design
- Keep authentication secure with JWT best practices

## Deployment Status
The application is ready for production deployment on Replit with all core features implemented and tested.