import { useState, useEffect, FormEvent } from 'react';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/forms/InputField';
import { SelectField } from '../../components/forms/SelectField';
import { TextAreaField } from '../../components/forms/TextAreaField';
import { NotificationTemplate, NotificationTemplateRequest } from '../../types/notification.types';
import { notificationsApi } from '../../api/notifications.api';
import toast from 'react-hot-toast';

interface Props { isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: NotificationTemplate | null; }

export function NotificationFormModal({ isOpen, onClose, onSuccess, item }: Props) {
  const [form, setForm] = useState<NotificationTemplateRequest>({ code: '', titleEn: '', titleKm: '', bodyEn: '', bodyKm: '', type: 'PUSH', status: 'ACTIVE' });
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) setForm({ code: item.code, titleEn: item.titleEn, titleKm: item.titleKm, bodyEn: item.bodyEn, bodyKm: item.bodyKm, type: item.type, status: item.status });
    else setForm({ code: '', titleEn: '', titleKm: '', bodyEn: '', bodyKm: '', type: 'PUSH', status: 'ACTIVE' });
  }, [item, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) { toast.error('Code is required'); return; }
    setLoading(true);
    try {
      if (isEdit && item) { await notificationsApi.update(item.id, form); toast.success('Updated'); }
      else { await notificationsApi.create(form); toast.success('Created'); }
      onSuccess(); onClose();
    } catch { /* */ } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Notification Template' : 'Add Notification Template'} size="lg">
      <form onSubmit={handleSubmit}>
        <InputField label="Template Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. WELCOME_PUSH" required />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Title (English)" value={form.titleEn || ''} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
          <InputField label="Title (Khmer)" value={form.titleKm || ''} onChange={(e) => setForm({ ...form, titleKm: e.target.value })} />
        </div>
        <TextAreaField label="Body (English)" value={form.bodyEn || ''} onChange={(e) => setForm({ ...form, bodyEn: e.target.value })} />
        <TextAreaField label="Body (Khmer)" value={form.bodyKm || ''} onChange={(e) => setForm({ ...form, bodyKm: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <SelectField label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} options={[{ label: 'Push', value: 'PUSH' }, { label: 'SMS', value: 'SMS' }, { label: 'Email', value: 'EMAIL' }]} required />
          <SelectField label="Status" value={form.status || 'ACTIVE'} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-wing-border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-wing-primary text-white rounded-lg hover:bg-wing-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
