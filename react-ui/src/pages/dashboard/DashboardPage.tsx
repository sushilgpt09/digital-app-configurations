import { Users, Shield, Globe, Languages, MessageSquare, Bell, Settings, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Users', icon: Users, path: '/users', color: 'bg-blue-500' },
  { label: 'Roles', icon: Shield, path: '/roles', color: 'bg-purple-500' },
  { label: 'Countries', icon: Globe, path: '/countries', color: 'bg-wing-primary' },
  { label: 'Translations', icon: Languages, path: '/translations', color: 'bg-orange-500' },
  { label: 'API Messages', icon: MessageSquare, path: '/messages', color: 'bg-teal-500' },
  { label: 'Notifications', icon: Bell, path: '/notifications', color: 'bg-pink-500' },
  { label: 'Global Configs', icon: Settings, path: '/global-configs', color: 'bg-indigo-500' },
  { label: 'Audit Logs', icon: FileText, path: '/audit-logs', color: 'bg-gray-500' },
];

export function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-wing-text">Dashboard</h1>
        <p className="text-wing-text-light mt-1">Welcome to Wing Bank Digital App Configuration System</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className="bg-white rounded-xl shadow-sm border border-wing-border p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-wing-text">--</p>
                <p className="text-sm text-wing-text-light group-hover:text-wing-primary transition-colors">
                  {stat.label}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-wing-border p-6">
        <h2 className="text-lg font-semibold text-wing-text mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/users"
            className="flex items-center gap-3 p-4 rounded-xl border border-wing-border hover:border-wing-primary hover:bg-wing-primary/5 transition-colors"
          >
            <Users className="text-wing-primary" size={20} />
            <span className="text-sm font-medium">Manage Users</span>
          </Link>
          <Link
            to="/translations"
            className="flex items-center gap-3 p-4 rounded-xl border border-wing-border hover:border-wing-primary hover:bg-wing-primary/5 transition-colors"
          >
            <Languages className="text-wing-primary" size={20} />
            <span className="text-sm font-medium">Manage Translations</span>
          </Link>
          <Link
            to="/global-configs"
            className="flex items-center gap-3 p-4 rounded-xl border border-wing-border hover:border-wing-primary hover:bg-wing-primary/5 transition-colors"
          >
            <Settings className="text-wing-primary" size={20} />
            <span className="text-sm font-medium">Global Configurations</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
