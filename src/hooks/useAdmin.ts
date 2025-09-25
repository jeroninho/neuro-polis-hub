import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'moderator' | 'user';

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsModerator(false);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .order('role', { ascending: true }) // admin first, then moderator, then user
          .limit(1)
          .single();

        if (error) {
          console.error('Error checking user role:', error);
          setRole('user');
          setIsAdmin(false);
          setIsModerator(false);
        } else {
          const userRole = roleData?.role as UserRole || 'user';
          setRole(userRole);
          setIsAdmin(userRole === 'admin');
          setIsModerator(userRole === 'admin' || userRole === 'moderator');
        }
      } catch (error) {
        console.error('Error in checkUserRole:', error);
        setRole('user');
        setIsAdmin(false);
        setIsModerator(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [user]);

  return {
    isAdmin,
    isModerator,
    role,
    loading,
    hasRole: (requiredRole: UserRole) => {
      if (role === 'admin') return true;
      if (role === 'moderator' && requiredRole !== 'admin') return true;
      return role === requiredRole;
    }
  };
};