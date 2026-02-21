import { useState, useEffect, useCallback, FormEvent } from 'react';
import { wingServicesApi } from '../../api/wingServices.api';
import { WingService, WingServiceRequest } from '../../types/wing.types';
import { PagedResponse } from '../../types/api.types';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchFilter } from '../../components/common/SearchFilter';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { InputField } from '../../components/forms/InputField';
import toast from 'react-hot-toast';

function NewDisplayFormModal({
  isOpen, onClose, onSuccess, item,
}: {
  isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: WingService | null;
}) {
  const [newSortOrder, setNewSortOrder] = useState(0);
  const [newBgColor, setNewBgColor] = useState('');
  const [newBorderColor, setNewBorderColor] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setNewSortOrder(item.newSortOrder ?? 0);
      setNewBgColor(item.newBgColor || '');
      setNewBorderColor(item.newBorderColor || '');
      setNewBadge(item.newBadge || '');
    }
  }, [item, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setLoading(true);
    try {
      const req: WingServiceRequest = {
        icon: item.icon || undefined,
        imageUrl: item.imageUrl || undefined,
        isPopular: item.isPopular,
        isNew: item.isNew,
        sortOrder: item.sortOrder,
        status: item.status,
        popularSortOrder: item.popularSortOrder,
        popularEmoji: item.popularEmoji || undefined,
        popularBgColor: item.popularBgColor || undefined,
        popularBorderColor: item.popularBorderColor || undefined,
        newSortOrder,
        newBgColor,
        newBorderColor,
        newBadge,
        translations: item.translations as Record<string, { title: string; description: string }>,
      };
      await wingServicesApi.update(item.id, req);
      toast.success('Display config updated');
      onSuccess(); onClose();
    } catch { /**/ } finally { setLoading(false); }
  };

  const partnerName = item?.translations?.en?.title || item?.translations?.km?.title || '—';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit New Partner Display Config">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-0.5">Partner</p>
          <p className="font-medium text-gray-800">{partnerName}</p>
        </div>
        <InputField label="Sort Order" type="number" value={String(newSortOrder)} onChange={(e) => setNewSortOrder(Number(e.target.value))} />
        <InputField label="Badge Text" value={newBadge} onChange={(e) => setNewBadge(e.target.value)} placeholder="e.g. 0%" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <InputField label="BG Color" value={newBgColor} onChange={(e) => setNewBgColor(e.target.value)} placeholder="#f0f4ff" />
            {newBgColor && <div className="mt-1 h-4 rounded border border-gray-200" style={{ background: newBgColor }} />}
          </div>
          <div>
            <InputField label="Border Color" value={newBorderColor} onChange={(e) => setNewBorderColor(e.target.value)} placeholder="#c7d7f8" />
            {newBorderColor && <div className="mt-1 h-4 rounded border-2" style={{ borderColor: newBorderColor }} />}
          </div>
        </div>
        {(newBgColor || newBorderColor || newBadge || item?.icon) && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1.5">Preview</p>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl border-2 flex items-center justify-center overflow-hidden"
                style={{ background: newBgColor || '#f0f4ff', borderColor: newBorderColor || '#c7d7f8' }}>
                {item?.icon?.startsWith('http')
                  ? <img src={item.icon} alt="" className="w-8 h-8 object-contain" />
                  : <span className="text-xl">{item?.icon || '🏦'}</span>}
              </div>
              {newBadge && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{newBadge}</span>}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#5C90E6] text-white rounded-lg hover:bg-[#4A7DD4] disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}

export function WingPartnerPage() {
  const [data, setData] = useState<PagedResponse<WingService>>({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<WingService | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await wingServicesApi.getAll({ page, size, search: searchQuery, isNew: true });
      setData(res.data.data);
    } catch { /**/ } finally { setLoading(false); }
  }, [page, size, searchQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<WingService>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    {
      key: 'icon', header: 'ICON', width: '90px', render: (s) => (
        <div className="w-10 h-10 rounded-lg border-2 flex items-center justify-center overflow-hidden"
          style={{ background: s.newBgColor || '#f0f4ff', borderColor: s.newBorderColor || '#c7d7f8' }}>
          {s.icon?.startsWith('http')
            ? <img src={s.icon} alt="" className="w-7 h-7 object-contain" />
            : <span className="text-lg">{s.icon || '🏦'}</span>}
        </div>
      )
    },
    { key: 'name', header: 'PARTNER NAME', render: (s) => <span className="font-medium">{s.translations?.en?.title || '—'}</span> },
    { key: 'newSortOrder', header: 'NEW ORDER', width: '110px', render: (s) => s.newSortOrder },
    { key: 'badge', header: 'BADGE', width: '90px', render: (s) => s.newBadge ? <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">{s.newBadge}</span> : '—' },
    {
      key: 'colors', header: 'COLORS', render: (s) => (
        <div className="flex gap-3 items-center">
          {s.newBgColor && (
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded border border-gray-300" title={`BG: ${s.newBgColor}`} style={{ background: s.newBgColor }} />
              <span className="text-xs text-gray-500">{s.newBgColor}</span>
            </div>
          )}
          {s.newBorderColor && (
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded border-2" title={`Border: ${s.newBorderColor}`} style={{ borderColor: s.newBorderColor }} />
              <span className="text-xs text-gray-500">{s.newBorderColor}</span>
            </div>
          )}
        </div>
      )
    },
    { key: 'status', header: 'STATUS', render: (s) => <StatusBadge status={s.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Wing+ New Partners" subtitle="Partners tagged as New — configure display style" />
      <div className="mb-4 p-3 bg-[#EBF3FE] border border-[#5C90E6]/20 rounded-lg text-sm text-[#3a6abf]">
        Partners appear here when marked as <strong>New Partner</strong> in the Partners page. Edit display config (colors, badge, order) here.
      </div>
      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        onSearch={() => { setSearchQuery(search); setPage(0); }}
        onReset={() => { setSearch(''); setSearchQuery(''); setPage(0); }}
        placeholder="Search new partners..."
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
        onEdit={(s) => setEditingItem(s)}
        rowKey={(s) => s.id}
      />
      <NewDisplayFormModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSuccess={fetchData}
        item={editingItem}
      />
    </div>
  );
}
