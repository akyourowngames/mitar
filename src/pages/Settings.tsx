import { Navigate } from 'react-router-dom';
import { User, Mail } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';

export default function Settings() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-semibold text-foreground mb-6">Settings</h1>

          <div className="bg-secondary rounded-lg p-6">
            <h2 className="text-lg font-medium text-foreground mb-4">Profile</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{user.user_metadata?.name || 'Not set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-secondary rounded-lg p-6 mt-4">
            <h2 className="text-lg font-medium text-foreground mb-2">About NEXUS</h2>
            <p className="text-sm text-muted-foreground">
              NEXUS is your AI-powered assistant, ready to help with questions, tasks, and more.
              Powered by advanced AI models.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
