import { Brain } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin">
        <Brain className="h-8 w-8 text-primary" />
      </div>
    </div>
  );
};