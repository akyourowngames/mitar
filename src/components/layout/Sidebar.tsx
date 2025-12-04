import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, CheckSquare, Settings, LogOut, Plus, Menu, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ConversationList } from '@/components/chat/ConversationList';
import type { Conversation } from '@/hooks/useConversations';

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
      "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && <span className="font-semibold text-sidebar-foreground">NEXUS</span>}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon-sm" onClick={() => setCollapsed(!collapsed)} className="text-sidebar-foreground">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-3">
        <Button onClick={onNewChat} variant="outline" className={cn("w-full justify-start gap-2", collapsed && "justify-center")}>
          <Plus className="w-4 h-4" />
          {!collapsed && "New chat"}
        </Button>
      </div>

      {location.pathname === '/' && (
        <ConversationList
          conversations={conversations}
          currentId={currentConversationId || null}
          onSelect={onSelectConversation || (() => {})}
          onDelete={onDeleteConversation || (() => {})}
          collapsed={collapsed}
        />
      )}

      <nav className={cn("p-2 space-y-1", location.pathname === '/' && "border-t border-sidebar-border mt-auto")}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <div className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                collapsed && 'justify-center'
              )}>
                <item.icon className="w-4 h-4" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="p-3 border-t border-sidebar-border">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-medium text-primary-foreground">
              {user.email?.[0].toUpperCase()}
            </div>
            {!collapsed && <p className="text-sm font-medium text-sidebar-foreground truncate flex-1">{user.email}</p>}
            <Button variant="ghost" size="icon-sm" onClick={signOut} className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}
