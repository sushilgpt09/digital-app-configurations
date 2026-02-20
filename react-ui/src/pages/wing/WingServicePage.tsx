import { useState, useEffect, useCallback, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { wingServicesApi } from '../../api/wingServices.api';
import { wingCategoriesApi } from '../../api/wingCategories.api';
import { WingService, WingServiceRequest, WingServiceTranslationData, WingCategory } from '../../types/wing.types';
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
const EMPTY_TRANS: WingServiceTranslationData = { title: '', description: '' };
const EMPTY: WingServiceRequest = {
  categoryId: '', icon: '', imageUrl: '', sortOrder: 0, status: 'ACTIVE',
  translations: { en: { ...EMPTY_TRANS }, km: { ...EMPTY_TRANS } },
};

function ServiceFormModal({
  isOpen, onClose, onSuccess, item, categories,
}: {
  isOpen: boolean; onClose: () => void; onSuccess: () => void;
  item?: WingService | null; categories: WingCategory[];
}) {
  const [form, setForm] = useState<WingServiceRequest>(EMPTY);
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) {
      setForm({
        categoryId: item.categoryId,
        icon: item.icon || '',
        imageUrl: item.imageUrl || '',
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

  const setTrans = (lang: string, field: keyof WingServiceTranslationData, val: string) => {
    setForm((f) => ({
      ...f,
      translations: { ...f.translations, [lang]: { ...((f.translations || {})[lang] || EMPTY_TRANS), [field]: val } },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) { toast.error('Category is required'); return; }
    if (!form.translations?.en?.title?.trim()) { toast.error('English title is required'); return; }
    setLoading(true);
    try {
      if (isEdit && item) { await wingServicesApi.update(item.id, form); toast.success('Updated'); }
      else { await wingServicesApi.create(form); toast.success('Created'); }
      onSuccess(); onClose();
    } catch { /**/ } finally { setLoading(false); }
  };

  const trans = form.translations || {};
  const categoryOptions = categories.map((c) => ({ label: `${c.icon || ''} ${c.translations?.en?.name || c.key}`, value: c.id }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Service' : 'Add Service'}>
      <form onSubmit={handleSubmit}>
        <SelectField label="Category" value={form.categoryId || ''} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} options={categoryOptions} placeholder="Select category" required />
        <InputField label="Icon (emoji)" value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="💳" />
        <InputField label="Image URL" value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
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
            <InputField label="Title" value={trans[activeLang]?.title || ''} onChange={(e) => setTrans(activeLang, 'title', e.target.value)} placeholder={`Title in ${LANGS.find(l => l.code === activeLang)?.label}`} />
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
  const [categories, setCategories] = useState<WingCategory[]>([]);
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

  useEffect(() => {
    wingCategoriesApi.getAll({ page: 0, size: 100 }).then((r) => setCategories(r.data.data.content)).catch(() => {});
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await wingServicesApi.getAll({ page, size, search: searchQuery, status: statusQuery || undefined }); setData(res.data.data); }
    catch { /**/ } finally { setLoading(false); }
  }, [page, size, searchQuery, statusQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<WingService>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'icon', header: 'ICON', width: '70px', render: (s) => <span className="text-xl">{s.icon || '—'}</span> },
    { key: 'title', header: 'TITLE (EN)', render: (s) => <span className="font-medium">{s.translations?.en?.title || '—'}</span> },
    { key: 'titleKm', header: 'TITLE (KM)', render: (s) => <span>{s.translations?.km?.title || '—'}</span> },
    { key: 'category', header: 'CATEGORY', render: (s) => <span className="text-sm text-gray-600">{s.categoryKey || '—'}</span> },
    { key: 'sortOrder', header: 'ORDER', width: '80px', render: (s) => s.sortOrder },
    { key: 'status', header: 'STATUS', render: (s) => <StatusBadge status={s.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Wing+ Services" action={<button onClick={() => { setEditingItem(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors"><Plus size={18} /> Add Service</button>} />
      <SearchFilter searchValue={search} onSearchChange={setSearch} onSearch={() => { setSearchQuery(search); setStatusQuery(status); setPage(0); }} onReset={() => { setSearch(''); setStatus(''); setSearchQuery(''); setStatusQuery(''); setPage(0); }} placeholder="Search services..." statusValue={status} onStatusChange={setStatus} statusOptions={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />
      <DataTable columns={columns} data={data.content} loading={loading} page={data.page} size={data.size} totalElements={data.totalElements} totalPages={data.totalPages} onPageChange={setPage} onSizeChange={(s) => { setSize(s); setPage(0); }} onEdit={(s) => { setEditingItem(s); setShowForm(true); }} onDelete={setDeleteTarget} rowKey={(s) => s.id} />
      <ServiceFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={fetchData} item={editingItem} categories={categories} />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={async () => { setDeleting(true); try { await wingServicesApi.delete(deleteTarget!.id); toast.success('Deleted'); setDeleteTarget(null); fetchData(); } catch {} finally { setDeleting(false); } }} loading={deleting} />
    </div>
  );
}
