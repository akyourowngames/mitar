import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  CheckSquare,
  Calendar,
  FolderOpen,
  Zap,
  Settings,
  LogOut,
  Menu,
  X,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: MessageSquare, label: 'Chat', path: '/' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: FolderOpen, label: 'Files', path: '/files' },
  { icon: Zap, label: 'Automations', path: '/automations' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </Button>

      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 0 : 280 }}
        className={cn(
          'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40 overflow-hidden',
          'md:relative md:block',
          isCollapsed && 'md:w-20'
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 px-2 mb-8"
            animate={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div className="absolute inset-0 rounded-xl animate-pulse-glow" />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="text-xl font-bold gradient-text">NEXUS</h1>
                <p className="text-xs text-muted-foreground">AI Assistant</p>
              </motion.div>
            )}
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/30 glow-primary-sm'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <item.icon className={cn('w-5 h-5', isActive && 'text-primary')} />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    {isActive && !isCollapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-sidebar-border pt-4 mt-4">
            <Link to="/login">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                {!isCollapsed && <span className="font-medium">Logout</span>}
              </motion.div>
            </Link>
          </div>

          {/* Collapse toggle (desktop) */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden md:flex absolute top-4 right-4"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
