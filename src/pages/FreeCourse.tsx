import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import abnpLogo from "@/assets/abnp-logo.png";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Course {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  duration_minutes: number;
  order_index: number;
}

const FreeCourse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentVideo, setCurrentVideo] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Extract YouTube ID from URL
  const extractYouTubeId = (url: string) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_active', true)
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

    fetchCourses();
  }, []);

  const videos = courses.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description || "Sem descrição",
    duration: course.duration_minutes ? `${course.duration_minutes} min` : "N/A",
    youtubeId: extractYouTubeId(course.youtube_url || ""),
  }));

  const videoIds = videos.map(video => video.youtubeId).filter(id => id);
  const { getVideoProgress, getTotalProgress, loading: progressLoading } = useVideoProgress(videoIds);
  const totalProgress = getTotalProgress();

  if (loading) {
    return (
      <div className="min-h-screen gradient-dashboard flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen gradient-dashboard flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <CardContent>
            <h2 className="text-xl font-bold mb-4">Nenhum curso disponível</h2>
            <p className="text-muted-foreground mb-4">
              Os cursos ainda não foram adicionados pelo administrador.
            </p>
            <Button onClick={() => navigate("/")}>
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleVideoProgress = (percentage: number, watchTime: number, currentTime: number) => {
    // Progress is automatically saved by the YouTube player component
  };

  const handleVideoComplete = () => {
    toast({
      title: "Vídeo concluído!",
      description: "Seu progresso foi salvo automaticamente.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <img 
                src={abnpLogo} 
                alt="ABNP Logo" 
                className="h-8 w-8 object-contain" 
              />
              <div>
                <h1 className="text-xl font-bold text-primary">ABNP</h1>
                <p className="text-xs text-muted-foreground">Academia</p>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">Cursos Disponíveis</h2>
              <p className="text-sm text-muted-foreground">
                {courses.reduce((total, course) => total + (course.duration_minutes || 0), 0)} minutos • {courses.length} vídeos
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Progresso</p>
              <p className="text-2xl font-bold text-primary">{totalProgress.completionPercentage}%</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              {/* Video Player */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {user ? (
                  <YouTubePlayer
                    videoId={videos[currentVideo].youtubeId}
                    onProgress={handleVideoProgress}
                    onComplete={handleVideoComplete}
                    autoResume={true}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black text-white">
                    <p>Faça login para assistir aos vídeos</p>
                  </div>
                )}
              </div>
              
              {/* Video Details */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{videos[currentVideo].title}</h3>
                    <p className="text-muted-foreground mb-3">
                      {videos[currentVideo].description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {getVideoProgress(videos[currentVideo].youtubeId).percentage}% assistido
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-primary text-primary-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {videos[currentVideo].duration}
                  </Badge>
                  <Badge variant="outline" className="bg-primary text-primary-foreground">
                    Vídeo {currentVideo + 1} de {videos.length}
                  </Badge>
                </div>
                
                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Progresso do Curso</span>
                    <span>{totalProgress.completedVideos} de {totalProgress.totalVideos} vídeos concluídos</span>
                  </div>
                  <Progress value={totalProgress.completionPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Tempo total assistido: {totalProgress.totalWatchTime} min</span>
                    <span>{getVideoProgress(videos[currentVideo].youtubeId).watchTime}s neste vídeo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Playlist */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Play className="h-5 w-5" />
                  Lista de Vídeos
                </CardTitle>
                <CardDescription>
                  Curso completo de neurociência política
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {videos.map((video, index) => (
                  <div
                    key={video.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                      currentVideo === index 
                        ? "border-primary bg-blue-50 dark:bg-blue-950/20" 
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setCurrentVideo(index)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        {getVideoProgress(video.youtubeId).completed ? (
                          <CheckCircle className="h-5 w-5 text-primary fill-current" />
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            currentVideo === index ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                          }`}>
                            {currentVideo === index ? (
                              <Play className="h-2.5 w-2.5 fill-current" />
                            ) : (
                              <div className={`w-2 h-2 rounded-full ${
                                getVideoProgress(video.youtubeId).percentage > 0 ? "bg-primary" : "bg-muted-foreground"
                              }`} />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium mb-1 ${
                          currentVideo === index ? "text-primary" : "text-foreground"
                        }`}>
                          {video.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {video.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {video.duration}
                            </span>
                          </div>
                          {currentVideo === index && (
                            <Badge className="text-xs bg-primary text-primary-foreground">
                              Assistindo
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Course Completion */}
            {totalProgress.completedVideos === videos.length && (
              <Card className="border-primary bg-primary/5">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Parabéns!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Você concluiu o curso gratuito de neurociência política!
                  </p>
                  <div className="text-sm text-muted-foreground mb-4">
                    <p>Tempo total assistido: {totalProgress.totalWatchTime} minutos</p>
                    <p>100% de conclusão alcançada</p>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => navigate("/")}
                  >
                    Voltar ao Painel
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeCourse;