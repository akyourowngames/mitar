import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Trash2, Calendar } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

const initialTasks: Task[] = [
  { id: '1', title: 'Review project proposal', completed: false, createdAt: new Date() },
  { id: '2', title: 'Schedule team meeting', completed: true, createdAt: new Date() },
  { id: '3', title: 'Update documentation', completed: false, createdAt: new Date() },
];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: newTask.trim(),
          completed: false,
          createdAt: new Date(),
        },
      ]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
              <p className="text-muted-foreground">Manage your to-do list</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Add task form */}
          <form onSubmit={addTask} className="mb-6">
            <div className="glass rounded-xl p-4 flex gap-3">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1"
              />
              <Button type="submit" variant="glow">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </form>

          {/* Task list */}
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'glass rounded-xl p-4 flex items-center gap-4 group transition-all duration-200',
                  task.completed && 'opacity-60'
                )}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200',
                    task.completed
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground hover:border-primary'
                  )}
                >
                  {task.completed && <Check className="w-4 h-4 text-primary-foreground" />}
                </button>
                <span
                  className={cn(
                    'flex-1 text-foreground',
                    task.completed && 'line-through text-muted-foreground'
                  )}
                >
                  {task.title}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>

          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">No tasks yet. Add one above!</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
