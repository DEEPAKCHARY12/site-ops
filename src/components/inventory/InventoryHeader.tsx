import { Search, Bell, Plus, MapPin } from 'lucide-react';

export default function InventoryHeader() {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">Material Inventory</h2>
        <div className="h-4 w-px bg-slate-300"></div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <MapPin size={16} />
          <span>Project: Central Plaza Phase II</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            className="pl-10 pr-4 py-2 bg-background-light border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-64 outline-none" 
            placeholder="Search POs, batches..." 
            type="text"
          />
        </div>
        <button className="flex items-center justify-center p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm">
          <Plus size={20} />
          New Material
        </button>
      </div>
    </header>
  );
}
