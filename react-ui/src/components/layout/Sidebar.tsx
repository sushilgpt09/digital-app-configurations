import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  Globe,
  Languages,
  MessageSquare,
  Bell,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/users', label: 'User Management', icon: Users },
  { path: '/roles', label: 'Roles & Permissions', icon: Shield },
  { path: '/countries', label: 'Country Master', icon: Globe },
  { path: '/translations', label: 'Translations', icon: Languages },
  { path: '/messages', label: 'API Messages', icon: MessageSquare },
  { path: '/notifications', label: 'Notification Templates', icon: Bell },
  { path: '/global-configs', label: 'Global Config', icon: Settings },
  { path: '/audit-logs', label: 'Audit Logs', icon: FileText },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-wing-secondary text-white transition-all duration-300 z-40 flex flex-col ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-10 h-10 bg-wing-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">W</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-base leading-tight">Wing Bank</h1>
            <p className="text-xs text-white/60">Config System</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-wing-primary text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium truncate">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center p-3 border-t border-white/10 hover:bg-white/10 transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
