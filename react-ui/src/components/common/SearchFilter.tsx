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
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="relative flex-1 min-w-[250px]">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 border border-wing-border rounded-lg focus:outline-none focus:ring-2 focus:ring-wing-primary/20 focus:border-wing-primary bg-white"
        />
      </div>
      {statusOptions && onStatusChange && (
        <select
          value={statusValue || ''}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2.5 border border-wing-border rounded-lg focus:outline-none focus:ring-2 focus:ring-wing-primary/20 focus:border-wing-primary bg-white text-wing-text"
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
        className="px-5 py-2.5 bg-wing-info text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
      >
        <Search size={16} />
        Search
      </button>
      <button
        onClick={onReset}
        className="px-5 py-2.5 border border-wing-border text-wing-text rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <RotateCcw size={16} />
        Reset
      </button>
    </div>
  );
}
