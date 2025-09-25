import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Mail, Plus, Send, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Campaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  template: string;
  target_audience: any;
  scheduled_at: string;
  sent_at: string;
  status: string;
  sent_count: number;
  open_count: number;
  click_count: number;
  created_by: string;
  created_at: string;
}

export const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar campanhas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'sending': return 'secondary';
      case 'scheduled': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'draft': 'Rascunho',
      'scheduled': 'Agendado',
      'sending': 'Enviando',
      'sent': 'Enviado',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Mail className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Campanhas de Email</h1>
            <p className="text-muted-foreground">Gerencie campanhas de marketing por email</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Campanha
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Campanhas ({campaigns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enviados</TableHead>
                <TableHead>Taxa de Abertura</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">
                    {campaign.title}
                  </TableCell>
                  <TableCell>
                    {campaign.subject}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(campaign.status)}>
                      {getStatusLabel(campaign.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {campaign.sent_count || 0}
                  </TableCell>
                  <TableCell>
                    {campaign.sent_count > 0 ? 
                      `${Math.round((campaign.open_count / campaign.sent_count) * 100)}%` : 
                      'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    {new Date(campaign.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-1 h-3 w-3" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="mr-1 h-3 w-3" />
                        Editar
                      </Button>
                      {campaign.status === 'draft' && (
                        <Button size="sm" variant="default">
                          <Send className="mr-1 h-3 w-3" />
                          Enviar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};