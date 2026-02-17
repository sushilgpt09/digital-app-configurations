import { useState, useEffect, FormEvent } from 'react';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/forms/InputField';
import { SelectField } from '../../components/forms/SelectField';
import { TextAreaField } from '../../components/forms/TextAreaField';
import { Translation, TranslationRequest } from '../../types/translation.types';
import { AppLanguage } from '../../types/appLanguage.types';
import { translationsApi } from '../../api/translations.api';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item?: Translation | null;
  languages: AppLanguage[];
}

const langFieldKey = (code: string) => `${code.toLowerCase()}Value`;

export function TranslationFormModal({ isOpen, onClose, onSuccess, item, languages }: Props) {
  const [form, setForm] = useState<TranslationRequest>({ key: '', module: '', version: '1.0', platform: 'ALL' });
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) {
      const data: TranslationRequest = { key: item.key, module: item.module, version: item.version, platform: item.platform };
      languages.forEach((lang) => {
        const fk = langFieldKey(lang.code);
        data[fk] = item[fk] || '';
      });
      setForm(data);
    } else {
      const data: TranslationRequest = { key: '', module: '', version: '1.0', platform: 'ALL' };
      languages.forEach((lang) => { data[langFieldKey(lang.code)] = ''; });
      setForm(data);
    }
  }, [item, isOpen, languages]);

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
        {languages.map((lang) => {
          const fk = langFieldKey(lang.code);
          return (
            <TextAreaField
              key={lang.id}
              label={`${lang.name} Value`}
              value={String(form[fk] || '')}
              onChange={(e) => setForm({ ...form, [fk]: e.target.value })}
              placeholder={lang.nativeName || lang.name}
            />
          );
        })}
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
