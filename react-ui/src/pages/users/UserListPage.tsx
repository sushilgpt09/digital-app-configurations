import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { usersApi } from '../../api/users.api';
import { User } from '../../types/user.types';
import { PagedResponse } from '../../types/api.types';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchFilter } from '../../components/common/SearchFilter';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { UserFormModal } from './UserFormModal';
import toast from 'react-hot-toast';

export function UserListPage() {
  const [data, setData] = useState<PagedResponse<User>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.getAll({ page, size, search: searchQuery, status: statusQuery || undefined });
      setData(res.data.data);
    } catch { /* */ } finally { setLoading(false); }
  }, [page, size, searchQuery, statusQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = () => { setSearchQuery(search); setStatusQuery(status); setPage(0); };
  const handleReset = () => { setSearch(''); setStatus(''); setSearchQuery(''); setStatusQuery(''); setPage(0); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await usersApi.delete(deleteTarget.id); toast.success('User deleted'); setDeleteTarget(null); fetchData(); }
    catch { /* */ } finally { setDeleting(false); }
  };

  const columns: Column<User>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'fullName', header: 'FULL NAME', render: (u) => <span className="font-medium">{u.fullName}</span> },
    { key: 'email', header: 'EMAIL' },
    { key: 'phone', header: 'PHONE', render: (u) => u.phone || '-' },
    { key: 'roles', header: 'ROLES', render: (u) => u.roles.map((r) => r.name).join(', ') || '-' },
    { key: 'status', header: 'STATUS', render: (u) => <StatusBadge status={u.status} /> },
  ];

  return (
    <div>
      <PageHeader title="User Management" action={
        <button onClick={() => { setEditingItem(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-wing-info text-white rounded-lg hover:bg-blue-600">
          <Plus size={18} /> Add New User
        </button>
      } />
      <SearchFilter searchValue={search} onSearchChange={setSearch} onSearch={handleSearch} onReset={handleReset} placeholder="Search users..."
        statusValue={status} onStatusChange={setStatus} statusOptions={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]} />
      <DataTable columns={columns} data={data.content} loading={loading} page={data.page} size={data.size} totalElements={data.totalElements} totalPages={data.totalPages}
        onPageChange={setPage} onSizeChange={(s) => { setSize(s); setPage(0); }} onEdit={(u) => { setEditingItem(u); setShowForm(true); }} onDelete={setDeleteTarget} rowKey={(u) => u.id} />
      <UserFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={fetchData} user={editingItem} />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} message={`Delete user "${deleteTarget?.fullName}"?`} />
    </div>
  );
}
