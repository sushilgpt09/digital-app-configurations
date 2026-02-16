import { useState, useEffect, FormEvent } from 'react';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/forms/InputField';
import { SelectField } from '../../components/forms/SelectField';
import { TextAreaField } from '../../components/forms/TextAreaField';
import { Translation, TranslationRequest } from '../../types/translation.types';
import { translationsApi } from '../../api/translations.api';
import toast from 'react-hot-toast';

interface Props { isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: Translation | null; }

export function TranslationFormModal({ isOpen, onClose, onSuccess, item }: Props) {
  const [form, setForm] = useState<TranslationRequest>({ key: '', enValue: '', kmValue: '', module: '', version: '1.0', platform: 'ALL' });
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) setForm({ key: item.key, enValue: item.enValue, kmValue: item.kmValue, module: item.module, version: item.version, platform: item.platform });
    else setForm({ key: '', enValue: '', kmValue: '', module: '', version: '1.0', platform: 'ALL' });
  }, [item, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.key.trim()) { toast.error('Key is required'); return; }
    setLoading(true);
    try {
      if (isEdit && item) { await translationsApi.update(item.id, form); toast.success('Updated'); }
      else { await translationsApi.create(form); toast.success('Created'); }
      onSuccess(); onClose();
    } catch { /* */ } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Translation' : 'Add Translation'} size="lg">
      <form onSubmit={handleSubmit}>
        <InputField label="Translation Key" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="e.g. app.welcome" required />
        <TextAreaField label="English Value" value={form.enValue || ''} onChange={(e) => setForm({ ...form, enValue: e.target.value })} placeholder="English text" />
        <TextAreaField label="Khmer Value" value={form.kmValue || ''} onChange={(e) => setForm({ ...form, kmValue: e.target.value })} placeholder="ខ្មែរ" />
        <div className="grid grid-cols-3 gap-4">
          <InputField label="Module" value={form.module || ''} onChange={(e) => setForm({ ...form, module: e.target.value })} placeholder="GENERAL" />
          <InputField label="Version" value={form.version || '1.0'} onChange={(e) => setForm({ ...form, version: e.target.value })} />
          <SelectField label="Platform" value={form.platform || 'ALL'} onChange={(e) => setForm({ ...form, platform: e.target.value })} options={[{ label: 'All', value: 'ALL' }, { label: 'Android', value: 'ANDROID' }, { label: 'iOS', value: 'IOS' }, { label: 'Web', value: 'WEB' }]} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-wing-border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-wing-primary text-white rounded-lg hover:bg-wing-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
