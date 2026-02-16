import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { usersApi } from '../../api/users.api';
import { rolesApi } from '../../api/roles.api';
import { User } from '../../types/user.types';
import { Role } from '../../types/role.types';
import { PagedResponse } from '../../types/api.types';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchFilter } from '../../components/common/SearchFilter';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { UserFormModal } from './UserFormModal';
import { RoleFormModal } from '../roles/RoleFormModal';
import toast from 'react-hot-toast';

type TabKey = 'users' | 'roles';

export function UserListPage() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabKey | null;
  const activeTab: TabKey = tabParam && ['users', 'roles'].includes(tabParam) ? tabParam : 'users';

  // Users state
  const [userData, setUserData] = useState<PagedResponse<User>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [userLoading, setUserLoading] = useState(true);
  const [userPage, setUserPage] = useState(0);
  const [userSize, setUserSize] = useState(10);
  const [userSearch, setUserSearch] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userStatusQuery, setUserStatusQuery] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);

  // Roles state
  const [roleData, setRoleData] = useState<PagedResponse<Role>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [roleLoading, setRoleLoading] = useState(true);
  const [rolePage, setRolePage] = useState(0);
  const [roleSize, setRoleSize] = useState(10);
  const [roleSearch, setRoleSearch] = useState('');
  const [roleStatus, setRoleStatus] = useState('');
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [roleStatusQuery, setRoleStatusQuery] = useState('');
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteRoleTarget, setDeleteRoleTarget] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState(false);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setUserLoading(true);
    try {
      const res = await usersApi.getAll({ page: userPage, size: userSize, search: userSearchQuery, status: userStatusQuery || undefined });
      setUserData(res.data.data);
    } catch { /* */ } finally { setUserLoading(false); }
  }, [userPage, userSize, userSearchQuery, userStatusQuery]);

  // Fetch roles
  const fetchRoles = useCallback(async () => {
    setRoleLoading(true);
    try {
      const res = await rolesApi.getAll({ page: rolePage, size: roleSize, search: roleSearchQuery, status: roleStatusQuery || undefined });
      setRoleData(res.data.data);
    } catch { /* */ } finally { setRoleLoading(false); }
  }, [rolePage, roleSize, roleSearchQuery, roleStatusQuery]);

  useEffect(() => { if (activeTab === 'users') fetchUsers(); }, [fetchUsers, activeTab]);
  useEffect(() => { if (activeTab === 'roles') fetchRoles(); }, [fetchRoles, activeTab]);

  // User columns
  const userColumns: Column<User>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'fullName', header: 'FULL NAME', render: (u) => <span className="font-medium">{u.fullName}</span> },
    { key: 'email', header: 'EMAIL' },
    { key: 'phone', header: 'PHONE', render: (u) => u.phone || '-' },
    { key: 'roles', header: 'ROLES', render: (u) => u.roles.map((r) => r.name).join(', ') || '-' },
    { key: 'status', header: 'STATUS', render: (u) => <StatusBadge status={u.status} /> },
  ];

  // Role columns
  const roleColumns: Column<Role>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'name', header: 'ROLE NAME', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'status', header: 'STATUS', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'description', header: 'ROLE DESCRIPTION', render: (r) => <span className="text-gray-500">{r.description || '-'}</span> },
  ];

  const pageTitle = activeTab === 'users' ? 'Users' : 'Roles & Permissions';
  const addLabel = activeTab === 'users' ? 'Add New User' : 'Add New Role';

  const handleAdd = () => {
    if (activeTab === 'users') { setEditingUser(null); setShowUserForm(true); }
    else { setEditingRole(null); setShowRoleForm(true); }
  };

  return (
    <div>
      <PageHeader
        title={pageTitle}
        action={
          <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors">
            <Plus size={18} /> {addLabel}
          </button>
        }
      />

      {/* Users */}
      {activeTab === 'users' && (
        <>
          <SearchFilter
            searchValue={userSearch} onSearchChange={setUserSearch}
            onSearch={() => { setUserSearchQuery(userSearch); setUserStatusQuery(userStatus); setUserPage(0); }}
            onReset={() => { setUserSearch(''); setUserStatus(''); setUserSearchQuery(''); setUserStatusQuery(''); setUserPage(0); }}
            placeholder="Search users..."
            statusValue={userStatus} onStatusChange={setUserStatus}
            statusOptions={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]}
          />
          <DataTable
            columns={userColumns} data={userData.content} loading={userLoading}
            page={userData.page} size={userData.size} totalElements={userData.totalElements} totalPages={userData.totalPages}
            onPageChange={setUserPage} onSizeChange={(s) => { setUserSize(s); setUserPage(0); }}
            onEdit={(u) => { setEditingUser(u); setShowUserForm(true); }} onDelete={setDeleteUserTarget} rowKey={(u) => u.id}
          />
          <UserFormModal isOpen={showUserForm} onClose={() => setShowUserForm(false)} onSuccess={fetchUsers} user={editingUser} />
          <ConfirmDialog
            isOpen={!!deleteUserTarget} onClose={() => setDeleteUserTarget(null)} loading={deletingUser}
            message={`Delete user "${deleteUserTarget?.fullName}"?`}
            onConfirm={async () => { setDeletingUser(true); try { await usersApi.delete(deleteUserTarget!.id); toast.success('User deleted'); setDeleteUserTarget(null); fetchUsers(); } catch {} finally { setDeletingUser(false); } }}
          />
        </>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <>
          <SearchFilter
            searchValue={roleSearch} onSearchChange={setRoleSearch}
            onSearch={() => { setRoleSearchQuery(roleSearch); setRoleStatusQuery(roleStatus); setRolePage(0); }}
            onReset={() => { setRoleSearch(''); setRoleStatus(''); setRoleSearchQuery(''); setRoleStatusQuery(''); setRolePage(0); }}
            placeholder="Search roles..."
            statusValue={roleStatus} onStatusChange={setRoleStatus}
            statusOptions={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }]}
          />
          <DataTable
            columns={roleColumns} data={roleData.content} loading={roleLoading}
            page={roleData.page} size={roleData.size} totalElements={roleData.totalElements} totalPages={roleData.totalPages}
            onPageChange={setRolePage} onSizeChange={(s) => { setRoleSize(s); setRolePage(0); }}
            onEdit={(r) => { setEditingRole(r); setShowRoleForm(true); }} onDelete={setDeleteRoleTarget} rowKey={(r) => r.id}
          />
          <RoleFormModal isOpen={showRoleForm} onClose={() => setShowRoleForm(false)} onSuccess={fetchRoles} role={editingRole} />
          <ConfirmDialog
            isOpen={!!deleteRoleTarget} onClose={() => setDeleteRoleTarget(null)} loading={deletingRole}
            message={`Are you sure you want to delete role "${deleteRoleTarget?.name}"?`}
            onConfirm={async () => { setDeletingRole(true); try { await rolesApi.delete(deleteRoleTarget!.id); toast.success('Role deleted'); setDeleteRoleTarget(null); fetchRoles(); } catch {} finally { setDeletingRole(false); } }}
          />
        </>
      )}
    </div>
  );
}
