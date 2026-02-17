import { useState, useEffect, FormEvent } from 'react';
import { Modal } from '../../components/common/Modal';
import { Role, RoleRequest, Permission } from '../../types/role.types';
import { PermissionCheckboxGroup } from '../../components/common/PermissionCheckboxGroup';
import { rolesApi } from '../../api/roles.api';
import { permissionsApi } from '../../api/permissions.api';
import toast from 'react-hot-toast';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role?: Role | null;
}

export function RoleFormModal({ isOpen, onClose, onSuccess, role }: RoleFormModalProps) {
  const [form, setForm] = useState<RoleRequest>({ name: '', description: '', status: 'ACTIVE', permissionIds: [] });
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const isEdit = !!role;

  useEffect(() => {
    if (role) {
      setForm({
        name: role.name,
        description: role.description || '',
        status: role.status,
        permissionIds: role.permissions.map((p) => p.id),
      });
    } else {
      setForm({ name: '', description: '', status: 'ACTIVE', permissionIds: [] });
    }
  }, [role, isOpen]);

  useEffect(() => {
    if (isOpen) {
      permissionsApi.getAll({ page: 0, size: 200 }).then((res) => {
        setPermissions(res.data.data.content);
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Role name is required');
      return;
    }
    setLoading(true);
    try {
      if (isEdit && role) {
        await rolesApi.update(role.id, form);
        toast.success('Role updated successfully');
      } else {
        await rolesApi.create(form);
        toast.success('Role created successfully');
      }
      onSuccess();
      onClose();
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  // Group permissions by module
  const grouped = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    const mod = p.module || 'OTHER';
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(p);
    return acc;
  }, {});

  const formatGroupLabel = (module: string) => {
    return module
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? `Edit Role${role?.name ? ': ' + role.name : ''}` : 'Add New Role'} size="2xl">
      <form onSubmit={handleSubmit}>
        {/* Role Name, Description, Status in one row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter role name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C90E6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter role description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C90E6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex items-center h-[42px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.status === 'ACTIVE'}
                  onChange={(e) => setForm({ ...form, status: e.target.checked ? 'ACTIVE' : 'INACTIVE' })}
                  className="w-4 h-4 rounded border-gray-300 text-[#5C90E6] focus:ring-[#5C90E6]"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(grouped)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([module, perms]) => (
                <PermissionCheckboxGroup
                  key={module}
                  groupLabel={formatGroupLabel(module)}
                  permissions={perms}
                  selectedIds={form.permissionIds || []}
                  onChange={(ids) => setForm({ ...form, permissionIds: ids })}
                />
              ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Role' : 'Create Role'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
