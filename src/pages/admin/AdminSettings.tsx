import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'ABNP Academy',
    siteDescription: 'Plataforma de cursos online',
    contactEmail: 'contato@abnp.academy',
    allowRegistration: true,
    requireEmailVerification: true,
    maintenanceMode: false,
    analyticsId: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    }
  });

  const { toast } = useToast();

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar as configurações
    toast({
      title: "Sucesso",
      description: "Configurações salvas com sucesso",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">Configure as opções gerais do sistema</p>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nome do Site</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email de Contato</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Descrição do Site</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permitir Novos Cadastros</Label>
                <p className="text-sm text-muted-foreground">
                  Permite que novos usuários se cadastrem na plataforma
                </p>
              </div>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Verificação de Email Obrigatória</Label>
                <p className="text-sm text-muted-foreground">
                  Requer verificação de email para novos usuários
                </p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings({...settings, requireEmailVerification: checked})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  placeholder="URL do Facebook"
                  value={settings.socialMedia.facebook}
                  onChange={(e) => setSettings({
                    ...settings, 
                    socialMedia: {...settings.socialMedia, facebook: e.target.value}
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="URL do Instagram"
                  value={settings.socialMedia.instagram}
                  onChange={(e) => setSettings({
                    ...settings, 
                    socialMedia: {...settings.socialMedia, instagram: e.target.value}
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  placeholder="URL do Twitter"
                  value={settings.socialMedia.twitter}
                  onChange={(e) => setSettings({
                    ...settings, 
                    socialMedia: {...settings.socialMedia, twitter: e.target.value}
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  placeholder="URL do YouTube"
                  value={settings.socialMedia.youtube}
                  onChange={(e) => setSettings({
                    ...settings, 
                    socialMedia: {...settings.socialMedia, youtube: e.target.value}
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo de Manutenção</Label>
                <p className="text-sm text-muted-foreground">
                  Ativa modo de manutenção para todo o site
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="analyticsId">Google Analytics ID</Label>
              <Input
                id="analyticsId"
                placeholder="GA-XXXXXXXXX"
                value={settings.analyticsId}
                onChange={(e) => setSettings({...settings, analyticsId: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};