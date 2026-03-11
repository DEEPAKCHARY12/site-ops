import { ChevronLeft, ChevronRight, Download, Plus, Minus, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useInteractionTracking } from '../../hooks/useInteractionTracking';
import { inventoryApi } from '../../utils/api';

interface InventoryItem {
  id: number;
  name: string;
  code: string;
  category: string;
  quantity: number;
  unit: string;
  threshold: number;
  po: string;
  last_receipt: string;
}

interface InventoryTableProps {
  items: InventoryItem[];
  onUpdate: () => void;
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onFilterChange: (category: string, status: string) => void;
  onSortChange: (column: string, order: string) => void;
  currentSort: { column: string, order: string };
}

export default function InventoryTable({
  items,
  onUpdate,
  total,
  page,
  limit,
  onPageChange,
  onFilterChange,
  onSortChange,
  currentSort
}: InventoryTableProps) {
  const { trackInteraction } = useInteractionTracking();

  const handleAdjust = async (id: number, adjustment: number, name: string) => {
    try {
      await inventoryApi.adjustQuantity(id, adjustment);
      trackInteraction(`${adjustment > 0 ? 'add' : 'minus'}-button-${id}`, 'click', { itemName: name, adjustment });
      onUpdate();
    } catch (error) {
      console.error("Error adjusting quantity:", error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await inventoryApi.exportCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      trackInteraction('export-report', 'click');
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const toggleSort = (column: string) => {
    const newOrder = currentSort.column === column && currentSort.order === 'asc' ? 'desc' : 'asc';
    onSortChange(column, newOrder);
    trackInteraction(`sort-${column}`, 'click', { order: newOrder });
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (currentSort.column !== column) return <ArrowUpDown size={14} className="opacity-30" />;
    return currentSort.order === 'asc' ? <ArrowUp size={14} className="text-primary" /> : <ArrowDown size={14} className="text-primary" />;
  };

  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, total);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Filter by:</span>
          <select
            className="text-xs bg-slate-50 border-slate-200 rounded-lg py-1.5 px-3 outline-none focus:ring-1 focus:ring-primary transition-all font-medium"
            onChange={(e) => onFilterChange(e.target.value, "Status: All")}
          >
            <option>All Materials</option>
            <option>Structural Steel</option>
            <option>Concrete</option>
            <option>Lumber</option>
            <option>Electrical</option>
            <option>Plumbing</option>
            <option>Fasteners</option>
            <option>Safety Gear</option>
          </select>
          <select
            className="text-xs bg-slate-50 border-slate-200 rounded-lg py-1.5 px-3 outline-none focus:ring-1 focus:ring-primary transition-all font-medium"
            onChange={(e) => onFilterChange("All Materials", e.target.value)}
          >
            <option>Status: All</option>
            <option>Status: Low Stock</option>
            <option>Status: In Stock</option>
          </select>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span>Showing <span className="text-slate-900 font-bold">{startIdx}-{endIdx}</span> of <span className="text-slate-900 font-bold">{total}</span> items</span>
          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="p-1.5 hover:bg-slate-100 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors border border-slate-200"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={endIdx >= total}
              onClick={() => onPageChange(page + 1)}
              className="p-1.5 hover:bg-slate-100 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors border border-slate-200"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-2">
                  Material Name <SortIcon column="name" />
                </div>
              </th>
              <th className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100 transition-colors group" onClick={() => toggleSort('quantity')}>
                <div className="flex items-center justify-end gap-2">
                  Current Qty <SortIcon column="quantity" />
                </div>
              </th>
              <th className="px-6 py-4">Unit</th>
              <th className="px-6 py-4 text-right">Min Threshold</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Recent PO</th>
              <th className="px-6 py-4">Last Receipt</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {items.map((item) => {
              const isLow = item.quantity < item.threshold;
              return (
                <tr key={item.id} className={`${isLow ? 'bg-red-50/50' : 'hover:bg-slate-50/50'} transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2">
                      <span className="font-bold uppercase tracking-tighter bg-slate-100 px-1 rounded">{item.category}</span>
                      <span>{item.code}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${isLow ? 'text-red-600' : 'text-slate-700'}`}>
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">{item.unit}</td>
                  <td className="px-6 py-4 text-right text-slate-500 font-mono">{item.threshold.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm ${isLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                      <span className={`size-1.5 rounded-full ${isLow ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                      {isLow ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => alert(`Opening PO Details for ${item.po}...`)}
                      className="font-bold text-primary hover:underline underline-offset-4 decoration-2"
                    >
                      {item.po}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{item.last_receipt}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        title="Increase Quantity"
                        className="size-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm active:scale-90"
                        onClick={() => handleAdjust(item.id, 1, item.name)}
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        title="Decrease Quantity"
                        className="size-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm active:scale-90"
                        onClick={() => handleAdjust(item.id, -1, item.name)}
                      >
                        <Minus size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center gap-6">
        <button
          className="text-sm font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm active:scale-95"
          onClick={handleExport}
        >
          <Download size={18} />
          Export Inventory Report
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className="size-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-30"
              disabled={page === 1}
            >
              <ChevronLeft size={18} />
            </button>

            {[...Array(Math.min(5, Math.ceil(total / limit)))].map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`size-9 rounded-xl font-black text-xs transition-all shadow-sm ${page === p ? 'bg-primary text-white scale-110' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(Math.min(Math.ceil(total / limit), page + 1))}
              className="size-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-30"
              disabled={endIdx >= total}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
