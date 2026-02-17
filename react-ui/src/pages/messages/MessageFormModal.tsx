import { useState, useEffect, FormEvent } from 'react';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/forms/InputField';
import { SelectField } from '../../components/forms/SelectField';
import { TextAreaField } from '../../components/forms/TextAreaField';
import { ApiMessageItem, ApiMessageRequest } from '../../types/message.types';
import { AppLanguage } from '../../types/appLanguage.types';
import { messagesApi } from '../../api/messages.api';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item?: ApiMessageItem | null;
  languages: AppLanguage[];
}

const langFieldKey = (code: string) => `${code.toLowerCase()}Message`;

export function MessageFormModal({ isOpen, onClose, onSuccess, item, languages }: Props) {
  const [form, setForm] = useState<ApiMessageRequest>({ errorCode: '', type: 'ERROR', httpStatus: 400 });
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) {
      const data: ApiMessageRequest = { errorCode: item.errorCode, type: item.type, httpStatus: item.httpStatus };
      languages.forEach((lang) => {
        const fk = langFieldKey(lang.code);
        data[fk] = String(item[fk] || '');
      });
      setForm(data);
    } else {
      const data: ApiMessageRequest = { errorCode: '', type: 'ERROR', httpStatus: 400 };
      languages.forEach((lang) => { data[langFieldKey(lang.code)] = ''; });
      setForm(data);
    }
  }, [item, isOpen, languages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.errorCode.trim()) { toast.error('Error code is required'); return; }
    setLoading(true);
    try {
      if (isEdit && item) { await messagesApi.update(item.id, form); toast.success('Updated'); }
      else { await messagesApi.create(form); toast.success('Created'); }
      onSuccess(); onClose();
    } catch { /* */ } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit API Message' : 'Add API Message'} size="lg">
      <form onSubmit={handleSubmit}>
        <InputField label="Error Code" value={form.errorCode} onChange={(e) => setForm({ ...form, errorCode: e.target.value })} placeholder="e.g. ERROR_001" required />
        {languages.map((lang) => {
          const fk = langFieldKey(lang.code);
          return (
            <TextAreaField
              key={lang.id}
              label={`${lang.name} Message`}
              value={String(form[fk] || '')}
              onChange={(e) => setForm({ ...form, [fk]: e.target.value })}
              placeholder={`${lang.name} message`}
            />
          );
        })}
        <div className="grid grid-cols-2 gap-4">
          <SelectField label="Type" value={String(form.type || 'ERROR')} onChange={(e) => setForm({ ...form, type: e.target.value })} options={[{ label: 'Error', value: 'ERROR' }, { label: 'Success', value: 'SUCCESS' }, { label: 'Info', value: 'INFO' }, { label: 'Warning', value: 'WARNING' }]} />
          <InputField label="HTTP Status" type="number" value={String(form.httpStatus || 400)} onChange={(e) => setForm({ ...form, httpStatus: Number(e.target.value) })} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-wing-border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-wing-primary text-white rounded-lg hover:bg-wing-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
