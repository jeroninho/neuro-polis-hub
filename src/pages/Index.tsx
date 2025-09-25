import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return <Hero />;
};

export default Index;