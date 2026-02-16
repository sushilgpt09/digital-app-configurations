import { useState, useEffect, useCallback } from 'react';
import { auditLogsApi } from '../../api/auditLogs.api';
import { AuditLog } from '../../types/auditLog.types';
import { PagedResponse } from '../../types/api.types';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchFilter } from '../../components/common/SearchFilter';
import { DataTable, Column } from '../../components/common/DataTable';

export function AuditLogPage() {
  const [data, setData] = useState<PagedResponse<AuditLog>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await auditLogsApi.getAll({ page, size, search: searchQuery }); setData(res.data.data); }
    catch { /* */ } finally { setLoading(false); }
  }, [page, size, searchQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const actionColors: Record<string, string> = { CREATE: 'bg-green-100 text-green-700', UPDATE: 'bg-blue-100 text-blue-700', DELETE: 'bg-red-100 text-red-700' };

  const columns: Column<AuditLog>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'userEmail', header: 'USER', render: (a) => <span className="font-medium">{a.userEmail || '-'}</span> },
    { key: 'action', header: 'ACTION', render: (a) => <span className={`px-2 py-1 rounded text-xs font-medium ${actionColors[a.action] || 'bg-gray-100'}`}>{a.action}</span> },
    { key: 'entityType', header: 'ENTITY TYPE', render: (a) => a.entityType || '-' },
    { key: 'entityId', header: 'ENTITY ID', render: (a) => a.entityId ? <span className="font-mono text-xs">{a.entityId.substring(0, 8)}...</span> : '-' },
    { key: 'ipAddress', header: 'IP ADDRESS', render: (a) => a.ipAddress || '-' },
    { key: 'createdAt', header: 'TIMESTAMP', render: (a) => a.createdAt ? new Date(a.createdAt).toLocaleString() : '-' },
  ];

  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="Read-only log of all system activities" />
      <SearchFilter searchValue={search} onSearchChange={setSearch} onSearch={() => { setSearchQuery(search); setPage(0); }} onReset={() => { setSearch(''); setSearchQuery(''); setPage(0); }} placeholder="Search audit logs..." />
      <DataTable columns={columns} data={data.content} loading={loading} page={data.page} size={data.size} totalElements={data.totalElements} totalPages={data.totalPages} onPageChange={setPage} onSizeChange={(s) => { setSize(s); setPage(0); }} rowKey={(a) => a.id} />
    </div>
  );
}
