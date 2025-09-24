import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 animate-fade-in">
        <Brain className="h-24 w-24 text-primary mx-auto" />
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Página não encontrada</h2>
          <p className="text-muted-foreground max-w-md">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-dark text-primary-foreground">
          <a href="/">Voltar ao Início</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
