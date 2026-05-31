import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { useEffect } from "react";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "Not Found — Hamisathi";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="size-16 rounded-2xl bg-gradient-ai grid place-items-center mb-6">
        <Shield className="size-8 text-ai-foreground" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight">404 - Page not found</h1>
      <p className="mt-4 text-muted-foreground max-w-sm">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="mt-8 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 shadow-elegant">
        Return Home
      </Link>
    </div>
  );
}
