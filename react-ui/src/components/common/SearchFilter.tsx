import { Search, RotateCcw } from 'lucide-react';

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  placeholder?: string;
  statusValue?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: { label: string; value: string }[];
}

export function SearchFilter({
  searchValue,
  onSearchChange,
  onSearch,
  onReset,
  placeholder = 'Search...',
  statusValue,
  onStatusChange,
  statusOptions,
}: SearchFilterProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C90E6] focus:border-transparent bg-white"
          />
        </div>
        {statusOptions && onStatusChange && (
          <select
            value={statusValue || ''}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C90E6] focus:border-transparent bg-white text-gray-900"
          >
            <option value="">All Status</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={onSearch}
          className="w-full sm:w-auto px-6 py-2 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors flex items-center justify-center gap-2"
        >
          <Search size={16} />
          Search
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
}
