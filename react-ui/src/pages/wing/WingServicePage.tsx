import { useState, useEffect, useCallback, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { wingServicesApi } from '../../api/wingServices.api';
import { WingService, WingServiceRequest, WingServiceTranslationData } from '../../types/wing.types';
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

const EMPTY_TRANS: WingServiceTranslationData = { title: '', description: '' };

function PartnerFormModal({
  isOpen, onClose, onSuccess, item,
}: {
  isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: WingService | null;
}) {
  const langs = useAppLanguages();
  const [form, setForm] = useState<WingServiceRequest>({ icon: '', imageUrl: '', isPopular: false, isNew: false, sortOrder: 0, status: 'ACTIVE', translations: {} });
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    const emptyTrans = Object.fromEntries(langs.map(l => [l.code, { ...EMPTY_TRANS }]));
    if (item) {
      setForm({
        icon: item.icon || '',
        imageUrl: item.imageUrl || '',
        isPopular: item.isPopular,
        isNew: item.isNew,
        sortOrder: item.sortOrder,
        status: item.status,
        translations: { ...emptyTrans, ...item.translations },
      });
    } else {
      setForm({ icon: '', imageUrl: '', isPopular: false, isNew: false, sortOrder: 0, status: 'ACTIVE', translations: emptyTrans });
    }
    setActiveLang(langs[0]?.code || 'en');
  }, [item, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const setTrans = (lang: string, field: keyof WingServiceTranslationData, val: string) => {
    setForm((f) => ({
      ...f,
      translations: { ...f.translations, [lang]: { ...((f.translations || {})[lang] || EMPTY_TRANS), [field]: val } },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.translations?.en?.title?.trim()) { toast.error('English name is required'); return; }
    setLoading(true);
    try {
      if (isEdit && item) { await wingServicesApi.update(item.id, form); toast.success('Partner updated'); }
      else { await wingServicesApi.create(form); toast.success('Partner created'); }
      onSuccess(); onClose();
    } catch { /**/ } finally { setLoading(false); }
  };

  const trans = form.translations || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Partner' : 'Add Partner'}>
      <form onSubmit={handleSubmit}>
        <InputField label="Icon (emoji or URL)" value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🏦" />
        <InputField label="Image URL" value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
        <InputField label="Sort Order" type="number" value={String(form.sortOrder ?? 0)} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        <SelectField label="Status" value={form.status || 'ACTIVE'} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />

        {/* Tags */}
        <div className="mt-4 p-4 border border-gray-200 rounded-lg space-y-3">
          <p className="text-sm font-medium text-gray-700">Partner Tags</p>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={!!form.isPopular}
              onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
              className="w-4 h-4 rounded accent-[#5C90E6]"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Popular Partner</span>
              <p className="text-xs text-gray-500">Shows in Popular Partners section</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={!!form.isNew}
              onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
              className="w-4 h-4 rounded accent-[#5C90E6]"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">New Partner</span>
              <p className="text-xs text-gray-500">Shows in New Partners section</p>
            </div>
          </label>
        </div>

        {/* Translation tabs */}
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
            <InputField label="Name" value={trans[activeLang]?.title || ''} onChange={(e) => setTrans(activeLang, 'title', e.target.value)} placeholder={`Partner name in ${langs.find(l => l.code === activeLang)?.label}`} />
            <InputField label="Description" value={trans[activeLang]?.description || ''} onChange={(e) => setTrans(activeLang, 'description', e.target.value)} placeholder="Short description" />
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

export function WingServicePage() {
  const [data, setData] = useState<PagedResponse<WingService>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WingService | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WingService | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await wingServicesApi.getAll({ page, size, search: searchQuery, status: statusQuery || undefined }); setData(res.data.data); }
    catch { /**/ } finally { setLoading(false); }
  }, [page, size, searchQuery, statusQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<WingService>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'icon', header: 'ICON', width: '70px', render: (s) => <span className="text-xl">{s.icon || '—'}</span> },
    { key: 'name', header: 'NAME (EN)', render: (s) => <span className="font-medium">{s.translations?.en?.title || '—'}</span> },
    { key: 'nameKm', header: 'NAME (KM)', render: (s) => <span>{s.translations?.km?.title || '—'}</span> },
    {
      key: 'tags', header: 'TAGS', render: (s) => (
        <div className="flex gap-1 flex-wrap">
          {s.isPopular && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Popular</span>}
          {s.isNew && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">New</span>}
          {!s.isPopular && !s.isNew && <span className="text-gray-400 text-xs">—</span>}
        </div>
      )
    },
    { key: 'sortOrder', header: 'ORDER', width: '80px', render: (s) => s.sortOrder },
    { key: 'status', header: 'STATUS', render: (s) => <StatusBadge status={s.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Wing+ Partners" action={<button onClick={() => { setEditingItem(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors"><Plus size={18} /> Add Partner</button>} />
      <SearchFilter searchValue={search} onSearchChange={setSearch} onSearch={() => { setSearchQuery(search); setStatusQuery(status); setPage(0); }} onReset={() => { setSearch(''); setStatus(''); setSearchQuery(''); setStatusQuery(''); setPage(0); }} placeholder="Search partners..." statusValue={status} onStatusChange={setStatus} statusOptions={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />
      <DataTable columns={columns} data={data.content} loading={loading} page={data.page} size={data.size} totalElements={data.totalElements} totalPages={data.totalPages} onPageChange={setPage} onSizeChange={(s) => { setSize(s); setPage(0); }} onEdit={(s) => { setEditingItem(s); setShowForm(true); }} onDelete={setDeleteTarget} rowKey={(s) => s.id} />
      <PartnerFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={fetchData} item={editingItem} />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={async () => { setDeleting(true); try { await wingServicesApi.delete(deleteTarget!.id); toast.success('Deleted'); setDeleteTarget(null); fetchData(); } catch {} finally { setDeleting(false); } }} loading={deleting} />
    </div>
  );
}
