import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PlayCircle, Plus, Edit, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  thumbnail_url: string;
  duration_minutes: number;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar cursos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseStatus = async (courseId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_active: !isActive })
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status do curso atualizado",
      });
      
      fetchCourses();
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do curso",
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
          <PlayCircle className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Cursos</h1>
            <p className="text-muted-foreground">Gerencie os cursos da plataforma</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Curso
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cursos ({courses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{course.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {course.description?.substring(0, 50)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {course.duration_minutes ? `${course.duration_minutes} min` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.order_index}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={course.is_active ? 'default' : 'secondary'}>
                      {course.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(course.created_at).toLocaleDateString('pt-BR')}
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
                        variant={course.is_active ? "destructive" : "default"}
                        onClick={() => toggleCourseStatus(course.id, course.is_active)}
                      >
                        {course.is_active ? 'Desativar' : 'Ativar'}
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