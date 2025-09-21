import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Save, Globe, Mail, Bell } from "lucide-react";

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    siteName: 'Lingua Lore',
    siteDescription: 'Um blog sobre linguagens e culturas',
    siteUrl: 'http://localhost:5000',
    adminEmail: 'admin@example.com',
    enableComments: true,
    enableAnalytics: true,
    postsPerPage: 10,
    enableNewsletter: false
  });

  const { data: siteSettings, isLoading } = useQuery<SiteSetting[]>({
    queryKey: ['/api/site-settings'],
    queryFn: () => {
      // Simulando dados de configurações
      return Promise.resolve([
        {
          id: '1',
          key: 'site_name',
          value: 'Lingua Lore',
          type: 'string',
          description: 'Nome do site',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: typeof settings) => {
      // Simulando salvamento das configurações
      await new Promise(resolve => setTimeout(resolve, 1000));
      return newSettings;
    },
    onSuccess: () => {
      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleInputChange = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações gerais do seu blog
        </p>
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
              Configurações básicas do site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="siteName">Nome do Site</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  placeholder="Nome do seu blog"
                />
              </div>
              <div>
                <Label htmlFor="siteUrl">URL do Site</Label>
                <Input
                  id="siteUrl"
                  value={settings.siteUrl}
                  onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                  placeholder="https://seublog.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="siteDescription">Descrição do Site</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                placeholder="Descrição do seu blog"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configurações de Contato
            </CardTitle>
            <CardDescription>
              Informações de contato e comunicação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="adminEmail">Email do Administrador</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                placeholder="admin@seublog.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Funcionalidades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Funcionalidades
            </CardTitle>
            <CardDescription>
              Ative ou desative funcionalidades do blog
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Comentários</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir comentários nos posts
                </p>
              </div>
              <Switch
                checked={settings.enableComments}
                onCheckedChange={(checked) => handleInputChange('enableComments', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Coletar dados de analytics
                </p>
              </div>
              <Switch
                checked={settings.enableAnalytics}
                onCheckedChange={(checked) => handleInputChange('enableAnalytics', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Newsletter</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir inscrição em newsletter
                </p>
              </div>
              <Switch
                checked={settings.enableNewsletter}
                onCheckedChange={(checked) => handleInputChange('enableNewsletter', checked)}
              />
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="postsPerPage">Posts por Página</Label>
              <Input
                id="postsPerPage"
                type="number"
                value={settings.postsPerPage}
                onChange={(e) => handleInputChange('postsPerPage', parseInt(e.target.value) || 10)}
                min="1"
                max="50"
                className="w-24 mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Botão de Salvar */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={updateSettingsMutation.isPending}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {updateSettingsMutation.isPending ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>
    </div>
  );
}