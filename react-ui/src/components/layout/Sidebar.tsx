import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  Globe,
  Languages,
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
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40 flex-col shadow-sm hidden lg:flex ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 mx-2 rounded-md transition-all duration-150 text-sm font-normal ${
                isActive
                  ? 'bg-[#5C90E6] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!collapsed && (
              <span className="truncate">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center p-3 border-t border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
