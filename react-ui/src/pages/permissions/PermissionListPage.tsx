import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { permissionsApi } from '../../api/permissions.api';
import { Permission } from '../../types/role.types';
import { PagedResponse } from '../../types/api.types';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchFilter } from '../../components/common/SearchFilter';
import { DataTable, Column } from '../../components/common/DataTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { PermissionFormModal } from './PermissionFormModal';
import toast from 'react-hot-toast';

export function PermissionListPage() {
  const [data, setData] = useState<PagedResponse<Permission>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Permission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Permission | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await permissionsApi.getAll({ page, size, search: searchQuery }); setData(res.data.data); }
    catch { /* */ } finally { setLoading(false); }
  }, [page, size, searchQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<Permission>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'name', header: 'NAME', render: (p) => <span className="font-medium">{p.name}</span> },
    { key: 'module', header: 'MODULE', render: (p) => <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">{p.module}</span> },
    { key: 'description', header: 'DESCRIPTION', render: (p) => p.description || '-' },
  ];

  return (
    <div>
      <PageHeader title="Permissions" action={<button onClick={() => { setEditingItem(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors"><Plus size={18} /> Add Permission</button>} />
      <SearchFilter searchValue={search} onSearchChange={setSearch} onSearch={() => { setSearchQuery(search); setPage(0); }} onReset={() => { setSearch(''); setSearchQuery(''); setPage(0); }} placeholder="Search permissions..." />
      <DataTable columns={columns} data={data.content} loading={loading} page={data.page} size={data.size} totalElements={data.totalElements} totalPages={data.totalPages}
        onPageChange={setPage} onSizeChange={(s) => { setSize(s); setPage(0); }} onEdit={(p) => { setEditingItem(p); setShowForm(true); }} onDelete={setDeleteTarget} rowKey={(p) => p.id} />
      <PermissionFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={fetchData} item={editingItem} />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={async () => { setDeleting(true); try { await permissionsApi.delete(deleteTarget!.id); toast.success('Deleted'); setDeleteTarget(null); fetchData(); } catch {} finally { setDeleting(false); } }} loading={deleting} />
    </div>
  );
}
