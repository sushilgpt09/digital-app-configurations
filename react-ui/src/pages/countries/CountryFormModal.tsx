import { useState, useEffect, FormEvent } from 'react';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/forms/InputField';
import { SelectField } from '../../components/forms/SelectField';
import { Country, CountryRequest } from '../../types/country.types';
import { countriesApi } from '../../api/countries.api';
import toast from 'react-hot-toast';

interface Props { isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: Country | null; }

export function CountryFormModal({ isOpen, onClose, onSuccess, item }: Props) {
  const [form, setForm] = useState<CountryRequest>({ name: '', code: '', dialCode: '', currency: '', status: 'ACTIVE' });
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) setForm({ name: item.name, code: item.code, dialCode: item.dialCode || '', flagUrl: item.flagUrl || '', currency: item.currency || '', status: item.status });
    else setForm({ name: '', code: '', dialCode: '', currency: '', status: 'ACTIVE' });
  }, [item, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) { toast.error('Name and Code are required'); return; }
    setLoading(true);
    try {
      if (isEdit && item) { await countriesApi.update(item.id, form); toast.success('Updated'); }
      else { await countriesApi.create(form); toast.success('Created'); }
      onSuccess(); onClose();
    } catch { /* */ } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Country' : 'Add Country'}>
      <form onSubmit={handleSubmit}>
        <InputField label="Country Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <InputField label="Country Code (ISO)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. KH" required />
        <InputField label="Dial Code" value={form.dialCode || ''} onChange={(e) => setForm({ ...form, dialCode: e.target.value })} placeholder="+855" />
        <InputField label="Currency" value={form.currency || ''} onChange={(e) => setForm({ ...form, currency: e.target.value })} placeholder="KHR" />
        <SelectField label="Status" value={form.status || 'ACTIVE'} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-wing-border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-wing-primary text-white rounded-lg hover:bg-wing-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
