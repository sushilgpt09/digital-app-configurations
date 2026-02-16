import { useState, useEffect, FormEvent } from 'react';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/forms/InputField';
import { SelectField } from '../../components/forms/SelectField';
import { User, UserRequest } from '../../types/user.types';
import { Role } from '../../types/role.types';
import { usersApi } from '../../api/users.api';
import { rolesApi } from '../../api/roles.api';
import toast from 'react-hot-toast';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null;
}

export function UserFormModal({ isOpen, onClose, onSuccess, user }: UserFormModalProps) {
  const [form, setForm] = useState<UserRequest>({ email: '', fullName: '', password: '', phone: '', status: 'ACTIVE', roleIds: [] });
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const isEdit = !!user;

  useEffect(() => {
    if (user) {
      setForm({ email: user.email, fullName: user.fullName, phone: user.phone || '', status: user.status, roleIds: user.roles.map((r) => r.id) });
    } else {
      setForm({ email: '', fullName: '', password: '', phone: '', status: 'ACTIVE', roleIds: [] });
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (isOpen) {
      rolesApi.getAll({ page: 0, size: 100 }).then((res) => setRoles(res.data.data.content));
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.fullName.trim()) { toast.error('Email and Full Name are required'); return; }
    if (!isEdit && (!form.password || form.password.length < 8)) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      if (isEdit && user) {
        await usersApi.update(user.id, form);
        toast.success('User updated');
      } else {
        await usersApi.create(form);
        toast.success('User created');
      }
      onSuccess();
      onClose();
    } catch { /* interceptor */ } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit User' : 'Add New User'} size="md">
      <form onSubmit={handleSubmit}>
        <InputField label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        <InputField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        {!isEdit && <InputField label="Password" type="password" value={form.password || ''} onChange={(e) => setForm({ ...form, password: e.target.value })} required />}
        <InputField label="Phone" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <SelectField label="Status" value={form.status || 'ACTIVE'} onChange={(e) => setForm({ ...form, status: e.target.value })}
          options={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />
        <div className="mb-4">
          <label className="block text-sm font-medium text-wing-text mb-2">Roles</label>
          <div className="border border-wing-border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
            {roles.map((r) => (
              <label key={r.id} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={form.roleIds?.includes(r.id) || false}
                  onChange={() => setForm((prev) => ({ ...prev, roleIds: prev.roleIds?.includes(r.id) ? prev.roleIds.filter((id) => id !== r.id) : [...(prev.roleIds || []), r.id] }))}
                  className="w-4 h-4 rounded border-wing-border text-wing-primary focus:ring-wing-primary" />
                {r.name}
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-wing-border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-wing-primary text-white rounded-lg hover:bg-wing-primary-dark disabled:opacity-50">
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
