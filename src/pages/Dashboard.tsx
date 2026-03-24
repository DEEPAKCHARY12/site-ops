import { useState, useEffect, useCallback } from 'react';
import {
  Construction,
  Search,
  MapPin,
  History,
  Plus,
  Users,
  AlertTriangle,
  Calendar,
  ZoomIn,
  Maximize,
  Sun,
  Layers,
  CheckCircle,
  Loader2,
  X,
  Clock
} from 'lucide-react';
import axios from 'axios';
import data from '../data/data.json';

const API_BASE = 'http://localhost:8000/api/dashboard';

export default function Dashboard() {
  const [kpis, setKpis] = useState<any>(null);
  const [inventorySummary, setInventorySummary] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [syncHistory, setSyncHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const date = new Date().toISOString().split('T')[0];

  const fetchData = useCallback(async () => {
    try {
      const [kpiRes, invRes, timeRes] = await Promise.all([
        axios.get(`${API_BASE}/kpis?date=${date}`),
        axios.get(`${API_BASE}/inventory-summary`),
        axios.get(`${API_BASE}/timeline`)
      ]);
      setKpis(kpiRes.data);
      setInventorySummary(invRes.data);
      setTimeline(timeRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNewEntry = async () => {
    try {
      await axios.post(`${API_BASE}/daily-entry`);
      alert("New daily entry initialized successfully!");
    } catch (error) {
      alert("Failed to initialize new daily entry.");
    }
  };

  const fetchSyncHistory = async () => {
    try {
      const resp = await axios.get(`${API_BASE}/sync-history`);
      setSyncHistory(resp.data);
      setIsHistoryModalOpen(true);
    } catch (error) {
      alert("Failed to fetch sync history.");
    }
  };

  const handleFinalize = async () => {
    setSyncing(true);
    try {
      await axios.post(`${API_BASE}/finalize-day?date=${date}`);
      alert("Day finalized and synced successfully!");
      setIsFinalizeModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Failed to finalize day.");
    } finally {
      setSyncing(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                <Construction size={20} />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-navy-dark uppercase">SiteOps</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 h-16">
              <a href="#" className="text-primary border-b-2 border-primary h-full flex items-center px-1 text-sm font-semibold">Dashboard</a>
              <a href="/labor" className="text-slate-500 hover:text-navy-dark h-full flex items-center px-1 text-sm font-semibold transition-colors">Workforce</a>
              <a href="/inventory" className="text-slate-500 hover:text-navy-dark h-full flex items-center px-1 text-sm font-semibold transition-colors">Inventory</a>
              <a href="#" className="text-slate-500 hover:text-navy-dark h-full flex items-center px-1 text-sm font-semibold transition-colors">Projects</a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search projects or alerts..."
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-navy-dark">Admin User</p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Project Manager</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                <Users size={18} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <MapPin size={14} />
              <span className="text-xs font-bold uppercase tracking-widest">Site B: Grand Central Terminal</span>
            </div>
            <h1 className="text-4xl font-extrabold text-navy-dark tracking-tight">Executive Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1">Reviewing daily operational metrics and site progress.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchSyncHistory}
              className="bg-white border border-slate-200 px-6 py-2.5 rounded-lg flex items-center gap-2 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
            >
              <History size={18} />
              Sync History
            </button>
            <button 
              onClick={handleNewEntry}
              className="bg-primary text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95 transition-all"
            >
              <Plus size={18} />
              New Daily Entry
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Workers */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="text-primary" size={24} />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+12% vs last shift</span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Workers Present</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-extrabold text-navy-dark">{loading ? <Loader2 className="animate-spin text-slate-200" size={24} /> : kpis?.total_workers}</h3>
              <span className="text-slate-400 text-sm font-medium">Active</span>
            </div>
            <p className="text-xs text-slate-400 mt-4 border-t border-slate-50 pt-3">Tracking aggregate deployment across all zones.</p>
          </div>

          {/* Critical Stock */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-amber-900 bg-amber-50/10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${kpis?.critical_alerts > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {kpis?.critical_alerts > 0 ? 'Action Required' : 'Healthy'}
              </span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Critical Stock Alerts</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-extrabold text-navy-dark">{loading ? <Loader2 className="animate-spin text-slate-200" size={24} /> : kpis?.critical_alerts?.toString().padStart(2, '0')}</h3>
              <span className="text-slate-400 text-sm font-medium">Items Low</span>
            </div>
            <p className="text-xs text-slate-400 mt-4 border-t border-slate-50 pt-3">Immediate procurement suggested for low items.</p>
          </div>

          {/* Project Deadline */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Calendar className="text-amber-600" size={24} />
              </div>
              <div className="flex gap-1">
                <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden self-center">
                  <div className="h-full bg-primary" style={{ width: `65%` }}></div>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Project Deadline</p>
            <h3 className="text-2xl font-extrabold text-navy-dark uppercase tracking-tight">OCT 24, 2026</h3>
            <p className="text-xs text-slate-400 mt-4 border-t border-slate-50 pt-3">218 Days Remaining (65% Complete)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[540px]">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary" size={20} />
                  <h4 className="font-extrabold text-navy-dark tracking-tight">Site Overview: Phase II</h4>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                    <ZoomIn size={18} />
                  </button>
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 relative bg-slate-50">
                <div
                  className="absolute inset-0 opacity-60 bg-cover bg-center"
                  style={{ backgroundImage: `url('${data.siteOverview.image}')` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-primary/20 rounded-full animate-ping absolute -inset-4"></div>
                    <div className="w-8 h-8 bg-primary rounded-full border-4 border-white shadow-xl flex items-center justify-center relative z-10">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-100">
                      <p className="text-xs font-extrabold text-navy-dark">{data.siteOverview.craneName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{data.siteOverview.craneStatus}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6">
                  <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-md border border-slate-200 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                      <span className="text-[10px] font-bold text-navy-dark uppercase tracking-wide">Work Zone 1</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="text-[10px] font-bold text-navy-dark uppercase tracking-wide">Assembly Area</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                      <span className="text-[10px] font-bold text-navy-dark uppercase tracking-wide">Restricted Zone</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Environmental Conditions */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500 opacity-50"></div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Environmental Conditions</p>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-5xl font-extrabold text-navy-dark tracking-tighter">{loading ? '...' : kpis?.temp}</p>
                  <p className="text-slate-500 font-bold mt-1">Slightly Cloudy</p>
                </div>
                <Sun className="text-amber-400" size={72} strokeWidth={1.5} />
              </div>
              <div className="mt-8 grid grid-cols-2 gap-8 border-t border-slate-50 pt-6">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Wind Speed</p>
                  <p className="font-extrabold text-navy-dark">{loading ? '...' : kpis?.wind_speed}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Humidity</p>
                  <p className="font-extrabold text-navy-dark">{loading ? '...' : kpis?.humidity}</p>
                </div>
              </div>
            </div>

            {/* Work in Progress */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm h-fit">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-4 w-4 bg-emerald-400 rounded-full animate-ping opacity-25"></div>
                    <div className="relative h-2.5 w-2.5 bg-emerald-500 rounded-full"></div>
                  </div>
                  <h4 className="font-extrabold text-navy-dark tracking-tight">Work in Progress</h4>
                </div>
              </div>
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={index} className={`relative pl-6 border-l-2 ${item.status === 'current' ? 'border-primary/30' : 'border-slate-100'}`}>
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 ${item.status === 'current' ? 'border-primary' : 'border-slate-200'}`}></div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${item.status === 'current' ? 'text-primary' : 'text-slate-400'}`}>{item.time}</p>
                    <p className={`text-sm ${item.status === 'current' ? 'font-bold' : 'font-semibold'} text-navy-dark leading-snug`}>{item.description}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-3 bg-slate-50 text-navy-dark border border-slate-100 rounded-lg text-xs font-extrabold hover:bg-slate-100 transition-colors uppercase tracking-widest">
                View Full Daily Log
              </button>
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-navy-dark tracking-tight text-lg">Material Inventory Summary</h4>
              <p className="text-xs text-slate-400 font-medium">Tracking consumption and stock health</p>
            </div>
            <a href="/inventory" className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Full Inventory</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Material</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Current Stock</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Last Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-400 text-xs font-bold uppercase">Loading materials...</td></tr>
                ) : inventorySummary.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-400 text-xs font-bold uppercase">No critical stock detected</td></tr>
                ) : inventorySummary.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          <Layers size={20} />
                        </div>
                        <span className="font-bold text-navy-dark">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center font-extrabold text-navy-dark">{item.stock}</td>
                    <td className="px-8 py-5 text-center">
                      <div className={`inline-flex px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest
                        ${item.statusColor === 'red' ? 'bg-red-50 text-red-600' : ''}
                        ${item.statusColor === 'amber' ? 'bg-amber-50 text-amber-600' : ''}
                        ${item.statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-600' : ''}
                      `}>
                        {item.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right text-slate-500 text-xs font-semibold">{item.lastDelivery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="bg-navy-dark text-white p-6 mt-12">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-12">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Crew Deployment</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold">{loading ? '...' : kpis?.total_workers}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">On Site</span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-800"></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Shift Status</p>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="text-[10px] font-bold">Real-time Aggregation</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsFinalizeModalOpen(true)}
            className="bg-primary text-white px-8 py-3 rounded-lg flex items-center gap-3 font-extrabold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40 uppercase tracking-widest active:scale-95"
          >
            <CheckCircle size={18} />
            Finalize & Sync Day
          </button>
        </div>
      </footer>

      {/* Sync History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsHistoryModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-2xl border-2 border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-black text-navy-dark tracking-tight uppercase">Sync History</h3>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[400px] overflow-y-auto">
              {syncHistory.length === 0 ? (
                <p className="text-center text-slate-400 text-sm font-bold py-8 uppercase tracking-widest">No previous syncs found</p>
              ) : (
                <div className="space-y-4">
                  {syncHistory.map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-xs font-black text-navy-dark uppercase">{log.date}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Synced</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Finalize Confirmation Modal */}
      {isFinalizeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFinalizeModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl border-2 border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-black text-navy-dark tracking-tight uppercase mb-2">Finalize Today's Logs?</h3>
              <p className="text-slate-500 text-sm font-medium mb-8">
                This will lock all workforce and inventory logs for {date}. No further changes can be made once finalized.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsFinalizeModalOpen(false)}
                  className="flex-1 px-4 py-3 border-2 border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Go Back
                </button>
                <button 
                  disabled={syncing}
                  onClick={handleFinalize}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  {syncing ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                  {syncing ? 'Syncing...' : 'Finalize Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}