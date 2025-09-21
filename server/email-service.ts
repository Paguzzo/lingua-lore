import nodemailer from 'nodemailer';

interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  emailEnabled: boolean;
  adminEmail: string;
  blogTitle: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig | null = null;

  async initialize() {
    try {
      // Usar apenas variáveis de ambiente quando DATABASE_URL não estiver configurado
      this.config = {
        smtpHost: process.env.SMTP_HOST || '',
        smtpPort: parseInt(process.env.SMTP_PORT || '587'),
        smtpUsername: process.env.SMTP_USERNAME || '',
        smtpPassword: process.env.SMTP_PASSWORD || '',
        emailEnabled: process.env.EMAIL_ENABLED === 'true',
        adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
        blogTitle: process.env.BLOG_TITLE || 'Lingua Lore'
      };

      if (this.config.emailEnabled && this.config.smtpHost) {
        this.transporter = nodemailer.createTransporter({
          host: this.config.smtpHost,
          port: this.config.smtpPort,
          secure: this.config.smtpPort === 465,
          auth: {
            user: this.config.smtpUsername,
            pass: this.config.smtpPassword,
          },
        });

        // Verificar conexão
        await this.transporter.verify();
        console.log('✅ Email service initialized successfully');
      } else {
        console.log('ℹ️ Email service disabled or not configured');
      }
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
      this.transporter = null;
    }
  }

  async sendWelcomeEmail(email: string, name?: string) {
    if (!this.transporter || !this.config) {
      console.log('Email service not available, skipping welcome email');
      return false;
    }

    try {
      const displayName = name || email.split('@')[0];
      const subject = `Bem-vindo(a) à newsletter do ${this.config.blogTitle}!`;
      
      const htmlContent = this.generateWelcomeEmailTemplate(displayName);
      const textContent = this.generateWelcomeEmailText(displayName);

      await this.transporter.sendMail({
        from: `"${this.config.blogTitle}" <${this.config.adminEmail}>`,
        to: email,
        subject: subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`✅ Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      return false;
    }
  }

  private generateWelcomeEmailTemplate(name: string): string {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo(a) à nossa newsletter!</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8fafc;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #8b5cf6;
                margin-bottom: 10px;
            }
            .welcome-title {
                font-size: 24px;
                color: #1f2937;
                margin-bottom: 20px;
            }
            .content {
                font-size: 16px;
                line-height: 1.8;
                margin-bottom: 30px;
            }
            .highlight {
                background: linear-gradient(135deg, #8b5cf6, #3b82f6);
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                font-size: 14px;
                color: #6b7280;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
            }
            .unsubscribe {
                color: #9ca3af;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">${this.config?.blogTitle || 'Lingua Lore'}</div>
                <h1 class="welcome-title">Bem-vindo(a), ${name}! 🎉</h1>
            </div>
            
            <div class="content">
                <p>Obrigado por se inscrever na nossa newsletter! Estamos muito felizes em tê-lo(a) conosco.</p>
                
                <div class="highlight">
                    <h3 style="margin-top: 0; color: white;">O que você pode esperar:</h3>
                    <ul style="margin-bottom: 0; color: white;">
                        <li>📚 Conteúdos exclusivos sobre IA e tecnologia</li>
                        <li>🚀 Dicas práticas para aumentar sua produtividade</li>
                        <li>🔧 Reviews das melhores ferramentas do mercado</li>
                        <li>💡 Insights e tendências do mundo tech</li>
                    </ul>
                </div>
                
                <p>Nossos emails são enviados semanalmente, sempre com conteúdo de qualidade e sem spam. Prometemos que cada email será valioso para você!</p>
                
                <p>Se você tiver alguma dúvida ou sugestão, não hesite em responder este email. Adoramos conversar com nossos leitores!</p>
                
                <p>Mais uma vez, seja muito bem-vindo(a)!</p>
                
                <p><strong>Equipe ${this.config?.blogTitle || 'Lingua Lore'}</strong></p>
            </div>
            
            <div class="footer">
                <p>Você está recebendo este email porque se inscreveu na nossa newsletter.</p>
                <p><a href="#" class="unsubscribe">Cancelar inscrição</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private generateWelcomeEmailText(name: string): string {
    return `
Bem-vindo(a), ${name}!

Obrigado por se inscrever na newsletter do ${this.config?.blogTitle || 'Lingua Lore'}! Estamos muito felizes em tê-lo(a) conosco.

O que você pode esperar:
- Conteúdos exclusivos sobre IA e tecnologia
- Dicas práticas para aumentar sua produtividade
- Reviews das melhores ferramentas do mercado
- Insights e tendências do mundo tech

Nossos emails são enviados semanalmente, sempre com conteúdo de qualidade e sem spam. Prometemos que cada email será valioso para você!

Se você tiver alguma dúvida ou sugestão, não hesite em responder este email. Adoramos conversar com nossos leitores!

Mais uma vez, seja muito bem-vindo(a)!

Equipe ${this.config?.blogTitle || 'Lingua Lore'}

---
Você está recebendo este email porque se inscreveu na nossa newsletter.
    `;
  }

  async sendTestEmail(to: string) {
    if (!this.transporter || !this.config) {
      throw new Error('Email service not configured');
    }

    try {
      await this.transporter.sendMail({
        from: `"${this.config.blogTitle}" <${this.config.adminEmail}>`,
        to: to,
        subject: 'Teste de Configuração de Email',
        text: 'Este é um email de teste para verificar se a configuração está funcionando corretamente.',
        html: '<p>Este é um email de teste para verificar se a configuração está funcionando corretamente.</p>',
      });

      return true;
    } catch (error) {
      console.error('Failed to send test email:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return this.transporter !== null && this.config !== null && this.config.emailEnabled;
  }
}

export const emailService = new EmailService();