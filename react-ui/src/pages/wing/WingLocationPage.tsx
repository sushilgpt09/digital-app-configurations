import { useState, useEffect, useCallback, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { wingLocationsApi } from '../../api/wingLocations.api';
import { WingLocation, WingLocationRequest } from '../../types/wing.types';
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

const EMPTY: WingLocationRequest = { name: '', icon: '', sortOrder: 0, status: 'ACTIVE' };

function LocationFormModal({ isOpen, onClose, onSuccess, item }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: WingLocation | null }) {
  const [form, setForm] = useState<WingLocationRequest>(EMPTY);
  const [loading, setLoading] = useState(false);
  const isEdit = !!item;

  useEffect(() => {
    setForm(item ? { name: item.name, icon: item.icon || '', sortOrder: item.sortOrder, status: item.status } : { ...EMPTY });
  }, [item, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) { toast.error('Name is required'); return; }
    setLoading(true);
    try {
      if (isEdit && item) { await wingLocationsApi.update(item.id, form); toast.success('Updated'); }
      else { await wingLocationsApi.create(form); toast.success('Created'); }
      onSuccess(); onClose();
    } catch { /**/ } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Location' : 'Add Location'}>
      <form onSubmit={handleSubmit}>
        <InputField label="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <InputField label="Icon (emoji)" value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="📍" />
        <InputField label="Sort Order" type="number" value={String(form.sortOrder ?? 0)} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        <SelectField label="Status" value={form.status || 'ACTIVE'} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}

export function WingLocationPage() {
  const [data, setData] = useState<PagedResponse<WingLocation>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WingLocation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WingLocation | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await wingLocationsApi.getAll({ page, size, search: searchQuery, status: statusQuery || undefined }); setData(res.data.data); }
    catch { /**/ } finally { setLoading(false); }
  }, [page, size, searchQuery, statusQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<WingLocation>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'icon', header: 'ICON', width: '80px', render: (l) => <span className="text-xl">{l.icon || '—'}</span> },
    { key: 'name', header: 'NAME', render: (l) => <span className="font-medium">{l.name}</span> },
    { key: 'sortOrder', header: 'ORDER', width: '80px', render: (l) => l.sortOrder },
    { key: 'status', header: 'STATUS', render: (l) => <StatusBadge status={l.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Wing+ Locations" action={<button onClick={() => { setEditingItem(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors"><Plus size={18} /> Add Location</button>} />
      <SearchFilter searchValue={search} onSearchChange={setSearch} onSearch={() => { setSearchQuery(search); setStatusQuery(status); setPage(0); }} onReset={() => { setSearch(''); setStatus(''); setSearchQuery(''); setStatusQuery(''); setPage(0); }} placeholder="Search locations..." statusValue={status} onStatusChange={setStatus} statusOptions={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />
      <DataTable columns={columns} data={data.content} loading={loading} page={data.page} size={data.size} totalElements={data.totalElements} totalPages={data.totalPages} onPageChange={setPage} onSizeChange={(s) => { setSize(s); setPage(0); }} onEdit={(l) => { setEditingItem(l); setShowForm(true); }} onDelete={setDeleteTarget} rowKey={(l) => l.id} />
      <LocationFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={fetchData} item={editingItem} />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={async () => { setDeleting(true); try { await wingLocationsApi.delete(deleteTarget!.id); toast.success('Deleted'); setDeleteTarget(null); fetchData(); } catch {} finally { setDeleting(false); } }} loading={deleting} />
    </div>
  );
}
