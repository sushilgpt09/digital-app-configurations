import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { RoleRequest, Permission } from '../../types/role.types';
import { PermissionCheckboxGroup } from '../../components/common/PermissionCheckboxGroup';
import { rolesApi } from '../../api/roles.api';
import { permissionsApi } from '../../api/permissions.api';
import toast from 'react-hot-toast';

export function RoleFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<RoleRequest>({ name: '', description: '', status: 'ACTIVE', permissionIds: [] });
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [roleName, setRoleName] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setPageLoading(true);
      try {
        const permRes = await permissionsApi.getAll({ page: 0, size: 200 });
        setPermissions(permRes.data.data.content);

        if (id) {
          const roleRes = await rolesApi.getById(id);
          const role = roleRes.data.data;
          setRoleName(role.name);
          setForm({
            name: role.name,
            description: role.description || '',
            status: role.status,
            permissionIds: role.permissions.map((p) => p.id),
          });
        }
      } catch {
        toast.error('Failed to load data');
        navigate('/users?tab=roles');
      } finally {
        setPageLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Role name is required');
      return;
    }
    setLoading(true);
    try {
      if (isEdit && id) {
        await rolesApi.update(id, form);
        toast.success('Role updated successfully');
      } else {
        await rolesApi.create(form);
        toast.success('Role created successfully');
      }
      navigate('/users?tab=roles');
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

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5C90E6]" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/users?tab=roles"
          className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEdit ? `Edit Role${roleName ? ': ' + roleName : ''}` : 'Add New Role'}
        </h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
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
            <Link
              to="/users?tab=roles"
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Role' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
