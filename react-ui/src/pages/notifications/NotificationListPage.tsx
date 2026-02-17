import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { notificationsApi } from '../../api/notifications.api';
import { appLanguagesApi } from '../../api/appLanguages.api';
import { NotificationTemplate } from '../../types/notification.types';
import { AppLanguage } from '../../types/appLanguage.types';
import { PagedResponse } from '../../types/api.types';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchFilter } from '../../components/common/SearchFilter';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { NotificationFormModal } from './NotificationFormModal';
import toast from 'react-hot-toast';

const typeColors: Record<string, string> = { PUSH: 'bg-purple-100 text-purple-700', SMS: 'bg-teal-100 text-teal-700', EMAIL: 'bg-orange-100 text-orange-700' };

const titleKey = (code: string) => `title${code.charAt(0).toUpperCase()}${code.slice(1).toLowerCase()}`;

export function NotificationListPage() {
  const [data, setData] = useState<PagedResponse<NotificationTemplate>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<NotificationTemplate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NotificationTemplate | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [languages, setLanguages] = useState<AppLanguage[]>([]);

  useEffect(() => {
    appLanguagesApi.getAll({ page: 0, size: 100, status: 'ACTIVE' }).then((res) => {
      setLanguages(res.data.data.content);
    }).catch(() => {});
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await notificationsApi.getAll({ page, size, search: searchQuery }); setData(res.data.data); }
    catch { /* */ } finally { setLoading(false); }
  }, [page, size, searchQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<NotificationTemplate>[] = useMemo(() => {
    const cols: Column<NotificationTemplate>[] = [
      { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
      { key: 'code', header: 'CODE', render: (n) => <span className="font-mono text-sm font-medium">{n.code}</span> },
    ];
    languages.forEach((lang) => {
      const tk = titleKey(lang.code);
      cols.push({
        key: tk,
        header: `TITLE (${lang.code.toUpperCase()})`,
        render: (n) => n[tk] || '-',
      });
    });
    cols.push(
      { key: 'type', header: 'TYPE', render: (n) => <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[n.type] || 'bg-gray-100'}`}>{n.type}</span> },
      { key: 'status', header: 'STATUS', render: (n) => <StatusBadge status={n.status} /> },
    );
    return cols;
  }, [languages]);

  return (
    <div>
      <PageHeader title="Notification Templates" action={<button onClick={() => { setEditingItem(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors"><Plus size={18} /> Add Template</button>} />
      <SearchFilter searchValue={search} onSearchChange={setSearch} onSearch={() => { setSearchQuery(search); setPage(0); }} onReset={() => { setSearch(''); setSearchQuery(''); setPage(0); }} placeholder="Search templates..." />
      <DataTable columns={columns} data={data.content} loading={loading} page={data.page} size={data.size} totalElements={data.totalElements} totalPages={data.totalPages} onPageChange={setPage} onSizeChange={(s) => { setSize(s); setPage(0); }} onEdit={(n) => { setEditingItem(n); setShowForm(true); }} onDelete={setDeleteTarget} rowKey={(n) => n.id} />
      <NotificationFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={fetchData} item={editingItem} languages={languages} />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={async () => { setDeleting(true); try { await notificationsApi.delete(deleteTarget!.id); toast.success('Deleted'); setDeleteTarget(null); fetchData(); } catch {} finally { setDeleting(false); } }} loading={deleting} />
    </div>
  );
}
