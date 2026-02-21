import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

// Only the fields we actually filter on — avoids requiring an index signature
// on caller types while keeping the component fully reusable
interface Filterable {
  name?: unknown;
  title?: unknown;
  category?: unknown;
  description?: unknown;
}

// ── Single source of truth for filter logic ────────────────────────────────
const FILTER_FIELDS = ['name', 'title', 'category', 'description'] as const;

function applyFilter<T extends Filterable>(data: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return data;
  return data.filter(item =>
    FILTER_FIELDS.some(field => {
      const val = item[field];
      return typeof val === 'string' && val.toLowerCase().includes(q);
    })
  );
}

// ── Props ──────────────────────────────────────────────────────────────────
interface SearchBarProps<T extends Filterable> {
  data: T[];
  onFilter: (filtered: T[]) => void;
  onQueryChange?: (query: string) => void;
  onExpandChange?: (expanded: boolean) => void;
  placeholder?: string;
  autoFocus?: boolean;
  mode?: 'expandable' | 'static';
  className?: string;
}

// ── Component ──────────────────────────────────────────────────────────────
export function SearchBar<T extends Filterable>({
  data,
  onFilter,
  onQueryChange,
  onExpandChange,
  placeholder = 'Search...',
  autoFocus = false,
  mode = 'static',
  className = '',
}: SearchBarProps<T>) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep latest callbacks in refs to avoid stale closures without dep-loop
  const onFilterRef = useRef(onFilter);
  const onQueryChangeRef = useRef(onQueryChange);
  const onExpandChangeRef = useRef(onExpandChange);
  useEffect(() => { onFilterRef.current = onFilter; });
  useEffect(() => { onQueryChangeRef.current = onQueryChange; });
  useEffect(() => { onExpandChangeRef.current = onExpandChange; });

  // ── Filtering (single place) ───────────────────────────────────────────
  const filtered = useMemo(() => applyFilter(data, query), [data, query]);

  useEffect(() => { onFilterRef.current(filtered); }, [filtered]);
  useEffect(() => { onQueryChangeRef.current?.(query); }, [query]);

  // ── Expand / collapse helpers ──────────────────────────────────────────
  const open = () => {
    setExpanded(true);
    onExpandChangeRef.current?.(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const close = () => {
    setExpanded(false);
    setQuery('');
    onExpandChangeRef.current?.(false);
  };

  const clear = () => {
    setQuery('');
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  // ── Expandable mode (AppBar) ───────────────────────────────────────────
  if (mode === 'expandable') {
    return (
      <div className={`flex items-center ${className}`}>
        {!expanded ? (
          <button
            type="button"
            onClick={open}
            aria-label="Open search"
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
          >
            <Search className="w-6 h-6 text-white" />
          </button>
        ) : (
          <div
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5"
            style={{ animation: 'expandSearch 0.3s ease-out' }}
          >
            <Search className="w-4 h-4 text-white/70 flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={placeholder}
              className="bg-transparent text-white placeholder-white/60 text-sm outline-none w-36"
            />
            <button
              type="button"
              onClick={close}
              aria-label="Close search"
              className="flex-shrink-0 hover:bg-white/10 rounded-full p-0.5 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Static mode (Category popup) ───────────────────────────────────────
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        ref={inputRef}
        autoFocus={autoFocus}
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all"
      />
      {query && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
}
