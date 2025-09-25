import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Tag, Plus, Edit, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount_percentage: number;
  discount_amount: number;
  original_price: number;
  final_price: number;
  coupon_code: string;
  max_uses: number;
  current_uses: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  external_url: string;
  created_at: string;
}

export const AdminOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar ofertas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleOfferStatus = async (offerId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ is_active: !isActive })
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status da oferta atualizado",
      });
      
      fetchOffers();
    } catch (error) {
      console.error('Erro ao atualizar oferta:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da oferta",
        variant: "destructive",
      });
    }
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
          <Tag className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Ofertas</h1>
            <p className="text-muted-foreground">Gerencie as ofertas e cupons</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Oferta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ofertas ({offers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead>Cupom</TableHead>
                <TableHead>Usos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{offer.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {offer.description?.substring(0, 40)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {offer.discount_percentage && (
                        <Badge variant="outline">{offer.discount_percentage}%</Badge>
                      )}
                      {offer.discount_amount && (
                        <Badge variant="outline">R$ {offer.discount_amount}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {offer.coupon_code || 'N/A'}
                    </code>
                  </TableCell>
                  <TableCell>
                    {offer.current_uses || 0} / {offer.max_uses || '∞'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={offer.is_active ? 'default' : 'secondary'}>
                      {offer.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Até: {offer.valid_until ? 
                        new Date(offer.valid_until).toLocaleDateString('pt-BR') : 
                        'Sem limite'
                      }</div>
                    </div>
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
                      <Button 
                        size="sm" 
                        variant={offer.is_active ? "destructive" : "default"}
                        onClick={() => toggleOfferStatus(offer.id, offer.is_active)}
                      >
                        {offer.is_active ? 'Desativar' : 'Ativar'}
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