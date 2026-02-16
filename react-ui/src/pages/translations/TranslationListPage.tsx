import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { translationsApi } from '../../api/translations.api';
import { messagesApi } from '../../api/messages.api';
import { notificationsApi } from '../../api/notifications.api';
import { Translation } from '../../types/translation.types';
import { ApiMessageItem } from '../../types/message.types';
import { NotificationTemplate } from '../../types/notification.types';
import { PagedResponse } from '../../types/api.types';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchFilter } from '../../components/common/SearchFilter';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { TranslationFormModal } from './TranslationFormModal';
import { MessageFormModal } from '../messages/MessageFormModal';
import { NotificationFormModal } from '../notifications/NotificationFormModal';
import toast from 'react-hot-toast';

type TabKey = 'localized' | 'api_messages' | 'notifications';

const typeColors: Record<string, string> = {
  ERROR: 'bg-red-100 text-red-700',
  SUCCESS: 'bg-green-100 text-green-700',
  INFO: 'bg-blue-100 text-blue-700',
  WARNING: 'bg-yellow-100 text-yellow-700',
};

const notifTypeColors: Record<string, string> = {
  PUSH: 'bg-purple-100 text-purple-700',
  SMS: 'bg-teal-100 text-teal-700',
  EMAIL: 'bg-orange-100 text-orange-700',
};

const validTabs: TabKey[] = ['localized', 'api_messages', 'notifications'];

export function TranslationListPage() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabKey | null;
  const activeTab: TabKey = tabParam && validTabs.includes(tabParam) ? tabParam : 'localized';

  // Localized strings state
  const [transData, setTransData] = useState<PagedResponse<Translation>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [transLoading, setTransLoading] = useState(true);
  const [transPage, setTransPage] = useState(0);
  const [transSize, setTransSize] = useState(10);
  const [transSearch, setTransSearch] = useState('');
  const [transSearchQuery, setTransSearchQuery] = useState('');
  const [showTransForm, setShowTransForm] = useState(false);
  const [editingTrans, setEditingTrans] = useState<Translation | null>(null);
  const [deleteTransTarget, setDeleteTransTarget] = useState<Translation | null>(null);
  const [deletingTrans, setDeletingTrans] = useState(false);

  // API Messages state
  const [msgData, setMsgData] = useState<PagedResponse<ApiMessageItem>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [msgLoading, setMsgLoading] = useState(true);
  const [msgPage, setMsgPage] = useState(0);
  const [msgSize, setMsgSize] = useState(10);
  const [msgSearch, setMsgSearch] = useState('');
  const [msgSearchQuery, setMsgSearchQuery] = useState('');
  const [showMsgForm, setShowMsgForm] = useState(false);
  const [editingMsg, setEditingMsg] = useState<ApiMessageItem | null>(null);
  const [deleteMsgTarget, setDeleteMsgTarget] = useState<ApiMessageItem | null>(null);
  const [deletingMsg, setDeletingMsg] = useState(false);

  // Notifications state
  const [notifData, setNotifData] = useState<PagedResponse<NotificationTemplate>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifPage, setNotifPage] = useState(0);
  const [notifSize, setNotifSize] = useState(10);
  const [notifSearch, setNotifSearch] = useState('');
  const [notifSearchQuery, setNotifSearchQuery] = useState('');
  const [showNotifForm, setShowNotifForm] = useState(false);
  const [editingNotif, setEditingNotif] = useState<NotificationTemplate | null>(null);
  const [deleteNotifTarget, setDeleteNotifTarget] = useState<NotificationTemplate | null>(null);
  const [deletingNotif, setDeletingNotif] = useState(false);

  // Fetch translations
  const fetchTransData = useCallback(async () => {
    setTransLoading(true);
    try { const res = await translationsApi.getAll({ page: transPage, size: transSize, search: transSearchQuery }); setTransData(res.data.data); }
    catch { /* */ } finally { setTransLoading(false); }
  }, [transPage, transSize, transSearchQuery]);

  // Fetch messages
  const fetchMsgData = useCallback(async () => {
    setMsgLoading(true);
    try { const res = await messagesApi.getAll({ page: msgPage, size: msgSize, search: msgSearchQuery }); setMsgData(res.data.data); }
    catch { /* */ } finally { setMsgLoading(false); }
  }, [msgPage, msgSize, msgSearchQuery]);

  // Fetch notifications
  const fetchNotifData = useCallback(async () => {
    setNotifLoading(true);
    try { const res = await notificationsApi.getAll({ page: notifPage, size: notifSize, search: notifSearchQuery }); setNotifData(res.data.data); }
    catch { /* */ } finally { setNotifLoading(false); }
  }, [notifPage, notifSize, notifSearchQuery]);

  useEffect(() => { if (activeTab === 'localized') fetchTransData(); }, [fetchTransData, activeTab]);
  useEffect(() => { if (activeTab === 'api_messages') fetchMsgData(); }, [fetchMsgData, activeTab]);
  useEffect(() => { if (activeTab === 'notifications') fetchNotifData(); }, [fetchNotifData, activeTab]);

  // Columns
  const transColumns: Column<Translation>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'key', header: 'KEY', render: (t) => <span className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">{t.key}</span> },
    { key: 'enValue', header: 'ENGLISH', render: (t) => <span className="truncate max-w-[200px] block">{t.enValue || '-'}</span> },
    { key: 'kmValue', header: 'KHMER', render: (t) => <span className="truncate max-w-[200px] block">{t.kmValue || '-'}</span> },
    { key: 'module', header: 'MODULE', render: (t) => t.module ? <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{t.module}</span> : '-' },
    { key: 'platform', header: 'PLATFORM', render: (t) => t.platform },
  ];

  const msgColumns: Column<ApiMessageItem>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'errorCode', header: 'CODE', render: (m) => <span className="font-mono text-sm font-medium">{m.errorCode}</span> },
    { key: 'enMessage', header: 'ENGLISH MESSAGE', render: (m) => <span className="truncate max-w-[250px] block">{m.enMessage}</span> },
    { key: 'kmMessage', header: 'KHMER MESSAGE', render: (m) => <span className="truncate max-w-[200px] block">{m.kmMessage || '-'}</span> },
    { key: 'type', header: 'TYPE', render: (m) => <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[m.type] || 'bg-gray-100'}`}>{m.type}</span> },
    { key: 'httpStatus', header: 'HTTP STATUS', render: (m) => m.httpStatus },
  ];

  const notifColumns: Column<NotificationTemplate>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    { key: 'code', header: 'CODE', render: (n) => <span className="font-mono text-sm font-medium">{n.code}</span> },
    { key: 'titleEn', header: 'TITLE (EN)', render: (n) => n.titleEn || '-' },
    { key: 'type', header: 'TYPE', render: (n) => <span className={`px-2 py-1 rounded text-xs font-medium ${notifTypeColors[n.type] || 'bg-gray-100'}`}>{n.type}</span> },
    { key: 'status', header: 'STATUS', render: (n) => <StatusBadge status={n.status} /> },
  ];

  const pageTitles: Record<TabKey, string> = { localized: 'Localized Strings', api_messages: 'API Responses', notifications: 'Notifications' };
  const addLabels: Record<TabKey, string> = { localized: 'Add Translation', api_messages: 'Add Message', notifications: 'Add Template' };

  const handleAdd = () => {
    if (activeTab === 'localized') { setEditingTrans(null); setShowTransForm(true); }
    else if (activeTab === 'api_messages') { setEditingMsg(null); setShowMsgForm(true); }
    else { setEditingNotif(null); setShowNotifForm(true); }
  };

  return (
    <div>
      <PageHeader
        title={pageTitles[activeTab]}
        action={
          <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] transition-colors">
            <Plus size={18} /> {addLabels[activeTab]}
          </button>
        }
      />

      {/* Localized Strings */}
      {activeTab === 'localized' && (
        <>
          <SearchFilter
            searchValue={transSearch} onSearchChange={setTransSearch}
            onSearch={() => { setTransSearchQuery(transSearch); setTransPage(0); }}
            onReset={() => { setTransSearch(''); setTransSearchQuery(''); setTransPage(0); }}
            placeholder="Search translations..."
          />
          <DataTable
            columns={transColumns} data={transData.content} loading={transLoading}
            page={transData.page} size={transData.size} totalElements={transData.totalElements} totalPages={transData.totalPages}
            onPageChange={setTransPage} onSizeChange={(s) => { setTransSize(s); setTransPage(0); }}
            onEdit={(t) => { setEditingTrans(t); setShowTransForm(true); }} onDelete={setDeleteTransTarget} rowKey={(t) => t.id}
          />
          <TranslationFormModal isOpen={showTransForm} onClose={() => setShowTransForm(false)} onSuccess={fetchTransData} item={editingTrans} />
          <ConfirmDialog
            isOpen={!!deleteTransTarget} onClose={() => setDeleteTransTarget(null)} loading={deletingTrans}
            onConfirm={async () => { setDeletingTrans(true); try { await translationsApi.delete(deleteTransTarget!.id); toast.success('Deleted'); setDeleteTransTarget(null); fetchTransData(); } catch {} finally { setDeletingTrans(false); } }}
          />
        </>
      )}

      {/* API Messages Tab */}
      {activeTab === 'api_messages' && (
        <>
          <SearchFilter
            searchValue={msgSearch} onSearchChange={setMsgSearch}
            onSearch={() => { setMsgSearchQuery(msgSearch); setMsgPage(0); }}
            onReset={() => { setMsgSearch(''); setMsgSearchQuery(''); setMsgPage(0); }}
            placeholder="Search messages..."
          />
          <DataTable
            columns={msgColumns} data={msgData.content} loading={msgLoading}
            page={msgData.page} size={msgData.size} totalElements={msgData.totalElements} totalPages={msgData.totalPages}
            onPageChange={setMsgPage} onSizeChange={(s) => { setMsgSize(s); setMsgPage(0); }}
            onEdit={(m) => { setEditingMsg(m); setShowMsgForm(true); }} onDelete={setDeleteMsgTarget} rowKey={(m) => m.id}
          />
          <MessageFormModal isOpen={showMsgForm} onClose={() => setShowMsgForm(false)} onSuccess={fetchMsgData} item={editingMsg} />
          <ConfirmDialog
            isOpen={!!deleteMsgTarget} onClose={() => setDeleteMsgTarget(null)} loading={deletingMsg}
            onConfirm={async () => { setDeletingMsg(true); try { await messagesApi.delete(deleteMsgTarget!.id); toast.success('Deleted'); setDeleteMsgTarget(null); fetchMsgData(); } catch {} finally { setDeletingMsg(false); } }}
          />
        </>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <>
          <SearchFilter
            searchValue={notifSearch} onSearchChange={setNotifSearch}
            onSearch={() => { setNotifSearchQuery(notifSearch); setNotifPage(0); }}
            onReset={() => { setNotifSearch(''); setNotifSearchQuery(''); setNotifPage(0); }}
            placeholder="Search templates..."
          />
          <DataTable
            columns={notifColumns} data={notifData.content} loading={notifLoading}
            page={notifData.page} size={notifData.size} totalElements={notifData.totalElements} totalPages={notifData.totalPages}
            onPageChange={setNotifPage} onSizeChange={(s) => { setNotifSize(s); setNotifPage(0); }}
            onEdit={(n) => { setEditingNotif(n); setShowNotifForm(true); }} onDelete={setDeleteNotifTarget} rowKey={(n) => n.id}
          />
          <NotificationFormModal isOpen={showNotifForm} onClose={() => setShowNotifForm(false)} onSuccess={fetchNotifData} item={editingNotif} />
          <ConfirmDialog
            isOpen={!!deleteNotifTarget} onClose={() => setDeleteNotifTarget(null)} loading={deletingNotif}
            onConfirm={async () => { setDeletingNotif(true); try { await notificationsApi.delete(deleteNotifTarget!.id); toast.success('Deleted'); setDeleteNotifTarget(null); fetchNotifData(); } catch {} finally { setDeletingNotif(false); } }}
          />
        </>
      )}
    </div>
  );
}
