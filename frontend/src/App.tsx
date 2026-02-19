import { TooltipProvider } from "@radix-ui/react-tooltip";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import AppRoutes from "./AppRoutes";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import { Toaster as Sonner } from "./components/ui/sonner";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
