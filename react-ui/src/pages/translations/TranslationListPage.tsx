import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { translationsApi } from '../../api/translations.api';
import { Translation } from '../../types/translation.types';
import { PagedResponse } from '../../types/api.types';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchFilter } from '../../components/common/SearchFilter';
import { DataTable, Column } from '../../components/common/DataTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { TranslationFormModal } from './TranslationFormModal';
import toast from 'react-hot-toast';

export function TranslationListPage() {
  const [data, setData] = useState<PagedResponse<Translation>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Translation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Translation | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await translationsApi.getAll({ page, size, search: searchQuery }); setData(res.data.data); }
    catch { /* */ } finally { setLoading(false); }
  }, [page, size, searchQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<Translation>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'key', header: 'KEY', render: (t) => <span className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">{t.key}</span> },
    { key: 'enValue', header: 'ENGLISH', render: (t) => <span className="truncate max-w-[200px] block">{t.enValue || '-'}</span> },
    { key: 'kmValue', header: 'KHMER', render: (t) => <span className="truncate max-w-[200px] block">{t.kmValue || '-'}</span> },
    { key: 'module', header: 'MODULE', render: (t) => t.module ? <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{t.module}</span> : '-' },
    { key: 'platform', header: 'PLATFORM', render: (t) => t.platform },
  ];

  return (
    <div>
      <PageHeader title="Translation Management" action={<button onClick={() => { setEditingItem(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors"><Plus size={18} /> Add Translation</button>} />
      <SearchFilter searchValue={search} onSearchChange={setSearch} onSearch={() => { setSearchQuery(search); setPage(0); }} onReset={() => { setSearch(''); setSearchQuery(''); setPage(0); }} placeholder="Search translations..." />
      <DataTable columns={columns} data={data.content} loading={loading} page={data.page} size={data.size} totalElements={data.totalElements} totalPages={data.totalPages} onPageChange={setPage} onSizeChange={(s) => { setSize(s); setPage(0); }} onEdit={(t) => { setEditingItem(t); setShowForm(true); }} onDelete={setDeleteTarget} rowKey={(t) => t.id} />
      <TranslationFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={fetchData} item={editingItem} />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={async () => { setDeleting(true); try { await translationsApi.delete(deleteTarget!.id); toast.success('Deleted'); setDeleteTarget(null); fetchData(); } catch {} finally { setDeleting(false); } }} loading={deleting} />
    </div>
  );
}
