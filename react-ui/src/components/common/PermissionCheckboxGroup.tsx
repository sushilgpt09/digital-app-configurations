import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Permission } from '../../types/role.types';

interface PermissionCheckboxGroupProps {
  groupLabel: string;
  permissions: Permission[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function PermissionCheckboxGroup({ groupLabel, permissions, selectedIds, onChange }: PermissionCheckboxGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const selectedCount = permissions.filter(p => selectedIds.includes(p.id)).length;
  const allSelected = selectedCount === permissions.length;

  const togglePermission = (permissionId: string) => {
    if (selectedIds.includes(permissionId)) {
      onChange(selectedIds.filter(id => id !== permissionId));
    } else {
      onChange([...selectedIds, permissionId]);
    }
  };

  const handleSelectAll = () => {
    const allIds = permissions.map(p => p.id);
    if (allSelected) {
      onChange(selectedIds.filter(id => !allIds.includes(id)));
    } else {
      onChange([...new Set([...selectedIds, ...allIds])]);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-900">{groupLabel}</span>
          <span className="text-xs text-gray-500">{selectedCount}/{permissions.length} selected</span>
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleSelectAll}
              type="button"
              className="text-sm text-[#5C90E6] hover:text-[#4A7DD4] font-medium"
            >
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {permissions.map(permission => (
              <label
                key={permission.id}
                className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(permission.id)}
                  onChange={() => togglePermission(permission.id)}
                  className="w-4 h-4 rounded border-gray-300 text-[#5C90E6] focus:ring-[#5C90E6]"
                />
                <span className="text-sm text-gray-700">{permission.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
