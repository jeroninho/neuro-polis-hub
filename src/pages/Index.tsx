import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Index = () => {
  const { user, loading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  console.log('Index: Rendering with loading:', loading, 'adminLoading:', adminLoading, 'user:', !!user);

  if (loading || adminLoading) {
    console.log('Index: Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (user) {
    console.log('Index: User authenticated, showing Dashboard');
    return <Dashboard />;
  }

  console.log('Index: No user, showing Hero');
  return <Hero />;
};

export default Index;