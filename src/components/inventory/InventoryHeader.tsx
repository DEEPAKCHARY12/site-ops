import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Plus, MapPin, ChevronDown } from 'lucide-react';
import { inventoryApi, projectApi, notificationApi } from '../../utils/api';

interface InventoryHeaderProps {
  onMaterialAdded: () => void;
  onSearch: (query: string) => void;
}

export default function InventoryHeader({ onMaterialAdded, onSearch }: InventoryHeaderProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Fetch projects and notifications
    const init = async () => {
      try {
        const [projectsRes, notificationsRes] = await Promise.all([
          projectApi.getProjects(),
          notificationApi.getNotifications()
        ]);
        setProjects(projectsRes.data);
        if (projectsRes.data.length > 0) setCurrentProject(projectsRes.data[0]);
        setNotifications(notificationsRes.data);
      } catch (error) {
        console.error("Error initializing header data:", error);
      }
    };
    init();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      onSearch(value);
    }, 500); // 500ms debounce
  };

  const handleAddNew = async () => {
    const name = prompt("Enter Material Name:");
    if (!name) return;
    const category = prompt("Enter Category (Structural Steel, Concrete, Lumber, Electrical, Plumbing, Fasteners, Safety Gear):");
    if (!category) return;
    const code = prompt("Enter Material Code:");
    if (!code) return;
    const quantity = parseInt(prompt("Enter Initial Quantity:") || "0");
    const unit = prompt("Enter Unit (e.g., kg, Bags):") || "units";
    const threshold = parseInt(prompt("Enter Min Threshold:") || "0");

    try {
      await inventoryApi.createMaterial({
        name,
        code,
        category,
        quantity,
        unit,
        threshold,
        po: "NEW-PO",
        last_receipt: new Date().toLocaleDateString()
      });
      onMaterialAdded();
      alert("Material added successfully!");
    } catch (error: any) {
      alert("Error adding material: " + (error.response?.data?.detail || error.message));
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">Material Inventory</h2>
        <div className="h-4 w-px bg-slate-300"></div>
        <div className="relative">
          <button
            onClick={() => setShowProjectSelector(!showProjectSelector)}
            className="flex items-center gap-2 text-slate-500 text-sm hover:text-primary transition-colors font-medium"
          >
            <MapPin size={16} />
            <span>Project: {currentProject?.name || 'Loading...'}</span>
            <ChevronDown size={14} />
          </button>

          {showProjectSelector && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase p-2 tracking-widest">Select Project</div>
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setCurrentProject(p); setShowProjectSelector(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${currentProject?.id === p.id ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
                >
                  {p.name}
                  <p className="text-[10px] opacity-70 font-normal">{p.location}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 bg-background-light border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-64 outline-none transition-all"
            placeholder="Search POs, codes, materials..."
            type="text"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex items-center justify-center p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <span className="font-bold text-sm">Notifications</span>
                <span className="text-[10px] text-primary font-bold uppercase cursor-pointer hover:underline">Mark all as read</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!n.is_read ? 'bg-blue-50/30' : ''}`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${n.type === 'critical' ? 'text-red-500' : n.type === 'warning' ? 'text-amber-500' : 'text-primary'}`}>
                          {n.type}
                        </span>
                        <span className="text-[9px] text-slate-400">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900">{n.title}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 text-center bg-slate-50">
                <button className="text-[10px] font-bold text-slate-500 hover:text-primary transition-colors">See all alerts</button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleAddNew}
          className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <Plus size={20} />
          New Material
        </button>
      </div>
    </header>
  );
}
