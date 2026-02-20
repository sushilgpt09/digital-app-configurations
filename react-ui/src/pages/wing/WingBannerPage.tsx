import { useState, useEffect, useCallback, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { wingBannersApi } from '../../api/wingBanners.api';
import { WingBanner, WingBannerRequest, WingBannerTranslationData } from '../../types/wing.types';
import { PagedResponse } from '../../types/api.types';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchFilter } from '../../components/common/SearchFilter';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/forms/InputField';
import { SelectField } from '../../components/forms/SelectField';
import toast from 'react-hot-toast';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'km', label: 'Khmer' },
];
const EMPTY_TRANS: WingBannerTranslationData = { title: '', subtitle: '', offerText: '' };
const EMPTY: WingBannerRequest = {
  imageUrl: '', gradientFrom: '', gradientTo: '', linkUrl: '', sortOrder: 0, status: 'ACTIVE',
  translations: { en: { ...EMPTY_TRANS }, km: { ...EMPTY_TRANS } },
};

function BannerFormModal({
  isOpen, onClose, onSuccess, item,
}: {
  isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: WingBanner | null;
}) {
  const [form, setForm] = useState<WingBannerRequest>(EMPTY);
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) {
      setForm({
        imageUrl: item.imageUrl || '',
        gradientFrom: item.gradientFrom || '',
        gradientTo: item.gradientTo || '',
        linkUrl: item.linkUrl || '',
        sortOrder: item.sortOrder,
        status: item.status,
        translations: {
          en: item.translations?.en || { ...EMPTY_TRANS },
          km: item.translations?.km || { ...EMPTY_TRANS },
        },
      });
    } else {
      setForm({ ...EMPTY, translations: { en: { ...EMPTY_TRANS }, km: { ...EMPTY_TRANS } } });
    }
    setActiveLang('en');
  }, [item, isOpen]);

  const setTrans = (lang: string, field: keyof WingBannerTranslationData, val: string) => {
    setForm((f) => ({
      ...f,
      translations: { ...f.translations, [lang]: { ...((f.translations || {})[lang] || EMPTY_TRANS), [field]: val } },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && item) { await wingBannersApi.update(item.id, form); toast.success('Updated'); }
      else { await wingBannersApi.create(form); toast.success('Created'); }
      onSuccess(); onClose();
    } catch { /**/ } finally { setLoading(false); }
  };

  const trans = form.translations || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Banner' : 'Add Banner'}>
      <form onSubmit={handleSubmit}>
        <InputField label="Image URL" value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <InputField label="Gradient From" value={form.gradientFrom || ''} onChange={(e) => setForm({ ...form, gradientFrom: e.target.value })} placeholder="#1a1a2e" />
            {form.gradientFrom && <div className="mt-1 h-4 rounded" style={{ background: form.gradientFrom }} />}
          </div>
          <div>
            <InputField label="Gradient To" value={form.gradientTo || ''} onChange={(e) => setForm({ ...form, gradientTo: e.target.value })} placeholder="#16213e" />
            {form.gradientTo && <div className="mt-1 h-4 rounded" style={{ background: form.gradientTo }} />}
          </div>
        </div>
        <InputField label="Link URL" value={form.linkUrl || ''} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} placeholder="https://..." />
        <InputField label="Sort Order" type="number" value={String(form.sortOrder ?? 0)} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        <SelectField label="Status" value={form.status || 'ACTIVE'} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />

        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            {LANGS.map((l) => (
              <button key={l.code} type="button" onClick={() => setActiveLang(l.code)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${activeLang === l.code ? 'bg-[#5C90E6] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                {l.label}
              </button>
            ))}
          </div>
          <div className="p-4 space-y-3">
            <InputField label="Title" value={trans[activeLang]?.title || ''} onChange={(e) => setTrans(activeLang, 'title', e.target.value)} placeholder={`Banner title in ${LANGS.find(l => l.code === activeLang)?.label}`} />
            <InputField label="Subtitle" value={trans[activeLang]?.subtitle || ''} onChange={(e) => setTrans(activeLang, 'subtitle', e.target.value)} placeholder="Short subtitle" />
            <InputField label="Offer Text" value={trans[activeLang]?.offerText || ''} onChange={(e) => setTrans(activeLang, 'offerText', e.target.value)} placeholder="e.g. 0% fee" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}

export function WingBannerPage() {
  const [data, setData] = useState<PagedResponse<WingBanner>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WingBanner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WingBanner | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await wingBannersApi.getAll({ page, size, search: searchQuery, status: statusQuery || undefined }); setData(res.data.data); }
    catch { /**/ } finally { setLoading(false); }
  }, [page, size, searchQuery, statusQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<WingBanner>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    {
      key: 'gradient', header: 'GRADIENT', width: '80px', render: (b) => (
        <div className="w-10 h-6 rounded" style={{ background: b.gradientFrom && b.gradientTo ? `linear-gradient(to right, ${b.gradientFrom}, ${b.gradientTo})` : b.gradientFrom || '#eee' }} />
      )
    },
    { key: 'title', header: 'TITLE (EN)', render: (b) => <span className="font-medium">{b.translations?.en?.title || '—'}</span> },
    { key: 'subtitle', header: 'SUBTITLE (EN)', render: (b) => <span className="text-sm text-gray-600">{b.translations?.en?.subtitle || '—'}</span> },
    { key: 'offerText', header: 'OFFER', render: (b) => <span className="text-sm">{b.translations?.en?.offerText || '—'}</span> },
    { key: 'sortOrder', header: 'ORDER', width: '80px', render: (b) => b.sortOrder },
    { key: 'status', header: 'STATUS', render: (b) => <StatusBadge status={b.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Wing+ Banners" action={<button onClick={() => { setEditingItem(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors"><Plus size={18} /> Add Banner</button>} />
      <SearchFilter searchValue={search} onSearchChange={setSearch} onSearch={() => { setSearchQuery(search); setStatusQuery(status); setPage(0); }} onReset={() => { setSearch(''); setStatus(''); setSearchQuery(''); setStatusQuery(''); setPage(0); }} placeholder="Search banners..." statusValue={status} onStatusChange={setStatus} statusOptions={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />
      <DataTable columns={columns} data={data.content} loading={loading} page={data.page} size={data.size} totalElements={data.totalElements} totalPages={data.totalPages} onPageChange={setPage} onSizeChange={(s) => { setSize(s); setPage(0); }} onEdit={(b) => { setEditingItem(b); setShowForm(true); }} onDelete={setDeleteTarget} rowKey={(b) => b.id} />
      <BannerFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={fetchData} item={editingItem} />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={async () => { setDeleting(true); try { await wingBannersApi.delete(deleteTarget!.id); toast.success('Deleted'); setDeleteTarget(null); fetchData(); } catch {} finally { setDeleting(false); } }} loading={deleting} />
    </div>
  );
}
