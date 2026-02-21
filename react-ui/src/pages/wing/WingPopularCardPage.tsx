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

function PopularDisplayFormModal({
  isOpen, onClose, onSuccess, item,
}: {
  isOpen: boolean; onClose: () => void; onSuccess: () => void; item?: WingService | null;
}) {
  const [popularSortOrder, setPopularSortOrder] = useState(0);
  const [popularEmoji, setPopularEmoji] = useState('');
  const [popularBgColor, setPopularBgColor] = useState('');
  const [popularBorderColor, setPopularBorderColor] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setPopularSortOrder(item.popularSortOrder ?? 0);
      setPopularEmoji(item.popularEmoji || '');
      setPopularBgColor(item.popularBgColor || '');
      setPopularBorderColor(item.popularBorderColor || '');
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
        popularSortOrder,
        popularEmoji,
        popularBgColor,
        popularBorderColor,
        newSortOrder: item.newSortOrder,
        newBgColor: item.newBgColor || undefined,
        newBorderColor: item.newBorderColor || undefined,
        newBadge: item.newBadge || undefined,
        translations: item.translations as Record<string, { title: string; description: string }>,
      };
      await wingServicesApi.update(item.id, req);
      toast.success('Display config updated');
      onSuccess(); onClose();
    } catch { /**/ } finally { setLoading(false); }
  };

  const partnerName = item?.translations?.en?.title || item?.translations?.km?.title || '—';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Popular Display Config">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-0.5">Partner</p>
          <p className="font-medium text-gray-800">{partnerName}</p>
        </div>
        <InputField label="Sort Order" type="number" value={String(popularSortOrder)} onChange={(e) => setPopularSortOrder(Number(e.target.value))} />
        <InputField label="Emoji" value={popularEmoji} onChange={(e) => setPopularEmoji(e.target.value)} placeholder="💳" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <InputField label="BG Color" value={popularBgColor} onChange={(e) => setPopularBgColor(e.target.value)} placeholder="#f0f4ff" />
            {popularBgColor && <div className="mt-1 h-4 rounded border border-gray-200" style={{ background: popularBgColor }} />}
          </div>
          <div>
            <InputField label="Border Color" value={popularBorderColor} onChange={(e) => setPopularBorderColor(e.target.value)} placeholder="#c7d7f8" />
            {popularBorderColor && <div className="mt-1 h-4 rounded border-2" style={{ borderColor: popularBorderColor }} />}
          </div>
        </div>
        {(popularBgColor || popularBorderColor || popularEmoji) && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1.5">Preview</p>
            <div className="w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl"
              style={{ background: popularBgColor || '#f0f4ff', borderColor: popularBorderColor || '#c7d7f8' }}>
              {popularEmoji || '?'}
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

export function WingPopularCardPage() {
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
      const res = await wingServicesApi.getAll({ page, size, search: searchQuery, isPopular: true });
      setData(res.data.data);
    } catch { /**/ } finally { setLoading(false); }
  }, [page, size, searchQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<WingService>[] = [
    { key: 'index', header: '#', width: '60px', render: (_, i) => <span className="text-gray-500">{i + 1}</span> },
    {
      key: 'preview', header: 'PREVIEW', width: '90px', render: (s) => (
        <div className="w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg"
          style={{ background: s.popularBgColor || '#f0f4ff', borderColor: s.popularBorderColor || '#c7d7f8' }}>
          {s.popularEmoji || (s.icon?.startsWith('http') ? <img src={s.icon} alt="" className="w-6 h-6 object-contain" /> : (s.icon || '?'))}
        </div>
      )
    },
    { key: 'name', header: 'PARTNER NAME', render: (s) => <span className="font-medium">{s.translations?.en?.title || '—'}</span> },
    { key: 'popularSortOrder', header: 'POPULAR ORDER', width: '130px', render: (s) => s.popularSortOrder },
    {
      key: 'colors', header: 'COLORS', render: (s) => (
        <div className="flex gap-3 items-center">
          {s.popularBgColor && (
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded border border-gray-300" title={`BG: ${s.popularBgColor}`} style={{ background: s.popularBgColor }} />
              <span className="text-xs text-gray-500">{s.popularBgColor}</span>
            </div>
          )}
          {s.popularBorderColor && (
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded border-2" title={`Border: ${s.popularBorderColor}`} style={{ borderColor: s.popularBorderColor }} />
              <span className="text-xs text-gray-500">{s.popularBorderColor}</span>
            </div>
          )}
        </div>
      )
    },
    { key: 'status', header: 'STATUS', render: (s) => <StatusBadge status={s.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Wing+ Popular Partners" subtitle="Partners tagged as Popular — configure display style" />
      <div className="mb-4 p-3 bg-[#EBF3FE] border border-[#5C90E6]/20 rounded-lg text-sm text-[#3a6abf]">
        Partners appear here when marked as <strong>Popular Partner</strong> in the Partners page. Edit display config (emoji, colors, order) here.
      </div>
      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        onSearch={() => { setSearchQuery(search); setPage(0); }}
        onReset={() => { setSearch(''); setSearchQuery(''); setPage(0); }}
        placeholder="Search popular partners..."
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
      <PopularDisplayFormModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSuccess={fetchData}
        item={editingItem}
      />
    </div>
  );
}
