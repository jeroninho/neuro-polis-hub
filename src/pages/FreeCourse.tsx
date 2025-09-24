import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import abnpLogo from "@/assets/abnp-logo.png";

const FreeCourse = () => {
  const navigate = useNavigate();
  const [completedVideos, setCompletedVideos] = useState<number[]>([]);
  const [currentVideo, setCurrentVideo] = useState(0);

  const videos = [
    {
      id: 1,
      title: "Introdução à Neurociência Política",
      description: "Fundamentos básicos da neurociência aplicada à política",
      duration: "12 min",
      youtubeId: "dQw4w9WgXcQ", // Placeholder - substitua pelos IDs reais dos vídeos
    },
    {
      id: 2,
      title: "Como o Cérebro Toma Decisões Políticas",
      description: "Processos neurológicos por trás das escolhas políticas",
      duration: "11 min",
      youtubeId: "dQw4w9WgXcQ", // Placeholder
    },
    {
      id: 3,
      title: "Emoções e Racionalidade na Política",
      description: "O papel das emoções nas decisões políticas",
      duration: "10 min",
      youtubeId: "dQw4w9WgXcQ", // Placeholder
    },
    {
      id: 4,
      title: "Aplicações Práticas - Casos Reais",
      description: "Exemplos práticos de neurociência política em ação",
      duration: "12 min",
      youtubeId: "dQw4w9WgXcQ", // Placeholder
    },
  ];

  const markVideoCompleted = (videoId: number) => {
    if (!completedVideos.includes(videoId)) {
      setCompletedVideos([...completedVideos, videoId]);
    }
  };

  const progressPercentage = (completedVideos.length / videos.length) * 100;

  return (
    <div className="min-h-screen gradient-dashboard">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="academic-container">
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
              <h2 className="text-lg font-semibold">Curso Gratuito de Neurociência Política</h2>
              <p className="text-sm text-muted-foreground">45 minutos • 4 vídeos</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Progresso</p>
              <p className="text-lg font-bold text-primary">{Math.round(progressPercentage)}%</p>
            </div>
          </div>
        </div>
      </header>

      <div className="academic-container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="gradient-card shadow-glow">
              <CardContent className="p-0">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videos[currentVideo].youtubeId}`}
                    title={videos[currentVideo].title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{videos[currentVideo].title}</h3>
                      <p className="text-muted-foreground mb-3">
                        {videos[currentVideo].description}
                      </p>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {videos[currentVideo].duration}
                        </Badge>
                        <Badge variant="secondary">
                          Vídeo {currentVideo + 1} de {videos.length}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => markVideoCompleted(videos[currentVideo].id)}
                      variant={completedVideos.includes(videos[currentVideo].id) ? "default" : "outline"}
                      className="shrink-0"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {completedVideos.includes(videos[currentVideo].id) ? "Concluído" : "Marcar como Concluído"}
                    </Button>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso do Curso</span>
                      <span>{completedVideos.length} de {videos.length} vídeos concluídos</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Playlist */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Lista de Vídeos
                </CardTitle>
                <CardDescription>
                  Curso completo de neurociência política
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {videos.map((video, index) => (
                  <div
                    key={video.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      currentVideo === index 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setCurrentVideo(index)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-1">
                        {completedVideos.includes(video.id) ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            currentVideo === index ? "border-primary" : "border-muted-foreground"
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm mb-1 ${
                          currentVideo === index ? "text-primary" : "text-foreground"
                        }`}>
                          {video.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {video.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {video.duration}
                          </Badge>
                          {currentVideo === index && (
                            <Badge variant="default" className="text-xs">
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
            {completedVideos.length === videos.length && (
              <Card className="border-primary bg-primary/5">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Parabéns!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Você concluiu o curso gratuito de neurociência política!
                  </p>
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