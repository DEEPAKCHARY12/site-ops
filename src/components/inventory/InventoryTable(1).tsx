import { ChevronLeft, ChevronRight, Download, Plus, Minus } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  code: string;
  quantity: number;
  unit: string;
  threshold: number;
  status: string;
  po: string;
  lastReceipt: string;
}

interface InventoryTableProps {
  items: InventoryItem[];
}

export default function InventoryTable({ items }: InventoryTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Filter by:</span>
          <select className="text-xs bg-slate-50 border-slate-200 rounded-lg py-1 px-3 outline-none">
            <option>All Materials</option>
            <option>Structural Steel</option>
            <option>Concrete</option>
            <option>Lumber</option>
          </select>
          <select className="text-xs bg-slate-50 border-slate-200 rounded-lg py-1 px-3 outline-none">
            <option>Status: All</option>
            <option>Status: Low Stock</option>
            <option>Status: In Stock</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Showing 1-10 of 42 items</span>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-slate-100 rounded"><ChevronLeft size={16} /></button>
            <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Material Name</th>
              <th className="px-6 py-4 text-right">Current Qty</th>
              <th className="px-6 py-4">Unit</th>
              <th className="px-6 py-4 text-right">Min Threshold</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Recent PO</th>
              <th className="px-6 py-4">Last Receipt</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {items.map((item) => (
              <tr key={item.id} className={item.status === 'low' ? 'bg-red-50 border-l-4 border-l-red-500' : ''}>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="text-[10px] text-slate-500">{item.code}</div>
                </td>
                <td className={`px-6 py-4 text-right font-bold ${item.status === 'low' ? 'text-red-600' : ''}`}>
                  {item.quantity.toLocaleString()}
                </td>
                <td className="px-6 py-4 font-medium">{item.unit}</td>
                <td className="px-6 py-4 text-right">{item.threshold.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    item.status === 'low' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    <span className={`size-1.5 rounded-full ${item.status === 'low' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                    {item.status === 'low' ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-primary hover:underline cursor-pointer">{item.po}</td>
                <td className="px-6 py-4 text-slate-500">{item.lastReceipt}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="size-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-primary hover:bg-primary hover:text-white transition-colors">
                      <Plus size={16} />
                    </button>
                    <button className="size-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                      <Minus size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
        <button className="text-sm font-bold text-slate-500 hover:text-slate-700 flex items-center gap-2">
          <Download size={16} />
          Export Inventory Report
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button className="size-8 rounded border border-slate-200 bg-white flex items-center justify-center"><ChevronLeft size={16} /></button>
            <button className="size-8 rounded bg-primary text-white flex items-center justify-center font-bold text-xs">1</button>
            <button className="size-8 rounded border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-xs font-bold">2</button>
            <button className="size-8 rounded border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-xs font-bold">3</button>
            <button className="size-8 rounded border border-slate-200 bg-white flex items-center justify-center"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
