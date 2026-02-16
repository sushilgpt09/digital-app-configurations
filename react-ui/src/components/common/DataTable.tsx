import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSizeChange?: (size: number) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  rowKey?: (item: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  page,
  size,
  totalElements,
  totalPages,
  onPageChange,
  onSizeChange,
  onEdit,
  onDelete,
  rowKey,
}: DataTableProps<T>) {
  if (loading) return <LoadingSpinner />;

  const hasActions = onEdit || onDelete;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-wing-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-wing-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[120px]">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-wing-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (hasActions ? 1 : 0)} className="px-6 py-12 text-center text-gray-400">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={rowKey ? rowKey(item) : index}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-wing-text">
                      {col.render
                        ? col.render(item, page * size + index)
                        : String((item as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 text-wing-info hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="p-2 text-wing-danger hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-wing-border bg-gray-50/50">
        <span className="text-sm text-gray-500">
          Total {totalElements} Items
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            className="p-1.5 rounded-lg border border-wing-border hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum = i;
            if (totalPages > 5) {
              pageNum = Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === pageNum
                    ? 'bg-wing-info text-white'
                    : 'border border-wing-border hover:bg-white text-gray-600'
                }`}
              >
                {pageNum + 1}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded-lg border border-wing-border hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Showing</span>
          <select
            value={size}
            onChange={(e) => onSizeChange?.(Number(e.target.value))}
            className="border border-wing-border rounded-lg px-2 py-1 bg-white"
          >
            {[10, 20, 50].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span>results Per Page</span>
        </div>
      </div>
    </div>
  );
}
