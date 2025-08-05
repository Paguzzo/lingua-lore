
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Save, Globe, Mail, Bell, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    // Configurações Gerais
    blogTitle: 'CriativeIA',
    blogDescription: 'Impulsionando a criatividade com Inteligência Artificial',
    siteUrl: 'https://criativeai.com',
    adminEmail: 'admin@criativeai.com',
    
    // Configurações de Email
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    emailEnabled: false,
    
    // Configurações de Notificações
    emailNotifications: true,
    newPostNotifications: true,
    commentNotifications: true,
    
    // Configurações de SEO
    metaTitle: 'CriativeIA - Inteligência Artificial e Criatividade',
    metaDescription: 'Blog sobre inteligência artificial, criatividade e inovação tecnológica.',
    googleAnalyticsId: '',
    
    // Configurações de Segurança
    registrationEnabled: true,
    commentApproval: false,
    maxLoginAttempts: 5,
  });

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as configurações
    toast({ title: 'Configurações salvas com sucesso!' });
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações do seu blog</p>
      </div>

      <div className="grid gap-6">
        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
            <CardDescription>
              Informações básicas do seu blog
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="blogTitle">Título do Blog</Label>
                <Input
                  id="blogTitle"
                  value={settings.blogTitle}
                  onChange={(e) => updateSetting('blogTitle', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="siteUrl">URL do Site</Label>
                <Input
                  id="siteUrl"
                  value={settings.siteUrl}
                  onChange={(e) => updateSetting('siteUrl', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="blogDescription">Descrição do Blog</Label>
              <Textarea
                id="blogDescription"
                value={settings.blogDescription}
                onChange={(e) => updateSetting('blogDescription', e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="adminEmail">Email do Administrador</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => updateSetting('adminEmail', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configurações de Email
            </CardTitle>
            <CardDescription>
              Configure o servidor SMTP para envio de emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="emailEnabled"
                checked={settings.emailEnabled}
                onCheckedChange={(checked) => updateSetting('emailEnabled', checked)}
              />
              <Label htmlFor="emailEnabled">Habilitar envio de emails</Label>
            </div>
            
            {settings.emailEnabled && (
              <>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="smtpHost">Servidor SMTP</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost}
                      onChange={(e) => updateSetting('smtpHost', e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">Porta SMTP</Label>
                    <Input
                      id="smtpPort"
                      value={settings.smtpPort}
                      onChange={(e) => updateSetting('smtpPort', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="smtpUsername">Usuário SMTP</Label>
                    <Input
                      id="smtpUsername"
                      value={settings.smtpUsername}
                      onChange={(e) => updateSetting('smtpUsername', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">Senha SMTP</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={settings.smtpPassword}
                      onChange={(e) => updateSetting('smtpPassword', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Configurações de Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure quando receber notificações por email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">Receber notificações gerais por email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="newPostNotifications">Novos Posts</Label>
                <p className="text-sm text-muted-foreground">Notificar quando novos posts forem publicados</p>
              </div>
              <Switch
                id="newPostNotifications"
                checked={settings.newPostNotifications}
                onCheckedChange={(checked) => updateSetting('newPostNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="commentNotifications">Comentários</Label>
                <p className="text-sm text-muted-foreground">Notificar sobre novos comentários</p>
              </div>
              <Switch
                id="commentNotifications"
                checked={settings.commentNotifications}
                onCheckedChange={(checked) => updateSetting('commentNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de SEO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              SEO e Analytics
            </CardTitle>
            <CardDescription>
              Configure meta tags e ferramentas de análise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Título</Label>
              <Input
                id="metaTitle"
                value={settings.metaTitle}
                onChange={(e) => updateSetting('metaTitle', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="metaDescription">Meta Descrição</Label>
              <Textarea
                id="metaDescription"
                value={settings.metaDescription}
                onChange={(e) => updateSetting('metaDescription', e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
              <Input
                id="googleAnalyticsId"
                value={settings.googleAnalyticsId}
                onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configure opções de segurança do blog
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="registrationEnabled">Permitir Registro</Label>
                <p className="text-sm text-muted-foreground">Permitir novos usuários se registrarem</p>
              </div>
              <Switch
                id="registrationEnabled"
                checked={settings.registrationEnabled}
                onCheckedChange={(checked) => updateSetting('registrationEnabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="commentApproval">Aprovação de Comentários</Label>
                <p className="text-sm text-muted-foreground">Comentários precisam ser aprovados antes de aparecer</p>
              </div>
              <Switch
                id="commentApproval"
                checked={settings.commentApproval}
                onCheckedChange={(checked) => updateSetting('commentApproval', checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="maxLoginAttempts">Máximo de Tentativas de Login</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                min="1"
                max="10"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
