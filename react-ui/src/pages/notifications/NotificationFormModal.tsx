import { useState, useEffect, FormEvent } from 'react';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/forms/InputField';
import { SelectField } from '../../components/forms/SelectField';
import { TextAreaField } from '../../components/forms/TextAreaField';
import { NotificationTemplate, NotificationTemplateRequest } from '../../types/notification.types';
import { AppLanguage } from '../../types/appLanguage.types';
import { notificationsApi } from '../../api/notifications.api';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item?: NotificationTemplate | null;
  languages: AppLanguage[];
}

// "en" → "titleEn", "km" → "titleKm"
const titleKey = (code: string) => `title${code.charAt(0).toUpperCase()}${code.slice(1).toLowerCase()}`;
const bodyKey = (code: string) => `body${code.charAt(0).toUpperCase()}${code.slice(1).toLowerCase()}`;

export function NotificationFormModal({ isOpen, onClose, onSuccess, item, languages }: Props) {
  const [form, setForm] = useState<NotificationTemplateRequest>({ code: '', type: 'PUSH', status: 'ACTIVE' });
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) {
      const data: NotificationTemplateRequest = { code: item.code, type: item.type, status: item.status };
      languages.forEach((lang) => {
        const tk = titleKey(lang.code);
        const bk = bodyKey(lang.code);
        data[tk] = item[tk] || '';
        data[bk] = item[bk] || '';
      });
      setForm(data);
    } else {
      const data: NotificationTemplateRequest = { code: '', type: 'PUSH', status: 'ACTIVE' };
      languages.forEach((lang) => {
        data[titleKey(lang.code)] = '';
        data[bodyKey(lang.code)] = '';
      });
      setForm(data);
    }
  }, [item, isOpen, languages]);

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
        {languages.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {languages.map((lang) => {
              const tk = titleKey(lang.code);
              return (
                <InputField
                  key={`title-${lang.id}`}
                  label={`Title (${lang.name})`}
                  value={String(form[tk] || '')}
                  onChange={(e) => setForm({ ...form, [tk]: e.target.value })}
                />
              );
            })}
          </div>
        )}
        {languages.map((lang) => {
          const bk = bodyKey(lang.code);
          return (
            <TextAreaField
              key={`body-${lang.id}`}
              label={`Body (${lang.name})`}
              value={String(form[bk] || '')}
              onChange={(e) => setForm({ ...form, [bk]: e.target.value })}
            />
          );
        })}
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
