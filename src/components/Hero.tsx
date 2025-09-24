import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, BookOpen, Award, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import abnpLogo from "@/assets/abnp-logo.png";

export const Hero = () => {
  const { signUp, signIn } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent, type: 'login' | 'register') => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (type === 'register' && !formData.name) {
      toast({
        title: "Erro de validação",
        description: "Nome é obrigatório para o cadastro.",
        variant: "destructive",
      });
      return;
    }

    try {
      let error;

      if (type === 'register') {
        const result = await signUp(formData.email, formData.password, formData.name);
        error = result.error;
      } else {
        const result = await signIn(formData.email, formData.password);
        error = result.error;
      }

      if (error) {
        toast({
          title: "Erro de autenticação",
          description: error.message || "Ocorreu um erro durante a autenticação.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: type === 'login' ? "Login realizado!" : "Cadastro realizado!",
        description: type === 'register' 
          ? "Verifique seu e-mail para confirmar o cadastro."
          : `Bem-vindo à plataforma ABNP!`,
      });

    } catch (err) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="academic-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <img 
                  src={abnpLogo} 
                  alt="ABNP Logo" 
                  className="h-16 w-16 object-contain" 
                />
                <div>
                  <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground">
                    ABNP
                  </h1>
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-serif text-primary-foreground/90">
                Academia Brasileira de Neurociência Política
              </h2>
              <p className="text-lg lg:text-xl text-primary-foreground/80 max-w-2xl">
                Domine os fundamentos da neurociência aplicada à política. 
                Acesse cursos gratuitos, artigos exclusivos e muito mais.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center space-y-2">
                <BookOpen className="h-8 w-8 text-accent mx-auto" />
                <h3 className="font-semibold text-primary-foreground">Cursos Gratuitos</h3>
                <p className="text-sm text-primary-foreground/70">Vídeos e conteúdos selecionados</p>
              </div>
              <div className="text-center space-y-2">
                <Award className="h-8 w-8 text-accent mx-auto" />
                <h3 className="font-semibold text-primary-foreground">Certificação</h3>
                <p className="text-sm text-primary-foreground/70">Método NeuroCP exclusivo</p>
              </div>
              <div className="text-center space-y-2">
                <Users className="h-8 w-8 text-accent mx-auto" />
                <h3 className="font-semibold text-primary-foreground">Comunidade</h3>
                <p className="text-sm text-primary-foreground/70">Conecte-se com especialistas</p>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="animate-slide-up">
            <Card className="gradient-card border-0 shadow-glow backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-primary">
                  Acesse Gratuitamente
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Entre ou cadastre-se para acessar todo o conteúdo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="register" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="register">Cadastrar</TabsTrigger>
                    <TabsTrigger value="login">Entrar</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="register" className="space-y-4 mt-6">
                    <form onSubmit={(e) => handleSubmit(e, 'register')} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Mínimo 6 caracteres"
                          minLength={6}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 hover-lift"
                      >
                        Cadastrar Gratuitamente
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="login" className="space-y-4 mt-6">
                    <form onSubmit={(e) => handleSubmit(e, 'login')} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">E-mail</Label>
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Senha</Label>
                        <Input
                          id="login-password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Sua senha"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 hover-lift"
                      >
                        Entrar no Painel
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};