import { useState, useEffect, FormEvent } from 'react';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/forms/InputField';
import { SelectField } from '../../components/forms/SelectField';
import { TextAreaField } from '../../components/forms/TextAreaField';
import { Role, RoleRequest, Permission } from '../../types/role.types';
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

  const togglePermission = (id: string) => {
    setForm((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds?.includes(id)
        ? prev.permissionIds.filter((p) => p !== id)
        : [...(prev.permissionIds || []), id],
    }));
  };

  // Group permissions by module
  const grouped = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    const mod = p.module || 'OTHER';
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(p);
    return acc;
  }, {});

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Role' : 'Add New Role'} size="lg">
      <form onSubmit={handleSubmit}>
        <InputField
          label="Role Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. ADMIN"
          required
        />
        <TextAreaField
          label="Description"
          value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Role description"
        />
        <SelectField
          label="Status"
          value={form.status || 'ACTIVE'}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          options={[
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Inactive', value: 'INACTIVE' },
          ]}
        />

        {/* Permissions */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-wing-text mb-2">Permissions</label>
          <div className="border border-wing-border rounded-lg p-4 max-h-60 overflow-y-auto space-y-4">
            {Object.entries(grouped).map(([module, perms]) => (
              <div key={module}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{module}</p>
                <div className="grid grid-cols-2 gap-2">
                  {perms.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={form.permissionIds?.includes(p.id) || false}
                        onChange={() => togglePermission(p.id)}
                        className="w-4 h-4 rounded border-wing-border text-wing-primary focus:ring-wing-primary"
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-wing-border rounded-lg text-wing-text hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-wing-primary text-white rounded-lg hover:bg-wing-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Role' : 'Create Role'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
