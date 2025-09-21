import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Privacy = () => {
  useEffect(() => {
    document.title = "Política de Privacidade - CriativeIA";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Política de Privacidade do CriativeIA. Saiba como coletamos, usamos e protegemos seus dados pessoais em nossa plataforma.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Política de Privacidade - CriativeIA"
        description="Conheça nossa política de privacidade e como protegemos seus dados pessoais no CriativeIA. Transparência e segurança em primeiro lugar."
        url={window.location.href}
        type="website"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            Política de Privacidade
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              <strong>Última atualização:</strong> 1º de janeiro de 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
              <p className="mb-4">
                O CriativeIA ("nós", "nosso" ou "nos") está comprometido em proteger sua privacidade. 
                Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos 
                suas informações quando você usa nosso serviço.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Informações que Coletamos</h2>
              
              <h3 className="text-xl font-semibold mb-3">2.1 Informações Fornecidas por Você</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Nome e endereço de e-mail ao criar uma conta</li>
                <li>Conteúdo que você cria ou carrega em nossa plataforma</li>
                <li>Comunicações que você envia para nós</li>
                <li>Informações de perfil opcionais</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.2 Informações Coletadas Automaticamente</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Endereço IP e informações do dispositivo</li>
                <li>Dados de uso e navegação</li>
                <li>Cookies e tecnologias similares</li>
                <li>Logs de atividade na plataforma</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Como Usamos Suas Informações</h2>
              <p className="mb-4">Usamos suas informações para:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Personalizar sua experiência</li>
                <li>Comunicar com você sobre atualizações e novidades</li>
                <li>Detectar e prevenir fraudes ou uso indevido</li>
                <li>Cumprir obrigações legais</li>
                <li>Analisar tendências e uso da plataforma</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Compartilhamento de Informações</h2>
              <p className="mb-4">Não vendemos suas informações pessoais. Podemos compartilhar suas informações apenas nas seguintes situações:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Com seu consentimento explícito</li>
                <li>Com prestadores de serviços que nos ajudam a operar a plataforma</li>
                <li>Para cumprir obrigações legais ou responder a processos legais</li>
                <li>Para proteger nossos direitos, propriedade ou segurança</li>
                <li>Em caso de fusão, aquisição ou venda de ativos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Segurança dos Dados</h2>
              <p className="mb-4">
                Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger 
                suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. 
                Isso inclui:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento regular de segurança</li>
                <li>Treinamento de funcionários sobre privacidade</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Seus Direitos</h2>
              <p className="mb-4">De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem os seguintes direitos:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Acesso aos seus dados pessoais</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação de dados</li>
                <li>Portabilidade dos dados</li>
                <li>Eliminação dos dados tratados com consentimento</li>
                <li>Revogação do consentimento</li>
                <li>Oposição ao tratamento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Cookies e Tecnologias Similares</h2>
              <p className="mb-4">
                Usamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso 
                da plataforma e personalizar conteúdo. Você pode controlar o uso de cookies através 
                das configurações do seu navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Retenção de Dados</h2>
              <p className="mb-4">
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os 
                propósitos descritos nesta política, a menos que um período de retenção mais longo 
                seja exigido ou permitido por lei.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Transferências Internacionais</h2>
              <p className="mb-4">
                Seus dados podem ser transferidos e processados em países fora do Brasil. 
                Garantimos que tais transferências sejam realizadas com adequadas salvaguardas 
                de proteção de dados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Menores de Idade</h2>
              <p className="mb-4">
                Nosso serviço não é direcionado a menores de 18 anos. Não coletamos intencionalmente 
                informações pessoais de menores de 18 anos sem o consentimento dos pais ou responsáveis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Alterações nesta Política</h2>
              <p className="mb-4">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você 
                sobre alterações significativas através de e-mail ou aviso em nossa plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Contato</h2>
              <p className="mb-4">
                Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, 
                entre em contato conosco:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>E-mail: privacidade@criativeai.com</li>
                <li>Através da nossa <a href="/contact" className="text-primary hover:underline">página de contato</a></li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;