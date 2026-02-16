import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { rolesApi } from '../../api/roles.api';
import { Role } from '../../types/role.types';
import { PagedResponse } from '../../types/api.types';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchFilter } from '../../components/common/SearchFilter';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { RoleFormModal } from './RoleFormModal';
import toast from 'react-hot-toast';

export function RoleListPage() {
  const [data, setData] = useState<PagedResponse<Role>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await rolesApi.getAll({ page, size, search: searchQuery, status: statusQuery || undefined });
      setData(res.data.data);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [page, size, searchQuery, statusQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = () => { setSearchQuery(search); setStatusQuery(status); setPage(0); };
  const handleReset = () => { setSearch(''); setStatus(''); setSearchQuery(''); setStatusQuery(''); setPage(0); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await rolesApi.delete(deleteTarget.id);
      toast.success('Role deleted successfully');
      setDeleteTarget(null);
      fetchData();
    } catch {
      // handled
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Role>[] = [
    { key: 'index', header: 'ROLE ID', width: '100px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'name', header: 'ROLE NAME', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'status', header: 'STATUS', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'description', header: 'ROLE DESCRIPTION', render: (r) => <span className="text-gray-500">{r.description || '-'}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Roles and Permissions"
        action={
          <button
            onClick={() => { setEditingRole(null); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors transition-colors"
          >
            <Plus size={18} /> Add New Role
          </button>
        }
      />

      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        onSearch={handleSearch}
        onReset={handleReset}
        placeholder="Search roles..."
        statusValue={status}
        onStatusChange={setStatus}
        statusOptions={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Inactive', value: 'INACTIVE' },
        ]}
      />

      <DataTable
        columns={columns}
        data={data.content}
        loading={loading}
        page={data.page}
        size={data.size}
        totalElements={data.totalElements}
        totalPages={data.totalPages}
        onPageChange={setPage}
        onSizeChange={(s) => { setSize(s); setPage(0); }}
        onEdit={(role) => { setEditingRole(role); setShowForm(true); }}
        onDelete={(role) => setDeleteTarget(role)}
        rowKey={(r) => r.id}
      />

      <RoleFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={fetchData}
        role={editingRole}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Are you sure you want to delete role "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
