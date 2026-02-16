import { Users, Shield, Globe, Languages, Settings, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Users', icon: Users, path: '/users', bgColor: 'bg-blue-100', iconColor: 'text-[#5C90E6]' },
  { label: 'Roles', icon: Shield, path: '/roles', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { label: 'Countries', icon: Globe, path: '/countries', bgColor: 'bg-blue-100', iconColor: 'text-[#5C90E6]' },
  { label: 'Translations', icon: Languages, path: '/translations', bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  { label: 'Global Configs', icon: Settings, path: '/global-configs', bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  { label: 'Audit Logs', icon: FileText, path: '/audit-logs', bgColor: 'bg-gray-100', iconColor: 'text-gray-600' },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to Wing Bank Digital App Configuration System</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-semibold text-gray-900">--</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon size={22} className={stat.iconColor} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/users"
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-[#EBF3FE] transition-all group"
          >
            <Users className="text-[#5C90E6]" size={20} />
            <span className="text-sm font-medium">Manage Users</span>
          </Link>
          <Link
            to="/translations"
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-[#EBF3FE] transition-all group"
          >
            <Languages className="text-[#5C90E6]" size={20} />
            <span className="text-sm font-medium">Manage Translations</span>
          </Link>
          <Link
            to="/global-configs"
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-[#EBF3FE] transition-all group"
          >
            <Settings className="text-[#5C90E6]" size={20} />
            <span className="text-sm font-medium">Global Configurations</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
