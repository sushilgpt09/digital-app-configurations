import { Construction } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

export function BakongSenderConfigPage() {
  return (
    <div>
      <PageHeader title="Sender Config" />
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Construction size={64} className="mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Under Construction</h2>
        <p className="text-sm">This page is currently being developed. Please check back later.</p>
      </div>
    </div>
  );
}
