import { useState, useEffect, FormEvent } from 'react';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/forms/InputField';
import { SelectField } from '../../components/forms/SelectField';
import { TextAreaField } from '../../components/forms/TextAreaField';
import { GlobalConfig, GlobalConfigRequest } from '../../types/globalConfig.types';
import { globalConfigsApi } from '../../api/globalConfigs.api';
import toast from 'react-hot-toast';

interface Props { isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: GlobalConfig | null; }

export function GlobalConfigFormModal({ isOpen, onClose, onSuccess, item }: Props) {
  const [form, setForm] = useState<GlobalConfigRequest>({ configKey: '', configValue: '', platform: 'ALL', version: '1.0', description: '', status: 'ACTIVE' });
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) setForm({ configKey: item.configKey, configValue: item.configValue, platform: item.platform, version: item.version, description: item.description, status: item.status });
    else setForm({ configKey: '', configValue: '', platform: 'ALL', version: '1.0', description: '', status: 'ACTIVE' });
  }, [item, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.configKey.trim()) { toast.error('Config key is required'); return; }
    setLoading(true);
    try {
      if (isEdit && item) { await globalConfigsApi.update(item.id, form); toast.success('Updated'); }
      else { await globalConfigsApi.create(form); toast.success('Created'); }
      onSuccess(); onClose();
    } catch { /* */ } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit App Genral Config' : 'Add App Genral Config'} size="lg">
      <form onSubmit={handleSubmit}>
        <InputField label="Config Key" value={form.configKey} onChange={(e) => setForm({ ...form, configKey: e.target.value })} placeholder="e.g. app.min_version" required />
        <InputField label="Config Value" value={form.configValue || ''} onChange={(e) => setForm({ ...form, configValue: e.target.value })} />
        <TextAreaField label="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid grid-cols-3 gap-4">
          <SelectField label="Platform" value={form.platform || 'ALL'} onChange={(e) => setForm({ ...form, platform: e.target.value })} options={[{ label: 'All', value: 'ALL' }, { label: 'Android', value: 'ANDROID' }, { label: 'iOS', value: 'IOS' }, { label: 'Web', value: 'WEB' }]} />
          <InputField label="Version" value={form.version || '1.0'} onChange={(e) => setForm({ ...form, version: e.target.value })} />
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
