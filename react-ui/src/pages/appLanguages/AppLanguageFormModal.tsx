import { useState, useEffect, FormEvent } from 'react';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/forms/InputField';
import { SelectField } from '../../components/forms/SelectField';
import { AppLanguage, AppLanguageRequest } from '../../types/appLanguage.types';
import { appLanguagesApi } from '../../api/appLanguages.api';
import toast from 'react-hot-toast';

interface Props { isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: AppLanguage | null; }

export function AppLanguageFormModal({ isOpen, onClose, onSuccess, item }: Props) {
  const [form, setForm] = useState<AppLanguageRequest>({ name: '', nativeName: '', code: '', status: 'ACTIVE' });
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) setForm({ name: item.name, nativeName: item.nativeName || '', code: item.code, status: item.status });
    else setForm({ name: '', nativeName: '', code: '', status: 'ACTIVE' });
  }, [item, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) { toast.error('Name and Code are required'); return; }
    setLoading(true);
    try {
      if (isEdit && item) { await appLanguagesApi.update(item.id, form); toast.success('Updated'); }
      else { await appLanguagesApi.create(form); toast.success('Created'); }
      onSuccess(); onClose();
    } catch { /* */ } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit App Language' : 'Add App Language'}>
      <form onSubmit={handleSubmit}>
        <InputField label="Language Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. English" required />
        <InputField label="Native Name" value={form.nativeName || ''} onChange={(e) => setForm({ ...form, nativeName: e.target.value })} placeholder="e.g. ខ្មែរ" />
        <InputField label="Language Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toLowerCase() })} placeholder="e.g. en, km" required />
        <SelectField label="Status" value={form.status || 'ACTIVE'} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-wing-border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-wing-primary text-white rounded-lg hover:bg-wing-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
