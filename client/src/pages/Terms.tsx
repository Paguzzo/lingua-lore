import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Terms = () => {
  useEffect(() => {
    document.title = "Termos de Uso - CriativeIA";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Termos de Uso do CriativeIA. Conheça as condições de uso da nossa plataforma de inteligência artificial para criação de conteúdo.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Termos de Uso - CriativeIA"
        description="Leia os termos de uso do CriativeIA. Conheça as regras e condições para utilização da nossa plataforma de conteúdo sobre inteligência artificial."
        url={window.location.href}
        type="website"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            Termos de Uso
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              <strong>Última atualização:</strong> 1º de janeiro de 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
              <p className="mb-4">
                Ao acessar e usar o CriativeIA, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                Se você não concordar com qualquer parte destes termos, não deve usar nosso serviço.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
              <p className="mb-4">
                O CriativeIA é uma plataforma que combina inteligência artificial com criatividade humana para 
                auxiliar na criação de conteúdo. Oferecemos ferramentas e recursos para melhorar a produtividade 
                criativa de nossos usuários.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Uso Aceitável</h2>
              <p className="mb-4">Você concorda em usar o CriativeIA apenas para fins legais e de acordo com estes Termos. É proibido:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Usar o serviço para criar conteúdo ilegal, prejudicial ou ofensivo</li>
                <li>Tentar hackear, interferir ou comprometer a segurança da plataforma</li>
                <li>Usar o serviço para spam ou atividades maliciosas</li>
                <li>Violar direitos de propriedade intelectual de terceiros</li>
                <li>Compartilhar credenciais de acesso com terceiros</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Propriedade Intelectual</h2>
              <p className="mb-4">
                O conteúdo gerado através do CriativeIA pertence ao usuário que o criou. No entanto, 
                você concede ao CriativeIA uma licença limitada para usar, armazenar e processar seu 
                conteúdo para fornecer e melhorar nossos serviços.
              </p>
              <p className="mb-4">
                Todos os direitos sobre a tecnologia, software e marca CriativeIA permanecem de nossa propriedade.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Privacidade e Dados</h2>
              <p className="mb-4">
                Sua privacidade é importante para nós. O uso de seus dados pessoais é regido por nossa 
                <a href="/privacy" className="text-primary hover:underline"> Política de Privacidade</a>, 
                que faz parte integrante destes Termos de Uso.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Limitação de Responsabilidade</h2>
              <p className="mb-4">
                O CriativeIA é fornecido "como está" sem garantias de qualquer tipo. Não nos responsabilizamos 
                por danos diretos, indiretos, incidentais ou consequenciais resultantes do uso de nosso serviço.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Modificações dos Termos</h2>
              <p className="mb-4">
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
                As alterações entrarão em vigor imediatamente após a publicação. 
                O uso continuado do serviço após as modificações constitui aceitação dos novos termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Rescisão</h2>
              <p className="mb-4">
                Podemos suspender ou encerrar sua conta a qualquer momento, com ou sem aviso, 
                por violação destes Termos ou por qualquer outro motivo a nosso critério.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Lei Aplicável</h2>
              <p className="mb-4">
                Estes Termos de Uso são regidos pelas leis do Brasil. 
                Qualquer disputa será resolvida nos tribunais competentes do Brasil.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Contato</h2>
              <p className="mb-4">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através da nossa 
                <a href="/contact" className="text-primary hover:underline"> página de contato</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;