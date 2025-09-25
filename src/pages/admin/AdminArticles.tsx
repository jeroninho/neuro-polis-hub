import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FileText, Plus, Edit, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  slug: string;
  featured_image_url: string;
  external_url: string;
  is_active: boolean;
  published_at: string;
  created_at: string;
}

export const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar artigos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleArticleStatus = async (articleId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ is_active: !isActive })
        .eq('id', articleId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status do artigo atualizado",
      });
      
      fetchArticles();
    } catch (error) {
      console.error('Erro ao atualizar artigo:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do artigo",
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
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Artigos</h1>
            <p className="text-muted-foreground">Gerencie os artigos do blog</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Artigo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Artigos ({articles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Publicado em</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{article.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {article.excerpt?.substring(0, 60)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{article.author || 'Não definido'}</TableCell>
                  <TableCell>
                    <Badge variant={article.is_active ? 'default' : 'secondary'}>
                      {article.is_active ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {article.published_at ? 
                      new Date(article.published_at).toLocaleDateString('pt-BR') : 
                      'Não publicado'
                    }
                  </TableCell>
                  <TableCell>
                    {new Date(article.created_at).toLocaleDateString('pt-BR')}
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
                        variant={article.is_active ? "destructive" : "default"}
                        onClick={() => toggleArticleStatus(article.id, article.is_active)}
                      >
                        {article.is_active ? 'Despublicar' : 'Publicar'}
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