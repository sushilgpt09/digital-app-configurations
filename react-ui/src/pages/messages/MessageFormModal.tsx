import { useState, useEffect, FormEvent } from 'react';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/forms/InputField';
import { SelectField } from '../../components/forms/SelectField';
import { TextAreaField } from '../../components/forms/TextAreaField';
import { ApiMessageItem, ApiMessageRequest } from '../../types/message.types';
import { messagesApi } from '../../api/messages.api';
import toast from 'react-hot-toast';

interface Props { isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: ApiMessageItem | null; }

export function MessageFormModal({ isOpen, onClose, onSuccess, item }: Props) {
  const [form, setForm] = useState<ApiMessageRequest>({ errorCode: '', enMessage: '', kmMessage: '', type: 'ERROR', httpStatus: 400 });
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) setForm({ errorCode: item.errorCode, enMessage: item.enMessage, kmMessage: item.kmMessage, type: item.type, httpStatus: item.httpStatus });
    else setForm({ errorCode: '', enMessage: '', kmMessage: '', type: 'ERROR', httpStatus: 400 });
  }, [item, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.errorCode.trim() || !form.enMessage.trim()) { toast.error('Code and English message are required'); return; }
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
        <TextAreaField label="English Message" value={form.enMessage} onChange={(e) => setForm({ ...form, enMessage: e.target.value })} required />
        <TextAreaField label="Khmer Message" value={form.kmMessage || ''} onChange={(e) => setForm({ ...form, kmMessage: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <SelectField label="Type" value={form.type || 'ERROR'} onChange={(e) => setForm({ ...form, type: e.target.value })} options={[{ label: 'Error', value: 'ERROR' }, { label: 'Success', value: 'SUCCESS' }, { label: 'Info', value: 'INFO' }, { label: 'Warning', value: 'WARNING' }]} />
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
