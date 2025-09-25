import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  FileText, 
  Mail, 
  TrendingUp, 
  Calendar,
  Clock,
  Eye,
  Play,
  MessageSquare
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalArticles: number;
  totalCampaigns: number;
  totalMessages: number;
  newUsersToday: number;
  activeSessions: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentActivity();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [
        usersResponse,
        coursesResponse,
        articlesResponse,
        campaignsResponse,
        messagesResponse,
        progressResponse
      ] = await Promise.all([
        supabase.from('profiles').select('id, created_at'),
        supabase.from('courses').select('id').eq('is_active', true),
        supabase.from('articles').select('id').eq('is_active', true),
        supabase.from('campaigns').select('id'),
        supabase.from('messages').select('id'),
        supabase.from('video_sessions').select('id, created_at')
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const newUsersToday = usersResponse.data?.filter(user => 
        new Date(user.created_at) >= today
      ).length || 0;

      const activeSessions = progressResponse.data?.filter(session => {
        const sessionDate = new Date(session.created_at);
        const daysDiff = (Date.now() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7; // Sessions in the last 7 days
      }).length || 0;

      setStats({
        totalUsers: usersResponse.data?.length || 0,
        totalCourses: coursesResponse.data?.length || 0,
        totalArticles: articlesResponse.data?.length || 0,
        totalCampaigns: campaignsResponse.data?.length || 0,
        totalMessages: messagesResponse.data?.length || 0,
        newUsersToday,
        activeSessions
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // Get recent user registrations
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, display_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent video sessions
      const { data: recentSessions } = await supabase
        .from('video_sessions')
        .select('id, video_id, created_at, profiles!inner(display_name)')
        .order('created_at', { ascending: false })
        .limit(5);

      const activity = [
        ...(recentUsers?.map(user => ({
          type: 'user_registered',
          title: 'Novo usuário cadastrado',
          description: user.display_name || 'Usuário sem nome',
          time: user.created_at,
          icon: Users
        })) || []),
        ...(recentSessions?.map(session => ({
          type: 'video_watched',
          title: 'Vídeo assistido',
          description: `${(session.profiles as any)?.display_name || 'Usuário'} assistiu um vídeo`,
          time: session.created_at,
          icon: Play
        })) || [])
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral das atividades e estatísticas da plataforma
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats?.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newUsersToday} hoje
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats?.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Cursos publicados
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artigos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats?.totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              Artigos publicados
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Ativas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats?.activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 7 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas de Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats?.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              Total de campanhas criadas
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats?.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              Mensagens enviadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Atividade Recente
          </CardTitle>
          <CardDescription>
            Últimas atividades na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma atividade recente encontrada
            </p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-muted-foreground text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.time).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};