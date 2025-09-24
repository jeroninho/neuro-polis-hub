import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  BookOpen, 
  FileText, 
  Tag, 
  User, 
  Play, 
  ExternalLink, 
  Clock,
  Award,
  Users
} from "lucide-react";

interface DashboardProps {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Brain },
    { id: "courses", label: "Cursos Gratuitos", icon: BookOpen },
    { id: "articles", label: "Artigos do Blog", icon: FileText },
    { id: "offers", label: "Ofertas Exclusivas", icon: Tag },
    { id: "profile", label: "Meu Perfil", icon: User },
  ];

  // Mock data - in real app, this would come from API/database
  const latestVideo = {
    title: "Fundamentos da Neurociência Política",
    duration: "15 min",
    thumbnail: "/placeholder.svg"
  };

  const latestArticle = {
    title: "Como as emoções influenciam decisões políticas",
    excerpt: "Descubra os mecanismos cerebrais por trás das escolhas políticas...",
    date: "2024-09-20"
  };

  const featuredOffer = {
    title: "Método NeuroCP - Curso Completo",
    originalPrice: "R$ 497",
    discountPrice: "R$ 297",
    discount: "40% OFF"
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Bem-vindo, {user.name}!
              </h1>
              <p className="text-muted-foreground">
                Confira as novidades e continue sua jornada de aprendizado.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Latest Video */}
              <Card className="hover-lift">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Último Vídeo</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Play className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="font-semibold">{latestVideo.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {latestVideo.duration}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveSection("courses")}
                  >
                    Assistir Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Latest Article */}
              <Card className="hover-lift">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Último Artigo</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <h3 className="font-semibold">{latestArticle.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {latestArticle.excerpt}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Publicado em {new Date(latestArticle.date).toLocaleDateString('pt-BR')}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveSection("articles")}
                  >
                    Ler Mais
                  </Button>
                </CardContent>
              </Card>

              {/* Featured Offer */}
              <Card className="hover-accent border-accent/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Oferta Especial</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {featuredOffer.discount}
                  </Badge>
                  <h3 className="font-semibold">{featuredOffer.title}</h3>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground line-through">
                      De {featuredOffer.originalPrice}
                    </div>
                    <div className="text-xl font-bold text-accent">
                      Por {featuredOffer.discountPrice}
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-accent hover:bg-accent-light text-accent-foreground"
                    onClick={() => setActiveSection("offers")}
                  >
                    Ver Oferta
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "courses":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Cursos Gratuitos</h1>
              <p className="text-muted-foreground">
                Acesse nossa playlist curada de conteúdos fundamentais.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="hover-lift">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                      <Play className="h-12 w-12 text-primary" />
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold">Aula {i}: Fundamentos Neuropolíticos</h3>
                      <p className="text-sm text-muted-foreground">
                        Introdução aos conceitos básicos da neurociência política...
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-muted-foreground">15 min</span>
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-1" />
                          Assistir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="text-center py-8 space-y-4">
                <Award className="h-16 w-16 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Quer continuar aprendendo?</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Acesse o Método NeuroCP completo e se torne um especialista em neurociência política.
                </p>
                <Button className="bg-primary hover:bg-primary-dark text-primary-foreground">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Conhecer o Método NeuroCP
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "articles":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Artigos do Blog</h1>
              <p className="text-muted-foreground">
                Conteúdos atualizados direto do blog oficial da ABNP.
              </p>
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg">
                          Artigo {i}: Neurociência e Comportamento Eleitoral
                        </h3>
                        <p className="text-muted-foreground">
                          Como os processos cerebrais influenciam as decisões eleitorais e o que isso significa para a democracia moderna...
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm text-muted-foreground">
                            20 de setembro, 2024
                          </span>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Ler Mais
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "offers":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Ofertas Exclusivas</h1>
              <p className="text-muted-foreground">
                Acesso especial aos nossos cursos premium com desconto exclusivo.
              </p>
            </div>

            <Card className="border-accent/30 shadow-accent">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <Badge variant="secondary" className="bg-accent text-accent-foreground text-lg px-3 py-1">
                      OFERTA ESPECIAL - 40% OFF
                    </Badge>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Método NeuroCP</h2>
                      <p className="text-lg text-muted-foreground">
                        O curso mais completo de neurociência política do Brasil
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <span>Certificação internacional</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span>+50 horas de conteúdo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span>Comunidade exclusiva</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-lg text-muted-foreground line-through">
                        De R$ 497,00
                      </div>
                      <div className="text-4xl font-bold text-accent">
                        R$ 297,00
                      </div>
                      <div className="text-sm text-muted-foreground">
                        À vista ou em até 12x de R$ 29,70
                      </div>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full bg-accent hover:bg-accent-light text-accent-foreground text-lg py-6"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Garantir Minha Vaga
                    </Button>
                  </div>

                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Play className="h-16 w-16 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Meu Perfil</h1>
              <p className="text-muted-foreground">
                Gerencie suas informações pessoais e preferências.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <div className="text-lg">{user.name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">E-mail</label>
                    <div className="text-lg">{user.email}</div>
                  </div>
                  <Button variant="outline">Editar Informações</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progresso de Aprendizado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Vídeos Assistidos</span>
                      <span>3/15</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{width: '20%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Artigos Lidos</span>
                      <span>2/25</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{width: '8%'}}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="academic-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">ABNP</span>
            </div>
            <Button variant="ghost" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="academic-container py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};