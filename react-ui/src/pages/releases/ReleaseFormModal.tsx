import { useState, useEffect, FormEvent } from 'react';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/forms/InputField';
import { SelectField } from '../../components/forms/SelectField';
import { TextAreaField } from '../../components/forms/TextAreaField';
import { AppRelease, AppReleaseRequest } from '../../types/release.types';
import { releasesApi } from '../../api/releases.api';
import toast from 'react-hot-toast';

interface Props { isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: AppRelease | null; defaultPlatform?: string; }

const defaultForm: AppReleaseRequest = {
  version: '',
  platform: 'ANDROID',
  releaseNotes: '',
  buildNumber: '',
  status: 'ACTIVE',
  forceUpdate: false,
  minOsVersion: '',
  downloadUrl: '',
  releasedAt: new Date().toISOString().split('T')[0],
};

export function ReleaseFormModal({ isOpen, onClose, onSuccess, item, defaultPlatform }: Props) {
  const [form, setForm] = useState<AppReleaseRequest>({ ...defaultForm });
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) {
      setForm({
        version: item.version,
        platform: item.platform,
        releaseNotes: item.releaseNotes,
        buildNumber: item.buildNumber,
        status: item.status,
        forceUpdate: item.forceUpdate,
        minOsVersion: item.minOsVersion,
        downloadUrl: item.downloadUrl,
        releasedAt: item.releasedAt ? item.releasedAt.split('T')[0] : '',
      });
    } else {
      setForm({ ...defaultForm, platform: defaultPlatform || 'ANDROID', releasedAt: new Date().toISOString().split('T')[0] });
    }
  }, [item, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.version.trim()) { toast.error('Version is required'); return; }
    if (!form.platform) { toast.error('Platform is required'); return; }
    setLoading(true);
    try {
      if (isEdit && item) { await releasesApi.update(item.id, form); toast.success('Release updated'); }
      else { await releasesApi.create(form); toast.success('Release created'); }
      onSuccess(); onClose();
    } catch { /* */ } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Release' : 'New Release'} size="lg">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Platform"
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
            options={[
              { label: 'Android', value: 'ANDROID' },
              { label: 'iOS', value: 'IOS' },
              { label: 'Huawei', value: 'HUAWEI' },
            ]}
            required
          />
          <InputField label="Version" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="e.g. 2.5.0" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Build Number" value={form.buildNumber || ''} onChange={(e) => setForm({ ...form, buildNumber: e.target.value })} placeholder="e.g. 250" />
          <InputField label="Min OS Version" value={form.minOsVersion || ''} onChange={(e) => setForm({ ...form, minOsVersion: e.target.value })} placeholder="e.g. Android 8.0 / iOS 14" />
        </div>
        <TextAreaField label="Release Notes" value={form.releaseNotes || ''} onChange={(e) => setForm({ ...form, releaseNotes: e.target.value })} placeholder="What's new in this release..." rows={3} />
        <InputField label="Download URL" value={form.downloadUrl || ''} onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })} placeholder="https://..." />
        <div className="grid grid-cols-3 gap-4">
          <InputField label="Release Date" value={form.releasedAt || ''} onChange={(e) => setForm({ ...form, releasedAt: e.target.value })} type="date" />
          <SelectField
            label="Force Update"
            value={form.forceUpdate ? 'true' : 'false'}
            onChange={(e) => setForm({ ...form, forceUpdate: e.target.value === 'true' })}
            options={[
              { label: 'No', value: 'false' },
              { label: 'Yes', value: 'true' },
            ]}
          />
          <SelectField
            label="Status"
            value={form.status || 'ACTIVE'}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={[
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Inactive', value: 'INACTIVE' },
            ]}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
