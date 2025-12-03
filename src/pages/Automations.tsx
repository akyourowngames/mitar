import { motion } from 'framer-motion';
import { Zap, Plus, Play, Pause, Settings as SettingsIcon } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const automations = [
  {
    id: '1',
    name: 'Daily Summary',
    description: 'Send daily task summary to email',
    active: true,
    runs: 42,
  },
  {
    id: '2',
    name: 'Meeting Reminder',
    description: 'Notify 15 minutes before meetings',
    active: true,
    runs: 128,
  },
  {
    id: '3',
    name: 'Weekly Report',
    description: 'Generate and send weekly productivity report',
    active: false,
    runs: 8,
  },
];

export default function Automations() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Automations</h1>
              <p className="text-muted-foreground">Automate your workflows</p>
            </div>
            <Button variant="glow">
              <Plus className="w-4 h-4" />
              New Automation
            </Button>
          </div>

          {/* Automation list */}
          <div className="space-y-4">
            {automations.map((automation, index) => (
              <motion.div
                key={automation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-5 group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                      automation.active
                        ? 'bg-primary/20 glow-primary-sm'
                        : 'bg-secondary'
                    )}
                  >
                    <Zap
                      className={cn(
                        'w-6 h-6',
                        automation.active ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{automation.name}</h3>
                    <p className="text-sm text-muted-foreground">{automation.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{automation.runs} runs</span>
                    <Button
                      variant={automation.active ? 'glow' : 'outline'}
                      size="icon-sm"
                    >
                      {automation.active ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <SettingsIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty state */}
          {automations.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No automations yet</p>
              <Button variant="glow" className="mt-4">
                <Plus className="w-4 h-4" />
                Create your first automation
              </Button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
