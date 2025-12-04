import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Zap, Clock, Trash2, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Automation {
  id: string;
  title: string;
  time: string;
  enabled: boolean;
}

export default function Automations() {
  const { user, loading } = useAuth();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00');

  // Load automations from localStorage (simple implementation)
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`automations-${user.id}`);
      if (saved) {
        setAutomations(JSON.parse(saved));
      }
    }
  }, [user]);

  // Save automations to localStorage
  useEffect(() => {
    if (user && automations.length > 0) {
      localStorage.setItem(`automations-${user.id}`, JSON.stringify(automations));
    }
  }, [automations, user]);

  // Check for due automations
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      automations.forEach(auto => {
        if (auto.enabled && auto.time === currentTime) {
          toast.info(`Reminder: ${auto.title}`, {
            icon: <Bell className="w-4 h-4" />,
            duration: 10000,
          });
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [automations]);

  const addAutomation = () => {
    if (!newTitle.trim()) return;
    
    const automation: Automation = {
      id: Date.now().toString(),
      title: newTitle,
      time: newTime,
      enabled: true,
    };

    setAutomations(prev => [...prev, automation]);
    setNewTitle('');
    toast.success('Automation created');
  };

  const toggleAutomation = (id: string) => {
    setAutomations(prev =>
      prev.map(a => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const deleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
    toast.success('Automation deleted');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Automations</h1>
                <p className="text-sm text-muted-foreground">Set up daily reminders and notifications</p>
              </div>
            </div>

            {/* Add new automation */}
            <div className="bg-card rounded-xl p-4 mb-6 border border-border">
              <div className="flex gap-3">
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Reminder title..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && addAutomation()}
                />
                <Input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-32"
                />
                <Button onClick={addAutomation}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {/* Automations list */}
            <div className="space-y-3">
              <AnimatePresence>
                {automations.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No automations yet</p>
                    <p className="text-sm">Create a reminder to get started</p>
                  </motion.div>
                ) : (
                  automations.map((automation) => (
                    <motion.div
                      key={automation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-card rounded-xl p-4 border border-border flex items-center gap-4"
                    >
                      <Button
                        variant={automation.enabled ? "default" : "outline"}
                        size="icon-sm"
                        onClick={() => toggleAutomation(automation.id)}
                        className="shrink-0"
                      >
                        <Zap className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {automation.title}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{automation.time}</span>
                          <span className={automation.enabled ? "text-green-500" : "text-muted-foreground"}>
                            • {automation.enabled ? 'Active' : 'Paused'}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deleteAutomation(automation.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
