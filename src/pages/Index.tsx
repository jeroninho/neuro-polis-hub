import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Index = () => {
  const { user, loading } = useAuth();
  const { isAdmin } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (user) {
    return (
      <>
        <Dashboard />
        {/* Mensagem informativa sobre acesso admin */}
        {isAdmin && (
          <div className="fixed bottom-4 right-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 max-w-sm shadow-lg z-50">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  ✅ Acesso de Administrador Ativo
                </p>
                <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                  Clique no botão "Admin" no header para acessar o painel administrativo
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return <Hero />;
};

export default Index;