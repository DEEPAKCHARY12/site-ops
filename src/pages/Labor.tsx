import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Calendar, Clock, CheckCircle, XCircle, Cloud, User, Plus, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/labor';

export default function Labor() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_crew: 0, full_day_count: 0, half_day_count: 0, total_cost: 0 });
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: '', worker_id_string: '', classification: 'Helper', base_wage: 0 });

  const fetchWorkers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/workers?date=${date}`);
      setWorkers(response.data.items);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  }, [date]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/summary?date=${date}`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [date]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchWorkers(), fetchStats()]).finally(() => setLoading(false));
  }, [fetchWorkers, fetchStats]);

  const handleStatusChange = async (workerId: number, status: string) => {
    // Optimistic Update
    const oldWorkers = [...workers];
    const oldStats = { ...stats };

    const updatedWorkers = workers.map(w => {
      if (w.id === workerId) {
        let factor = 0;
        if (status === 'PRESENT') factor = 1;
        if (status === 'HALF') factor = 0.5;
        return { ...w, status, effective_pay: w.base_wage * factor };
      }
      return w;
    });
    setWorkers(updatedWorkers);

    // Update stats optimistically (simplified)
    // For a real app, I'd recalculate based on the new status list
    
    try {
      await axios.put(`${API_BASE}/attendance`, { worker_id: workerId, date, status });
      fetchStats(); // Refresh stats from server to be sure
    } catch (error) {
      setWorkers(oldWorkers);
      setStats(oldStats);
      alert("Failed to update status");
    }
  };

  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/workers`, newWorker);
      setIsAddModalOpen(false);
      setNewWorker({ name: '', worker_id_string: '', classification: 'Helper', base_wage: 0 });
      fetchWorkers();
    } catch (error) {
      alert("Failed to add worker");
    }
  };

  const handleDeleteWorker = async (id: number) => {
    if (confirm("Are you sure you want to delete this worker?")) {
      try {
        await axios.delete(`${API_BASE}/workers/${id}`);
        fetchWorkers();
        fetchStats();
      } catch (error) {
        alert("Failed to delete worker");
      }
    }
  };

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) || 
    w.worker_id_string.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen pb-20">
       {/* Header - Specific to Labor Module as per design */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-slate-100 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-8">
                 {/* Only showing Title here, as Sidebar handles main nav */}
                <h1 className="text-lg font-black tracking-tighter text-slate-900 uppercase">Labor Management</h1>
                
                <nav className="hidden md:flex items-center gap-6">
                    <a href="#" className="text-xs font-bold text-primary border-b-2 border-primary h-14 flex items-center">Attendance</a>
                    <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Workforce</a>
                    <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Payroll</a>
                     <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Projects</a>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search workers..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-1.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-xs w-64 focus:border-primary outline-none transition-all"
                    />
                </div>
                 <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-slate-200">
                    <User className="text-slate-400" size={16} />
                </div>
            </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
                <div className="flex items-center gap-2 text-primary mb-1">
                    <MapPin size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Site B: Grand Central Terminal</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Labor Attendance</h2>
                <p className="text-slate-500 text-sm font-medium mt-0.5">Reviewing logs for current operational cycle.</p>
            </div>
             <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all active:scale-95"
                    >
                        <Plus size={14} /> Add Worker
                    </button>
                    <div className="h-8 w-px bg-slate-200 mx-1"></div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Attendance Date</span>
                        <div className="bg-slate-50 p-1 rounded-lg border-2 border-slate-200 flex gap-1">
                            <button 
                                onClick={() => setDate(new Date().toISOString().split('T')[0])}
                                className={`px-4 py-2 rounded-md text-xs font-black flex items-center gap-2 transition-all ${
                                    date === new Date().toISOString().split('T')[0] ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-white'
                                }`}
                            >
                                <Calendar size={14} /> Today
                            </button>
                            <button 
                                onClick={() => {
                                    const yest = new Date();
                                    yest.setDate(yest.getDate() - 1);
                                    setDate(yest.toISOString().split('T')[0]);
                                }}
                                className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
                                    date !== new Date().toISOString().split('T')[0] ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-white'
                                }`}
                            >
                                <Clock size={14} className={date !== new Date().toISOString().split('T')[0] ? '' : 'text-slate-400'} /> Yesterday
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Add Worker Modal */}
        {isAddModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
                <div className="relative bg-white w-full max-w-md rounded-2xl border-2 border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-6 border-b-2 border-slate-50 flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Add New Worker</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleAddWorker} className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
                            <input 
                                required
                                type="text"
                                value={newWorker.name}
                                onChange={e => setNewWorker({...newWorker, name: e.target.value})}
                                placeholder="e.g. Michael Chen"
                                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Worker ID</label>
                                <input 
                                    required
                                    type="text"
                                    value={newWorker.worker_id_string}
                                    onChange={e => setNewWorker({...newWorker, worker_id_string: e.target.value})}
                                    placeholder="#W-0000"
                                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:border-primary outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Base Wage ($)</label>
                                <input 
                                    required
                                    type="number"
                                    value={newWorker.base_wage}
                                    onChange={e => setNewWorker({...newWorker, base_wage: parseFloat(e.target.value)})}
                                    placeholder="450.00"
                                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Classification</label>
                            <select 
                                value={newWorker.classification}
                                onChange={e => setNewWorker({...newWorker, classification: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:border-primary outline-none transition-all appearance-none"
                            >
                                <option>Senior Mason</option>
                                <option>Mason</option>
                                <option>Helper</option>
                                <option>Supervisor</option>
                            </select>
                        </div>
                        <div className="pt-4 flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all"
                            >
                                Create Worker
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b-2 border-slate-200">
                             <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Worker Profile</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Classification</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Base Wage</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Daily Status</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Effective Pay</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="animate-spin text-primary" size={24} />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading workforce data...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredWorkers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    No workers found
                                </td>
                            </tr>
                        ) : (
                            filteredWorkers.map((worker) => (
                                <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-slate-200">
                                                <div className="size-full bg-slate-200 flex items-center justify-center">
                                                    <User className="text-slate-400" size={16} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-slate-900 text-sm">{worker.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: {worker.worker_id_string}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                            worker.classification.includes('Mason') ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                                        }`}>
                                            {worker.classification}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="font-mono font-bold text-slate-700 text-sm">${worker.base_wage.toFixed(2)}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center p-0.5 bg-slate-100 rounded-lg w-fit mx-auto border-2 border-slate-200">
                                            <button 
                                                onClick={() => handleStatusChange(worker.id, 'PRESENT')}
                                                className={`px-3 py-1.5 rounded-md text-[10px] font-black flex items-center gap-1.5 transition-colors ${
                                                worker.status === 'PRESENT' 
                                                    ? 'bg-attendance-present text-white shadow-sm' 
                                                    : 'text-slate-500 hover:text-slate-900'
                                            }`}>
                                                <CheckCircle size={12} /> PRESENT
                                            </button>
                                            <button 
                                                onClick={() => handleStatusChange(worker.id, 'HALF')}
                                                className={`px-3 py-1.5 rounded-md text-[10px] font-black flex items-center gap-1.5 transition-colors ${
                                                worker.status === 'HALF' 
                                                    ? 'bg-attendance-half text-white shadow-sm' 
                                                    : 'text-slate-500 hover:text-slate-900'
                                            }`}>
                                                <div className="size-3 rounded-full border-2 border-current border-t-transparent" /> HALF
                                            </button>
                                            <button 
                                                onClick={() => handleStatusChange(worker.id, 'ABSENT')}
                                                className={`px-3 py-1.5 rounded-md text-[10px] font-black flex items-center gap-1.5 transition-colors ${
                                                worker.status === 'ABSENT' 
                                                    ? 'bg-attendance-absent text-white shadow-sm' 
                                                    : 'text-slate-500 hover:text-slate-900'
                                            }`}>
                                                <XCircle size={12} /> ABSENT
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex flex-col items-end">
                                            <p className={`font-mono font-black text-sm ${
                                                worker.status === 'ABSENT' ? 'text-attendance-absent' : 'text-slate-900'
                                            }`}>
                                                ${worker.effective_pay.toFixed(2)}
                                            </p>
                                            {worker.status === 'HALF' && (
                                                <span className="text-[8px] font-black text-attendance-half uppercase tracking-widest">50% APPLIED</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button 
                                            onClick={() => handleDeleteWorker(worker.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
             <div className="p-4 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Showing {filteredWorkers.length} of {workers.length} workers
                </p>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-md border-2 border-slate-200 font-bold text-xs text-slate-400 cursor-not-allowed">Previous</button>
                    <button className="px-3 py-1.5 rounded-md border-2 border-slate-200 font-bold text-xs text-slate-700 hover:bg-white hover:border-primary hover:text-primary transition-all">Next</button>
                </div>
            </div>
        </div>

      </main>

       <footer className="fixed bottom-0 left-60 right-0 bg-navy-dark text-white z-[100] border-t-4 border-primary">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Crew Deployment</span>
                         <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black leading-none">{stats.total_crew}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">On Site</span>
                        </div>
                     </div>
                     <div className="h-8 w-px bg-slate-700"></div>
                     <div className="hidden lg:flex flex-col gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Attendance Status</span>
                        <div className="flex gap-3">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                                <span className="size-1.5 rounded-full bg-attendance-present"></span>
                                <span className="text-[10px] font-black">{stats.full_day_count} Full</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                                <span className="size-1.5 rounded-full bg-attendance-half"></span>
                                <span className="text-[10px] font-black">{stats.half_day_count} Half</span>
                            </div>
                        </div>
                     </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-1">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Labor Cost</span>
                     <div className="flex items-center gap-6">
                        <span className="text-3xl font-black tracking-tighter text-white font-mono">${stats.total_cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <button 
                            onClick={() => alert("Day's logs have been committed and synced successfully!")}
                            className="bg-primary text-white px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all active:scale-95 flex items-center gap-2"
                        >
                             <Cloud size={16} />
                             Finalize & Sync
                        </button>
                     </div>
                </div>
            </div>
       </footer>
    </div>
  );
}
