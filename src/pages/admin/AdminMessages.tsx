import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MessageSquare, Plus, Eye, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  title: string;
  content: string;
  message_type: string;
  is_read: boolean;
  is_broadcast: boolean;
  target_audience: any;
  recipient_id: string;
  sender_id: string;
  created_at: string;
}

export const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar mensagens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'announcement': return 'default';
      case 'promotion': return 'secondary';
      case 'system': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'info': 'Informação',
      'announcement': 'Anúncio',
      'promotion': 'Promoção',
      'system': 'Sistema'
    };
    return labels[type] || type;
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
          <MessageSquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Mensagens</h1>
            <p className="text-muted-foreground">Gerencie as mensagens do sistema</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Mensagem
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Mensagens ({messages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Broadcast</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{message.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {message.content.substring(0, 50)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeVariant(message.message_type)}>
                      {getTypeLabel(message.message_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={message.is_broadcast ? 'default' : 'outline'}>
                      {message.is_broadcast ? 'Sim' : 'Não'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={message.is_read ? 'secondary' : 'default'}>
                      {message.is_read ? 'Lida' : 'Não lida'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(message.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-1 h-3 w-3" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline">
                        <Send className="mr-1 h-3 w-3" />
                        Reenviar
                      </Button>
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