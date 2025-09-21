import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Contato - CriativeIA";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Entre em contato com o CriativeIA. Tire suas dúvidas, envie sugestões ou solicite suporte para nossa plataforma de IA.');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pelo contato. Responderemos em breve.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Contato - CriativeIA"
        description="Entre em contato conosco! Tire suas dúvidas, envie sugestões ou solicite parcerias. Estamos aqui para ajudar você com inteligência artificial."
        url={window.location.href}
        type="website"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Entre em Contato
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tem alguma dúvida, sugestão ou precisa de ajuda? Estamos aqui para ajudar!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Envie uma Mensagem</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo e entraremos em contato o mais breve possível.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Nome *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        E-mail *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Assunto *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Assunto da sua mensagem"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Mensagem *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Descreva sua dúvida, sugestão ou como podemos ajudar..."
                      rows={6}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                  <CardDescription>
                    Outras formas de entrar em contato conosco.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">E-mail</h3>
                      <p className="text-muted-foreground">contato@criativeai.com</p>
                      <p className="text-sm text-muted-foreground">Para dúvidas gerais e suporte</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Suporte Técnico</h3>
                      <p className="text-muted-foreground">suporte@criativeai.com</p>
                      <p className="text-sm text-muted-foreground">Para problemas técnicos e bugs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Parcerias</h3>
                      <p className="text-muted-foreground">parcerias@criativeai.com</p>
                      <p className="text-sm text-muted-foreground">Para oportunidades de negócio</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Horário de Atendimento</h3>
                      <p className="text-muted-foreground">Segunda a Sexta: 9h às 18h</p>
                      <p className="text-sm text-muted-foreground">Horário de Brasília (GMT-3)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Perguntas Frequentes</CardTitle>
                  <CardDescription>
                    Respostas para as dúvidas mais comuns.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Como funciona o CriativeIA?</h4>
                    <p className="text-sm text-muted-foreground">
                      Nossa plataforma combina inteligência artificial avançada com ferramentas 
                      intuitivas para ajudar você a criar conteúdo de alta qualidade.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">É gratuito?</h4>
                    <p className="text-sm text-muted-foreground">
                      Oferecemos um plano gratuito com funcionalidades básicas e planos pagos 
                      com recursos avançados.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Meus dados estão seguros?</h4>
                    <p className="text-sm text-muted-foreground">
                      Sim! Seguimos rigorosos padrões de segurança e privacidade. 
                      Consulte nossa <a href="/privacy" className="text-primary hover:underline">Política de Privacidade</a>.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;