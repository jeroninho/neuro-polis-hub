import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Users, UserPlus, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  user_id: string;
  display_name: string;
  created_at: string;
  email_notifications: boolean;
  user_roles?: {
    role: string;
  }[];
}

export const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        user_roles: userRoles?.filter(role => role.user_id === profile.user_id) || []
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userIdFromProfile: string, newRole: 'admin' | 'moderator' | 'user') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userIdFromProfile,
          role: newRole
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Papel do usuário atualizado",
      });
      
      fetchUsers();
    } catch (error) {
      console.error('Erro ao atualizar papel:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar papel do usuário",
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
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Usuários</h1>
            <p className="text-muted-foreground">Gerencie os usuários da plataforma</p>
          </div>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Convidar Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead>Notificações</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.display_name || 'Sem nome'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      user.user_roles?.[0]?.role === 'admin' ? 'default' :
                      user.user_roles?.[0]?.role === 'moderator' ? 'secondary' :
                      'outline'
                    }>
                      {user.user_roles?.[0]?.role || 'user'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.email_notifications ? 'default' : 'secondary'}>
                      {user.email_notifications ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateUserRole(user.user_id, 'admin')}
                      >
                        <Shield className="mr-1 h-3 w-3" />
                        Admin
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateUserRole(user.user_id, 'user')}
                      >
                        Usuário
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