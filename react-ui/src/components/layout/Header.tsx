import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Settings, Bell, Globe, LogOut, User, ChevronDown } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [lang, setLang] = useState('EN');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-wing-border flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-semibold text-wing-text">Organization name</h2>
        <p className="text-xs text-wing-text-light">Digital App Configurations</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Language selector */}
        <button
          onClick={() => setLang(lang === 'EN' ? 'KM' : 'EN')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-sm"
        >
          <Globe size={16} className="text-gray-500" />
          <span>{lang === 'EN' ? 'English' : 'ខ្មែរ'}</span>
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings size={18} className="text-gray-500" />
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
          <Bell size={18} className="text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-wing-danger rounded-full"></span>
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-wing-primary rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-wing-text">{user?.fullName || 'Admin'}</p>
              <p className="text-xs text-wing-text-light">{user?.email}</p>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-wing-border py-2 z-50">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-wing-danger hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
