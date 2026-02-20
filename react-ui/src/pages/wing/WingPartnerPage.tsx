import { useState, useEffect, useCallback, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { wingPartnersApi } from '../../api/wingPartners.api';
import { WingPartner, WingPartnerRequest, WingPartnerTranslationData } from '../../types/wing.types';
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
const EMPTY_TRANS: WingPartnerTranslationData = { name: '', description: '' };
const EMPTY: WingPartnerRequest = {
  icon: '', bgColor: '', borderColor: '', badge: '', sortOrder: 0, status: 'ACTIVE',
  translations: { en: { ...EMPTY_TRANS }, km: { ...EMPTY_TRANS } },
};

function NewPartnerFormModal({
  isOpen, onClose, onSuccess, item,
}: {
  isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: WingPartner | null;
}) {
  const [form, setForm] = useState<WingPartnerRequest>(EMPTY);
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    if (item) {
      setForm({
        icon: item.icon || '',
        bgColor: item.bgColor || '',
        borderColor: item.borderColor || '',
        badge: item.badge || '',
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

  const setTrans = (lang: string, field: keyof WingPartnerTranslationData, val: string) => {
    setForm((f) => ({
      ...f,
      translations: { ...f.translations, [lang]: { ...((f.translations || {})[lang] || EMPTY_TRANS), [field]: val } },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.translations?.en?.name?.trim()) { toast.error('English name is required'); return; }
    setLoading(true);
    try {
      if (isEdit && item) { await wingPartnersApi.update(item.id, form); toast.success('Updated'); }
      else { await wingPartnersApi.create(form); toast.success('Created'); }
      onSuccess(); onClose();
    } catch { /**/ } finally { setLoading(false); }
  };

  const trans = form.translations || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit New Partner' : 'Add New Partner'}>
      <form onSubmit={handleSubmit}>
        <InputField label="Icon (URL or emoji)" value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="https://... or 🏦" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <InputField label="BG Color" value={form.bgColor || ''} onChange={(e) => setForm({ ...form, bgColor: e.target.value })} placeholder="#f0f4ff" />
            {form.bgColor && <div className="mt-1 h-4 rounded border border-gray-200" style={{ background: form.bgColor }} />}
          </div>
          <div>
            <InputField label="Border Color" value={form.borderColor || ''} onChange={(e) => setForm({ ...form, borderColor: e.target.value })} placeholder="#c7d7f8" />
            {form.borderColor && <div className="mt-1 h-4 rounded border-2" style={{ borderColor: form.borderColor }} />}
          </div>
        </div>
        <InputField label="Badge Text" value={form.badge || ''} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. 0%" />
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
            <InputField label="Name" value={trans[activeLang]?.name || ''} onChange={(e) => setTrans(activeLang, 'name', e.target.value)} placeholder={`Name in ${LANGS.find(l => l.code === activeLang)?.label}`} />
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

export function WingPartnerPage() {
  const [data, setData] = useState<PagedResponse<WingPartner>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WingPartner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WingPartner | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await wingPartnersApi.getAll({ page, size, search: searchQuery, status: statusQuery || undefined }); setData(res.data.data); }
    catch { /**/ } finally { setLoading(false); }
  }, [page, size, searchQuery, statusQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<WingPartner>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    {
      key: 'icon', header: 'ICON', width: '90px', render: (p) => (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm overflow-hidden border-2"
          style={{ background: p.bgColor || '#f0f4ff', borderColor: p.borderColor || 'transparent' }}>
          {p.icon?.startsWith('http') ? <img src={p.icon} alt="" className="w-8 h-8 object-contain" /> : <span className="text-lg">{p.icon || '🏦'}</span>}
        </div>
      )
    },
    { key: 'name', header: 'NAME (EN)', render: (p) => <span className="font-medium">{p.translations?.en?.name || '—'}</span> },
    { key: 'nameKm', header: 'NAME (KM)', render: (p) => <span>{p.translations?.km?.name || '—'}</span> },
    { key: 'badge', header: 'BADGE', width: '80px', render: (p) => p.badge ? <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">{p.badge}</span> : '—' },
    {
      key: 'colors', header: 'COLORS', width: '100px', render: (p) => (
        <div className="flex gap-1">
          {p.bgColor && <div className="w-5 h-5 rounded border border-gray-200" style={{ background: p.bgColor }} title={`BG: ${p.bgColor}`} />}
          {p.borderColor && <div className="w-5 h-5 rounded border-2" style={{ borderColor: p.borderColor }} title={`Border: ${p.borderColor}`} />}
        </div>
      )
    },
    { key: 'sortOrder', header: 'ORDER', width: '80px', render: (p) => p.sortOrder },
    { key: 'status', header: 'STATUS', render: (p) => <StatusBadge status={p.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Wing+ New Partners" action={<button onClick={() => { setEditingItem(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors"><Plus size={18} /> Add New Partner</button>} />
      <SearchFilter searchValue={search} onSearchChange={setSearch} onSearch={() => { setSearchQuery(search); setStatusQuery(status); setPage(0); }} onReset={() => { setSearch(''); setStatus(''); setSearchQuery(''); setStatusQuery(''); setPage(0); }} placeholder="Search new partners..." statusValue={status} onStatusChange={setStatus} statusOptions={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />
      <DataTable columns={columns} data={data.content} loading={loading} page={data.page} size={data.size} totalElements={data.totalElements} totalPages={data.totalPages} onPageChange={setPage} onSizeChange={(s) => { setSize(s); setPage(0); }} onEdit={(p) => { setEditingItem(p); setShowForm(true); }} onDelete={setDeleteTarget} rowKey={(p) => p.id} />
      <NewPartnerFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={fetchData} item={editingItem} />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={async () => { setDeleting(true); try { await wingPartnersApi.delete(deleteTarget!.id); toast.success('Deleted'); setDeleteTarget(null); fetchData(); } catch {} finally { setDeleting(false); } }} loading={deleting} />
    </div>
  );
}
