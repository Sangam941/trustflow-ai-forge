import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ScoreProvider } from "@/context/ScoreContext";
import { Toaster } from "@/components/ui/sonner";
import { router } from "./router";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ScoreProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </ScoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
