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
import { useAppLanguages } from '../../hooks/useAppLanguages';

const EMPTY_TRANS: WingBannerTranslationData = { imageUrl: '' };

function BannerFormModal({
  isOpen, onClose, onSuccess, item,
}: {
  isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: WingBanner | null;
}) {
  const langs = useAppLanguages();
  const [form, setForm] = useState<WingBannerRequest>({ linkUrl: '', sortOrder: 0, status: 'ACTIVE', translations: {} });
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    const emptyTrans = Object.fromEntries(langs.map(l => [l.code, { ...EMPTY_TRANS }]));
    if (item) {
      setForm({
        linkUrl: item.linkUrl || '',
        sortOrder: item.sortOrder,
        status: item.status,
        translations: { ...emptyTrans, ...item.translations },
      });
    } else {
      setForm({ linkUrl: '', sortOrder: 0, status: 'ACTIVE', translations: emptyTrans });
    }
    setActiveLang(langs[0]?.code || 'en');
  }, [item, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const setTrans = (lang: string, val: string) => {
    setForm((f) => ({
      ...f,
      translations: { ...f.translations, [lang]: { imageUrl: val } },
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
  const activeLangLabel = langs.find(l => l.code === activeLang)?.label || activeLang;
  const previewUrl = trans[activeLang]?.imageUrl;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Banner' : 'Add Banner'}>
      <form onSubmit={handleSubmit}>
        <InputField label="Link URL" value={form.linkUrl || ''} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} placeholder="https://..." />
        <InputField label="Sort Order" type="number" value={String(form.sortOrder ?? 0)} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        <SelectField label="Status" value={form.status || 'ACTIVE'} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />

        {/* Per-language Image URL */}
        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            {langs.map((l) => (
              <button key={l.code} type="button" onClick={() => setActiveLang(l.code)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${activeLang === l.code ? 'bg-[#5C90E6] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                {l.label}
              </button>
            ))}
          </div>
          <div className="p-4 space-y-3">
            <InputField
              label={`Image URL (${activeLangLabel})`}
              value={trans[activeLang]?.imageUrl || ''}
              onChange={(e) => setTrans(activeLang, e.target.value)}
              placeholder="https://cdn.example.com/banner-en.jpg"
            />
            {previewUrl && (
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <img src={previewUrl} alt="Preview" className="w-full h-[120px] object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
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
      key: 'image', header: 'IMAGE (EN)', width: '120px', render: (b) => {
        const url = b.translations?.en?.imageUrl;
        return url
          ? <img src={url} alt="" className="w-24 h-14 rounded-lg object-cover border border-gray-100" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          : <div className="w-24 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No image</div>;
      }
    },
    { key: 'linkUrl', header: 'LINK URL', render: (b) => <span className="text-sm text-gray-600 truncate max-w-[200px] block">{b.linkUrl || '—'}</span> },
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
