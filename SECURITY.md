# Guia de Segurança - Lingua Lore

## Configuração de Ambiente Segura

### 1. Variáveis de Ambiente

**IMPORTANTE**: Nunca commite o arquivo `.env` no repositório. Use sempre o `.env.example` como referência.

#### Configuração Obrigatória:

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

#### Variáveis Críticas de Segurança:

1. **JWT_SECRET**: Use uma chave forte de pelo menos 32 caracteres
   ```bash
   # Gere uma chave segura:
   openssl rand -base64 32
   ```

2. **SESSION_SECRET**: Use uma chave diferente do JWT_SECRET
   ```bash
   # Gere outra chave segura:
   openssl rand -base64 32
   ```

3. **DATABASE_URL**: Configure com credenciais seguras
   - Use senhas fortes
   - Configure SSL quando possível
   - Restrinja acesso por IP

### 2. APIs Externas

#### Configuração das APIs de IA:

1. **GROK API**:
   - Obtenha sua chave em: https://console.x.ai/
   - Formato: `xai-xxxxxxxxxx`

2. **OpenAI API**:
   - Obtenha sua chave em: https://platform.openai.com/
   - Formato: `sk-xxxxxxxxxx`

3. **Pexels API**:
   - Obtenha sua chave em: https://www.pexels.com/api/
   - Gratuita com limitações

4. **Freepik API**:
   - Obtenha sua chave em: https://www.freepik.com/api
   - Requer conta premium

### 3. Configuração de Produção

#### Variáveis de Ambiente para Produção:

```bash
NODE_ENV=production
JWT_SECRET=sua-chave-jwt-super-segura-aqui
SESSION_SECRET=sua-chave-sessao-super-segura-aqui
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

#### Checklist de Segurança:

- [ ] Todas as chaves de API configuradas
- [ ] JWT_SECRET e SESSION_SECRET únicos e seguros
- [ ] DATABASE_URL com SSL habilitado
- [ ] NODE_ENV=production
- [ ] Logs de debug removidos
- [ ] CORS configurado corretamente
- [ ] HTTPS habilitado

### 4. Monitoramento

#### Logs de Segurança:
- Tentativas de login falharam
- Acessos não autorizados
- Erros de API
- Uso excessivo de recursos

#### Alertas Recomendados:
- Múltiplas tentativas de login falharam
- Uso anômalo de APIs
- Erros de autenticação

### 5. Backup e Recuperação

#### Backup Regular:
- Banco de dados diário
- Configurações de ambiente
- Chaves de API (armazenamento seguro)

#### Plano de Recuperação:
- Procedimentos de restauração
- Contatos de emergência
- Documentação de configuração

### 6. Atualizações de Segurança

#### Manutenção Regular:
```bash
# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix

# Atualizar dependências
npm update
```

#### Rotação de Chaves:
- JWT_SECRET: A cada 90 dias
- SESSION_SECRET: A cada 90 dias
- APIs externas: Conforme política do provedor

### 7. Contatos de Emergência

- **Administrador do Sistema**: [seu-email@dominio.com]
- **Suporte Técnico**: [suporte@dominio.com]
- **Segurança**: [seguranca@dominio.com]

---

**Última atualização**: Janeiro 2025
**Próxima revisão**: Abril 2025