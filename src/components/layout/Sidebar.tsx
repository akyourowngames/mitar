import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, CheckSquare, Settings, LogOut, Plus, Menu, Zap, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ConversationList } from '@/components/chat/ConversationList';
import type { Conversation } from '@/hooks/useConversations';
import { motion } from 'framer-motion';

const navItems = [
  { icon: MessageSquare, label: 'Chat', path: '/' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Zap, label: 'Automations', path: '/automations' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  onNewChat?: () => void;
  conversations?: Conversation[];
  currentConversationId?: string | null;
  onSelectConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
}

export function Sidebar({ 
  onNewChat, 
  conversations = [], 
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
}: SidebarProps) {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sidebar-foreground bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">MITAR</span>
          </motion.div>
        )}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon-sm" onClick={() => setCollapsed(!collapsed)} className="text-sidebar-foreground">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <Button 
          onClick={onNewChat} 
          className={cn(
            "w-full justify-start gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0",
            collapsed && "justify-center px-2"
          )}
        >
          <Plus className="w-4 h-4" />
          {!collapsed && "New chat"}
        </Button>
      </div>

      {/* Conversations */}
      {location.pathname === '/' && (
        <ConversationList
          conversations={conversations}
          currentId={currentConversationId || null}
          onSelect={onSelectConversation || (() => {})}
          onDelete={onDeleteConversation || (() => {})}
          collapsed={collapsed}
        />
      )}

      {/* Navigation */}
      <nav className={cn("p-2 space-y-1", location.pathname === '/' && "border-t border-sidebar-border mt-auto")}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div 
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                  collapsed && 'justify-center'
                )}
              >
                <item.icon className="w-4 h-4" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      {user && (
        <div className="p-3 border-t border-sidebar-border">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-medium text-white">
              {user.email?.[0].toUpperCase()}
            </div>
            {!collapsed && (
              <p className="text-sm font-medium text-sidebar-foreground truncate flex-1">
                {user.email}
              </p>
            )}
            <Button variant="ghost" size="icon-sm" onClick={signOut} className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}
