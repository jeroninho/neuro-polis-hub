import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FileText, Plus, Edit, Eye, Trash2 } from 'lucide-react';
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

interface ArticleFormData {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  slug: string;
  featured_image_url: string;
  external_url: string;
  is_active: boolean;
}

export const AdminArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    slug: '',
    featured_image_url: '',
    external_url: '',
    is_active: true
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      slug: '',
      featured_image_url: '',
      external_url: '',
      is_active: true
    });
    setEditingArticle(null);
  };

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

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Erro",
        description: "Título e conteúdo são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update(formData)
          .eq('id', editingArticle.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Artigo atualizado com sucesso",
        });
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Artigo criado com sucesso",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchArticles();
    } catch (error) {
      console.error('Erro ao salvar artigo:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${editingArticle ? 'atualizar' : 'criar'} artigo`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content || '',
      author: article.author || '',
      slug: article.slug || '',
      featured_image_url: article.featured_image_url || '',
      external_url: article.external_url || '',
      is_active: article.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (articleId: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Artigo deletado com sucesso",
      });
      
      fetchArticles();
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar artigo",
        variant: "destructive",
      });
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
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
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Artigo
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? 'Editar Artigo' : 'Criar Novo Artigo'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Digite o título do artigo"
                  />
                </div>
                <div>
                  <Label htmlFor="author">Autor</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Nome do autor"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Resumo do artigo"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="content">Conteúdo *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Conteúdo completo do artigo"
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="url-do-artigo"
                  />
                </div>
                <div>
                  <Label htmlFor="external_url">URL Externa</Label>
                  <Input
                    id="external_url"
                    value={formData.external_url}
                    onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                    placeholder="https://exemplo.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="featured_image_url">URL da Imagem de Capa</Label>
                <Input
                  id="featured_image_url"
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Artigo ativo</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmit} className="flex-1">
                  {editingArticle ? 'Atualizar Artigo' : 'Criar Artigo'}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(article)}
                      >
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="mr-1 h-3 w-3" />
                            Deletar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso deletará permanentemente o artigo "{article.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(article.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Deletar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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