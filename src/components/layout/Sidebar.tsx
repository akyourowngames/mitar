import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, CheckSquare, Settings, LogOut, Plus, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const navItems = [
  { icon: MessageSquare, label: 'Chat', path: '/' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  onNewChat?: () => void;
}

export function Sidebar({ onNewChat }: SidebarProps) {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <span className="font-semibold text-sidebar-foreground">NEXUS</span>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          variant="outline"
          className={cn("w-full justify-start gap-2", collapsed && "justify-center")}
        >
          <Plus className="w-4 h-4" />
          {!collapsed && "New chat"}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                  collapsed && 'justify-center'
                )}
              >
                <item.icon className="w-4 h-4" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      {user && (
        <div className="p-3 border-t border-sidebar-border">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sm font-medium">
              {user.email?.[0].toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.email}
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={signOut}
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}
