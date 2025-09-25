import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Info } from 'lucide-react';

export const AdminLoginInfo = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Alert className="border-primary/20 bg-primary/5">
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <div className="space-y-2">
            <p className="font-semibold">Acesso Administrativo:</p>
            <p>Faça login com qualquer conta existente para ver o botão "Admin" no header.</p>
            <p className="text-xs text-muted-foreground">
              Se você se cadastrou recentemente, você já tem acesso de admin.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};