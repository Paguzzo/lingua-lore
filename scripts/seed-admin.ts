#!/usr/bin/env tsx

// Script para criar usuário admin inicial
import dotenv from 'dotenv';

// Carregar variáveis de ambiente ANTES de importar qualquer coisa
dotenv.config();

import { storage } from '../server/storage';
import { hashPassword } from '../server/auth/jwt';

async function createAdminUser() {
  try {
    console.log('🔧 Iniciando criação do usuário admin...');

    // Configurações do admin padrão
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@blog.ia';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    console.log(`📧 Email do admin: ${adminEmail}`);

    // Verificar se o usuário já existe
    const existingUser = await storage.getUserByUsername(adminEmail);
    
    if (existingUser) {
      console.log('⚠️ Usuário admin já existe!');
      console.log(`ID: ${existingUser.id}`);
      console.log(`Username: ${existingUser.username}`);
      return;
    }

    // Criar o usuário admin
    console.log('👤 Criando usuário admin...');
    
    const hashedPassword = await hashPassword(adminPassword);
    
    const adminUser = await storage.createUser({
      username: adminEmail,
      password: hashedPassword,
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log(`ID: ${adminUser.id}`);
    console.log(`Username: ${adminUser.username}`);
    console.log('🔐 Dados de acesso:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Senha: ${adminPassword}`);
    console.log('');
    console.log('⚠️ IMPORTANTE: Altere a senha após o primeiro login!');

  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
    process.exit(1);
  }
}

// Executar o script
createAdminUser()
  .then(() => {
    console.log('🎉 Script de seed concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro no script de seed:', error);
    process.exit(1);
  });