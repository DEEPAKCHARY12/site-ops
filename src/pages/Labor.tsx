import { Search, MapPin, Calendar, Clock, CheckCircle, XCircle, Cloud, User } from 'lucide-react';
import data from '../data.json';

export default function Labor() {
  const { workers, laborStats } = data;

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
             <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Attendance Date</span>
                <div className="bg-slate-50 p-1 rounded-lg border-2 border-slate-200 flex gap-1">
                    <button className="px-4 py-2 rounded-md text-xs font-black bg-primary text-white shadow-sm flex items-center gap-2">
                        <Calendar size={14} /> Today
                    </button>
                    <button className="px-4 py-2 rounded-md text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm flex items-center gap-2 transition-all">
                        <Clock size={14} className="text-slate-400" /> Yesterday
                    </button>
                </div>
            </div>
        </div>

        {/* Worker Table */}
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
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {workers.map((worker) => (
                            <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-slate-200">
                                            <img src={worker.image} alt={worker.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-slate-900 text-sm">{worker.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: #{worker.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                        worker.role === 'Senior Mason' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                        {worker.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="font-mono font-bold text-slate-700 text-sm">${worker.wage.toFixed(2)}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-center p-0.5 bg-slate-100 rounded-lg w-fit mx-auto border-2 border-slate-200">
                                        <button className={`px-3 py-1.5 rounded-md text-[10px] font-black flex items-center gap-1.5 transition-colors ${
                                            worker.status === 'present' 
                                                ? 'bg-attendance-present text-white shadow-sm' 
                                                : 'text-slate-500 hover:text-slate-900'
                                        }`}>
                                            <CheckCircle size={12} /> PRESENT
                                        </button>
                                        <button className={`px-3 py-1.5 rounded-md text-[10px] font-black flex items-center gap-1.5 transition-colors ${
                                            worker.status === 'half-day' 
                                                ? 'bg-attendance-half text-white shadow-sm' 
                                                : 'text-slate-500 hover:text-slate-900'
                                        }`}>
                                            <div className="size-3 rounded-full border-2 border-current border-t-transparent" /> HALF
                                        </button>
                                        <button className={`px-3 py-1.5 rounded-md text-[10px] font-black flex items-center gap-1.5 transition-colors ${
                                            worker.status === 'absent' 
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
                                            worker.status === 'absent' ? 'text-attendance-absent' : 'text-slate-900'
                                        }`}>
                                            ${(worker.status === 'half-day' ? worker.wage * 0.5 : worker.status === 'absent' ? 0 : worker.wage).toFixed(2)}
                                        </p>
                                        {worker.status === 'half-day' && (
                                            <span className="text-[8px] font-black text-attendance-half uppercase tracking-widest">50% APPLIED</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="p-4 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Showing {workers.length} of 42 workers</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-md border-2 border-slate-200 font-bold text-xs text-slate-400 cursor-not-allowed">Previous</button>
                    <button className="px-3 py-1.5 rounded-md border-2 border-slate-200 font-bold text-xs text-slate-700 hover:bg-white hover:border-primary hover:text-primary transition-all">Next</button>
                </div>
            </div>
        </div>

      </main>

       {/* Footer - Fixed Bottom */}
       <footer className="fixed bottom-0 left-60 right-0 bg-navy-dark text-white z-[100] border-t-4 border-primary">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Crew Deployment</span>
                         <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black leading-none">{laborStats.active}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">On Site</span>
                        </div>
                     </div>
                     <div className="h-8 w-px bg-slate-700"></div>
                     <div className="hidden lg:flex flex-col gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Attendance Status</span>
                        <div className="flex gap-3">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                                <span className="size-1.5 rounded-full bg-attendance-present"></span>
                                <span className="text-[10px] font-black">{laborStats.present} Full</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                                <span className="size-1.5 rounded-full bg-attendance-half"></span>
                                <span className="text-[10px] font-black">{laborStats.halfDay} Half</span>
                            </div>
                        </div>
                     </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-1">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Labor Cost</span>
                     <div className="flex items-center gap-6">
                        <span className="text-3xl font-black tracking-tighter text-white font-mono">${laborStats.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all active:scale-95 flex items-center gap-2">
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
