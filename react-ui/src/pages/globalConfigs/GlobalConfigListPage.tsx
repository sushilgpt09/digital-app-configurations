import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { globalConfigsApi } from '../../api/globalConfigs.api';
import { GlobalConfig } from '../../types/globalConfig.types';
import { PagedResponse } from '../../types/api.types';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchFilter } from '../../components/common/SearchFilter';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { GlobalConfigFormModal } from './GlobalConfigFormModal';
import toast from 'react-hot-toast';

export function GlobalConfigListPage() {
  const [data, setData] = useState<PagedResponse<GlobalConfig>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GlobalConfig | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GlobalConfig | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await globalConfigsApi.getAll({ page, size, search: searchQuery }); setData(res.data.data); }
    catch { /* */ } finally { setLoading(false); }
  }, [page, size, searchQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<GlobalConfig>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'configKey', header: 'CONFIG KEY', render: (g) => <span className="font-mono text-sm font-medium">{g.configKey}</span> },
    { key: 'configValue', header: 'VALUE', render: (g) => <span className="truncate max-w-[200px] block">{g.configValue || '-'}</span> },
    { key: 'platform', header: 'PLATFORM', render: (g) => <span className="px-2 py-1 bg-gray-100 rounded text-xs">{g.platform}</span> },
    { key: 'version', header: 'VERSION' },
    { key: 'status', header: 'STATUS', render: (g) => <StatusBadge status={g.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Global Configuration" action={<button onClick={() => { setEditingItem(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-wing-info text-white rounded-lg hover:bg-blue-600"><Plus size={18} /> Add Config</button>} />
      <SearchFilter searchValue={search} onSearchChange={setSearch} onSearch={() => { setSearchQuery(search); setPage(0); }} onReset={() => { setSearch(''); setSearchQuery(''); setPage(0); }} placeholder="Search configs..." />
      <DataTable columns={columns} data={data.content} loading={loading} page={data.page} size={data.size} totalElements={data.totalElements} totalPages={data.totalPages} onPageChange={setPage} onSizeChange={(s) => { setSize(s); setPage(0); }} onEdit={(g) => { setEditingItem(g); setShowForm(true); }} onDelete={setDeleteTarget} rowKey={(g) => g.id} />
      <GlobalConfigFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={fetchData} item={editingItem} />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={async () => { setDeleting(true); try { await globalConfigsApi.delete(deleteTarget!.id); toast.success('Deleted'); setDeleteTarget(null); fetchData(); } catch {} finally { setDeleting(false); } }} loading={deleting} />
    </div>
  );
}
