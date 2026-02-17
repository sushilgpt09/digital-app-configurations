import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Globe,
  Languages,
  FileText,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Shield,
  MessageSquare,
  Bell,
  Type,
  Database,
} from 'lucide-react';

type NavItem = {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
};

type NavGroup = {
  label: string;
  icon: typeof LayoutDashboard;
  basePath: string;
  children: NavItem[];
};

type SidebarEntry = NavItem | NavGroup;

function isGroup(entry: SidebarEntry): entry is NavGroup {
  return 'children' in entry;
}

const sidebarItems: SidebarEntry[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'User Management',
    icon: Users,
    basePath: '/users',
    children: [
      { path: '/users?tab=users', label: 'Users', icon: Users },
      { path: '/users?tab=roles', label: 'Roles & Permissions', icon: Shield },
    ],
  },
  {
    label: 'Master Config',
    icon: Database,
    basePath: '/master',
    children: [
      { path: '/countries', label: 'Country Master', icon: Globe },
      { path: '/app-languages', label: 'App Languages Master', icon: Languages },
    ],
  },
  {
    label: 'Translations',
    icon: Languages,
    basePath: '/translations',
    children: [
      { path: '/translations?tab=localized', label: 'Localized Strings', icon: Type },
      { path: '/translations?tab=api_messages', label: 'API Responses', icon: MessageSquare },
      { path: '/translations?tab=notifications', label: 'Notifications', icon: Bell },
    ],
  },
  { path: '/releases', label: 'App Release History', icon: Smartphone },
  { path: '/audit-logs', label: 'Audit Logs', icon: FileText },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    sidebarItems.forEach((item) => {
      if (
        isGroup(item) &&
        (location.pathname.startsWith(item.basePath) ||
          item.children.some((child) => location.pathname === child.path.split('?')[0]))
      ) {
        initial.add(item.label);
      }
    });
    return initial;
  });

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const isGroupActive = (group: NavGroup) =>
    location.pathname.startsWith(group.basePath) ||
    group.children.some((child) => location.pathname === child.path.split('?')[0]);

  const isChildActive = (child: NavItem) => {
    const [childPath, childQuery] = child.path.split('?');
    if (location.pathname !== childPath) return false;
    if (!childQuery) return true;
    const params = new URLSearchParams(childQuery);
    const searchParams = new URLSearchParams(location.search);
    for (const [key, value] of params) {
      if (searchParams.get(key) !== value) return false;
    }
    return true;
  };

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40 flex-col shadow-sm hidden lg:flex ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {sidebarItems.map((item) => {
          if (isGroup(item)) {
            const groupActive = isGroupActive(item);
            const expanded = expandedGroups.has(item.label);

            if (collapsed) {
              return (
                <NavLink
                  key={item.label}
                  to={item.basePath}
                  className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-md transition-all duration-150 text-sm font-normal ${
                    groupActive
                      ? 'bg-[#5C90E6] text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={item.label}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                </NavLink>
              );
            }

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 mx-2 rounded-md transition-all duration-150 text-sm font-normal ${
                    groupActive && !expanded
                      ? 'bg-[#5C90E6] text-white shadow-sm'
                      : groupActive
                        ? 'text-[#5C90E6] font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ width: 'calc(100% - 16px)' }}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    size={16}
                    className={`flex-shrink-0 transition-transform duration-200 ${
                      expanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expanded && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {item.children.map((child) => {
                      const active = isChildActive(child);
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={`flex items-center gap-3 px-3 py-2 mx-2 rounded-md transition-all duration-150 text-sm ${
                            active
                              ? 'bg-[#5C90E6] text-white shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <child.icon size={16} className="flex-shrink-0" />
                          <span className="truncate">{child.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
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
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
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
