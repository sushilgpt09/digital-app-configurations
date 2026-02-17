import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { messagesApi } from '../../api/messages.api';
import { appLanguagesApi } from '../../api/appLanguages.api';
import { ApiMessageItem } from '../../types/message.types';
import { AppLanguage } from '../../types/appLanguage.types';
import { PagedResponse } from '../../types/api.types';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchFilter } from '../../components/common/SearchFilter';
import { DataTable, Column } from '../../components/common/DataTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { MessageFormModal } from './MessageFormModal';
import toast from 'react-hot-toast';

const typeColors: Record<string, string> = { ERROR: 'bg-red-100 text-red-700', SUCCESS: 'bg-green-100 text-green-700', INFO: 'bg-blue-100 text-blue-700', WARNING: 'bg-yellow-100 text-yellow-700' };

const langFieldKey = (code: string) => `${code.toLowerCase()}Message`;

export function MessageListPage() {
  const [data, setData] = useState<PagedResponse<ApiMessageItem>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiMessageItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiMessageItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [languages, setLanguages] = useState<AppLanguage[]>([]);

  useEffect(() => {
    appLanguagesApi.getAll({ page: 0, size: 100, status: 'ACTIVE' }).then((res) => {
      setLanguages(res.data.data.content);
    }).catch(() => {});
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await messagesApi.getAll({ page, size, search: searchQuery }); setData(res.data.data); }
    catch { /* */ } finally { setLoading(false); }
  }, [page, size, searchQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<ApiMessageItem>[] = useMemo(() => {
    const cols: Column<ApiMessageItem>[] = [
      { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
      { key: 'errorCode', header: 'CODE', render: (m) => <span className="font-mono text-sm font-medium">{m.errorCode}</span> },
    ];
    languages.forEach((lang) => {
      const fk = langFieldKey(lang.code);
      cols.push({
        key: fk,
        header: `${lang.name.toUpperCase()} MESSAGE`,
        render: (m) => <span className="truncate max-w-[250px] block">{String(m[fk] || '-')}</span>,
      });
    });
    cols.push(
      { key: 'type', header: 'TYPE', render: (m) => <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[m.type] || 'bg-gray-100'}`}>{m.type}</span> },
      { key: 'httpStatus', header: 'HTTP STATUS', render: (m) => m.httpStatus },
    );
    return cols;
  }, [languages]);

  return (
    <div>
      <PageHeader title="API Message Management" action={<button onClick={() => { setEditingItem(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors"><Plus size={18} /> Add Message</button>} />
      <SearchFilter searchValue={search} onSearchChange={setSearch} onSearch={() => { setSearchQuery(search); setPage(0); }} onReset={() => { setSearch(''); setSearchQuery(''); setPage(0); }} placeholder="Search messages..." />
      <DataTable columns={columns} data={data.content} loading={loading} page={data.page} size={data.size} totalElements={data.totalElements} totalPages={data.totalPages} onPageChange={setPage} onSizeChange={(s) => { setSize(s); setPage(0); }} onEdit={(m) => { setEditingItem(m); setShowForm(true); }} onDelete={setDeleteTarget} rowKey={(m) => m.id} />
      <MessageFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={fetchData} item={editingItem} languages={languages} />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={async () => { setDeleting(true); try { await messagesApi.delete(deleteTarget!.id); toast.success('Deleted'); setDeleteTarget(null); fetchData(); } catch {} finally { setDeleting(false); } }} loading={deleting} />
    </div>
  );
}
