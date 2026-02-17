import { useState, useEffect, useCallback } from 'react';
import { Plus, History, ExternalLink, ChevronLeft } from 'lucide-react';
import { releasesApi } from '../../api/releases.api';
import { AppRelease } from '../../types/release.types';
import { PagedResponse } from '../../types/api.types';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ReleaseFormModal } from './ReleaseFormModal';
import toast from 'react-hot-toast';

type PlatformKey = 'IOS' | 'ANDROID' | 'HUAWEI';

const platformConfig: { key: PlatformKey; label: string; icon: string; badgeBg: string; badgeText: string; borderColor: string }[] = [
  { key: 'IOS', label: 'iOS', icon: '', badgeBg: 'bg-gray-100', badgeText: 'text-gray-800', borderColor: 'border-l-gray-800' },
  { key: 'ANDROID', label: 'Android', icon: '', badgeBg: 'bg-green-100', badgeText: 'text-green-700', borderColor: 'border-l-green-600' },
  { key: 'HUAWEI', label: 'Huawei', icon: '', badgeBg: 'bg-red-100', badgeText: 'text-red-700', borderColor: 'border-l-red-600' },
];

export function ReleaseHistoryPage() {
  const [latestReleases, setLatestReleases] = useState<Record<string, AppRelease | null>>({ IOS: null, ANDROID: null, HUAWEI: null });
  const [loading, setLoading] = useState(true);

  // History view state
  const [historyPlatform, setHistoryPlatform] = useState<PlatformKey | null>(null);
  const [historyData, setHistoryData] = useState<PagedResponse<AppRelease>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(0);
  const [historySize, setHistorySize] = useState(10);

  // Form / delete state
  const [showForm, setShowForm] = useState(false);
  const [formPlatform, setFormPlatform] = useState<PlatformKey>('ANDROID');
  const [editingItem, setEditingItem] = useState<AppRelease | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppRelease | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch latest release per platform
  const fetchLatest = useCallback(async () => {
    setLoading(true);
    try {
      const [ios, android, huawei] = await Promise.all([
        releasesApi.getAll({ page: 0, size: 1, platform: 'IOS' }),
        releasesApi.getAll({ page: 0, size: 1, platform: 'ANDROID' }),
        releasesApi.getAll({ page: 0, size: 1, platform: 'HUAWEI' }),
      ]);
      setLatestReleases({
        IOS: ios.data.data.content[0] || null,
        ANDROID: android.data.data.content[0] || null,
        HUAWEI: huawei.data.data.content[0] || null,
      });
    } catch { /* */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLatest(); }, [fetchLatest]);

  // Fetch history for a platform
  const fetchHistory = useCallback(async () => {
    if (!historyPlatform) return;
    setHistoryLoading(true);
    try {
      const res = await releasesApi.getAll({ page: historyPage, size: historySize, platform: historyPlatform });
      setHistoryData(res.data.data);
    } catch { /* */ } finally { setHistoryLoading(false); }
  }, [historyPlatform, historyPage, historySize]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const openAddRelease = (platform: PlatformKey) => {
    setFormPlatform(platform);
    setEditingItem(null);
    setShowForm(true);
  };

  const openHistory = (platform: PlatformKey) => {
    setHistoryPlatform(platform);
    setHistoryPage(0);
  };

  const handleFormSuccess = () => {
    fetchLatest();
    if (historyPlatform) fetchHistory();
  };

  const historyColumns: Column<AppRelease>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'version', header: 'VERSION', render: (r) => <span className="font-mono text-sm font-semibold">{r.version}</span> },
    { key: 'buildNumber', header: 'BUILD', render: (r) => <span className="font-mono text-sm text-gray-500">{r.buildNumber || '-'}</span> },
    { key: 'forceUpdate', header: 'FORCE UPDATE', render: (r) => (
      r.forceUpdate
        ? <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Enabled</span>
        : <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-semibold">Disabled</span>
    )},
    { key: 'releasedAt', header: 'RELEASE DATE', render: (r) => <span className="text-gray-600 text-sm">{r.releasedAt ? new Date(r.releasedAt).toLocaleDateString() : '-'}</span> },
    { key: 'downloadUrl', header: 'STORE URL', render: (r) => r.downloadUrl ? <a href={r.downloadUrl} target="_blank" rel="noreferrer" className="text-[#5C90E6] hover:underline text-sm flex items-center gap-1">Open <ExternalLink size={12} /></a> : <span className="text-gray-400">-</span> },
    { key: 'status', header: 'STATUS', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'releaseNotes', header: 'NOTES', render: (r) => <span className="truncate max-w-[180px] block text-gray-500 text-sm">{r.releaseNotes || '-'}</span> },
  ];

  // History view
  if (historyPlatform) {
    const config = platformConfig.find((p) => p.key === historyPlatform)!;
    return (
      <div>
        <PageHeader
          title={
            <div className="flex items-center gap-3">
              <button onClick={() => setHistoryPlatform(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronLeft size={20} className="text-gray-500" />
              </button>
              <span>{config.label} Release History</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${config.badgeBg} ${config.badgeText}`}>{config.label}</span>
            </div>
          }
          action={
            <button onClick={() => openAddRelease(historyPlatform)} className="flex items-center gap-2 px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors">
              <Plus size={18} /> New {config.label} Release
            </button>
          }
        />

        <DataTable
          columns={historyColumns}
          data={historyData.content}
          loading={historyLoading}
          page={historyData.page}
          size={historyData.size}
          totalElements={historyData.totalElements}
          totalPages={historyData.totalPages}
          onPageChange={setHistoryPage}
          onSizeChange={(s) => { setHistorySize(s); setHistoryPage(0); }}
          onEdit={(r) => { setEditingItem(r); setShowForm(true); }}
          onDelete={setDeleteTarget}
          rowKey={(r) => r.id}
        />

        <ReleaseFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={handleFormSuccess} item={editingItem} defaultPlatform={historyPlatform} />
        <ConfirmDialog
          isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} loading={deleting}
          message={`Delete release v${deleteTarget?.version} (${deleteTarget?.platform})?`}
          onConfirm={async () => { setDeleting(true); try { await releasesApi.delete(deleteTarget!.id); toast.success('Release deleted'); setDeleteTarget(null); handleFormSuccess(); } catch {} finally { setDeleting(false); } }}
        />
      </div>
    );
  }

  // Main view — 3 platform rows
  return (
    <div>
      <PageHeader title="App Release Management" />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5C90E6]" />
        </div>
      ) : (
        <div className="space-y-4">
          {platformConfig.map((platform) => {
            const release = latestReleases[platform.key];
            return (
              <div key={platform.key} className={`bg-white rounded-lg border border-gray-200 border-l-4 ${platform.borderColor} overflow-hidden`}>
                {/* Platform header row */}
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${platform.badgeBg} ${platform.badgeText}`}>
                      {platform.label}
                    </span>
                    {release && (
                      <span className="text-gray-400 text-sm">Current Release</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAddRelease(platform.key)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors text-sm font-medium"
                    >
                      <Plus size={16} /> Add Release
                    </button>
                    <button
                      onClick={() => openHistory(platform.key)}
                      className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <History size={16} /> History
                    </button>
                  </div>
                </div>

                {/* Release details */}
                {release ? (
                  <div className="px-6 pb-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Release Version</p>
                      <p className="text-lg font-semibold font-mono text-gray-900">{release.version}</p>
                      {release.buildNumber && <p className="text-xs text-gray-400 mt-0.5">Build {release.buildNumber}</p>}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Force Update</p>
                      {release.forceUpdate ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 rounded-full bg-red-500" /> Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 rounded-full bg-green-500" /> Disabled
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Release Date</p>
                      <p className="text-sm font-medium text-gray-900">{release.releasedAt ? new Date(release.releasedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">App Store URL</p>
                      {release.downloadUrl ? (
                        <a href={release.downloadUrl} target="_blank" rel="noreferrer" className="text-sm text-[#5C90E6] hover:underline flex items-center gap-1 font-medium">
                          Open Store <ExternalLink size={14} />
                        </a>
                      ) : (
                        <p className="text-sm text-gray-400">Not set</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-400">No releases yet. Click "Add Release" to create the first one.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ReleaseFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={handleFormSuccess} item={editingItem} defaultPlatform={formPlatform} />
    </div>
  );
}
