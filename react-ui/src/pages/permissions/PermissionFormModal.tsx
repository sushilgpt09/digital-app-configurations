import { useState, useEffect, FormEvent } from 'react';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/forms/InputField';
import { TextAreaField } from '../../components/forms/TextAreaField';
import { Permission, PermissionRequest } from '../../types/role.types';
import { permissionsApi } from '../../api/permissions.api';
import toast from 'react-hot-toast';

interface Props { isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: Permission | null; }

export function PermissionFormModal({ isOpen, onClose, onSuccess, item }: Props) {
  const [form, setForm] = useState<PermissionRequest>({ name: '', module: '', description: '' });
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) setForm({ name: item.name, module: item.module, description: item.description || '' });
    else setForm({ name: '', module: '', description: '' });
  }, [item, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.module.trim()) { toast.error('Name and Module are required'); return; }
    setLoading(true);
    try {
      if (isEdit && item) { await permissionsApi.update(item.id, form); toast.success('Updated'); }
      else { await permissionsApi.create(form); toast.success('Created'); }
      onSuccess(); onClose();
    } catch { /* */ } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Permission' : 'Add Permission'}>
      <form onSubmit={handleSubmit}>
        <InputField label="Permission Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. USER_CREATE" required />
        <InputField label="Module" value={form.module} onChange={(e) => setForm({ ...form, module: e.target.value })} placeholder="e.g. USER" required />
        <TextAreaField label="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-wing-border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-wing-primary text-white rounded-lg hover:bg-wing-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
