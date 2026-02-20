import { useState, useEffect, useCallback, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { wingCategoriesApi } from '../../api/wingCategories.api';
import { WingCategory, WingCategoryRequest, WingCategoryTranslationData } from '../../types/wing.types';
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

const EMPTY_TRANS: WingCategoryTranslationData = { name: '', displayName: '' };

const EMPTY: WingCategoryRequest = {
  key: '',
  icon: '',
  sortOrder: 0,
  status: 'ACTIVE',
  translations: { en: { ...EMPTY_TRANS }, km: { ...EMPTY_TRANS } },
};

function CategoryFormModal({
  isOpen, onClose, onSuccess, item,
}: {
  isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: WingCategory | null;
}) {
  const [form, setForm] = useState<WingCategoryRequest>(EMPTY);
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) {
      setForm({
        key: item.key,
        icon: item.icon || '',
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

  const setTrans = (lang: string, field: keyof WingCategoryTranslationData, val: string) => {
    setForm((f) => ({
      ...f,
      translations: { ...f.translations, [lang]: { ...((f.translations || {})[lang] || EMPTY_TRANS), [field]: val } },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.key?.trim()) { toast.error('Key is required'); return; }
    if (!form.translations?.en?.name?.trim()) { toast.error('English name is required'); return; }
    setLoading(true);
    try {
      if (isEdit && item) { await wingCategoriesApi.update(item.id, form); toast.success('Updated'); }
      else { await wingCategoriesApi.create(form); toast.success('Created'); }
      onSuccess(); onClose();
    } catch { /**/ } finally { setLoading(false); }
  };

  const trans = form.translations || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Category' : 'Add Category'}>
      <form onSubmit={handleSubmit}>
        <InputField label="Key (unique identifier)" value={form.key || ''} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="e.g. government" required />
        <InputField label="Icon (emoji)" value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🏛️" />
        <InputField label="Sort Order" type="number" value={String(form.sortOrder ?? 0)} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        <SelectField label="Status" value={form.status || 'ACTIVE'} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />

        {/* Translation tabs */}
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
            <InputField label="Name" value={trans[activeLang]?.name || ''} onChange={(e) => setTrans(activeLang, 'name', e.target.value)} placeholder={`Category name in ${LANGS.find(l => l.code === activeLang)?.label}`} />
            <InputField label="Display Name" value={trans[activeLang]?.displayName || ''} onChange={(e) => setTrans(activeLang, 'displayName', e.target.value)} placeholder="Optional display name" />
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

export function WingCategoryPage() {
  const [data, setData] = useState<PagedResponse<WingCategory>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WingCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WingCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await wingCategoriesApi.getAll({ page, size, search: searchQuery, status: statusQuery || undefined }); setData(res.data.data); }
    catch { /**/ } finally { setLoading(false); }
  }, [page, size, searchQuery, statusQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<WingCategory>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'icon', header: 'ICON', width: '70px', render: (c) => <span className="text-xl">{c.icon || '—'}</span> },
    { key: 'key', header: 'KEY', render: (c) => <span className="font-mono text-sm text-gray-700">{c.key}</span> },
    { key: 'name', header: 'NAME (EN)', render: (c) => <span className="font-medium">{c.translations?.en?.name || '—'}</span> },
    { key: 'nameKm', header: 'NAME (KM)', render: (c) => <span>{c.translations?.km?.name || '—'}</span> },
    { key: 'sortOrder', header: 'ORDER', width: '80px', render: (c) => c.sortOrder },
    { key: 'status', header: 'STATUS', render: (c) => <StatusBadge status={c.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Wing+ Categories" action={<button onClick={() => { setEditingItem(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors"><Plus size={18} /> Add Category</button>} />
      <SearchFilter searchValue={search} onSearchChange={setSearch} onSearch={() => { setSearchQuery(search); setStatusQuery(status); setPage(0); }} onReset={() => { setSearch(''); setStatus(''); setSearchQuery(''); setStatusQuery(''); setPage(0); }} placeholder="Search categories..." statusValue={status} onStatusChange={setStatus} statusOptions={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />
      <DataTable columns={columns} data={data.content} loading={loading} page={data.page} size={data.size} totalElements={data.totalElements} totalPages={data.totalPages} onPageChange={setPage} onSizeChange={(s) => { setSize(s); setPage(0); }} onEdit={(c) => { setEditingItem(c); setShowForm(true); }} onDelete={setDeleteTarget} rowKey={(c) => c.id} />
      <CategoryFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={fetchData} item={editingItem} />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={async () => { setDeleting(true); try { await wingCategoriesApi.delete(deleteTarget!.id); toast.success('Deleted'); setDeleteTarget(null); fetchData(); } catch {} finally { setDeleting(false); } }} loading={deleting} />
    </div>
  );
}
