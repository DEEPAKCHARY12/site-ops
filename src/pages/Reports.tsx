import { Building, Sun, Briefcase, Package, AlertTriangle, Info, Share2, Printer } from 'lucide-react';
import data from '../data.json';

export default function Reports() {
  const { projectInfo, stats, labor, inventory, alerts } = data;

  return (
    <>
      <header className="no-print sticky top-0 z-40 bg-white border-b-2 border-slate-200 px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Daily Site Report</h2>
                <span className="px-2.5 py-0.5 bg-slate-100 text-[10px] font-black text-slate-500 rounded-full border border-slate-200 tracking-widest uppercase">
                    October 24, 2023
                </span>
            </div>
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    <Share2 size={14} />
                    Export PDF
                </button>
                <button 
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-sm hover:bg-blue-600 active:scale-95 transition-all"
                    onClick={() => window.print()}
                >
                    <Printer size={14} />
                    Print Report
                </button>
            </div>
        </header>

      <div className="max-w-4xl mx-auto my-6">
      <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-8 print-shadow-none">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8 border-b-2 border-navy-dark pb-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <Building className="text-primary" size={20} />
              <span className="font-black tracking-tighter uppercase text-lg text-slate-900">SiteOps Global</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">DAILY OPERATIONS SUMMARY</h1>
            <p className="text-slate-500 text-sm font-medium mt-0.5">Ref: {projectInfo.reportId}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Project Site</p>
            <p className="text-base font-black text-slate-900 leading-none">{projectInfo.name}</p>
            <p className="text-xs font-bold text-slate-500 mt-0.5">{projectInfo.phase}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`bg-slate-50 p-4 rounded-lg border border-slate-200 ${
                stat.type === 'weather' ? 'border-l-4 border-l-primary' : ''
              }`}
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <div className="flex items-center gap-2">
                {stat.type === 'weather' ? (
                  <>
                     <Sun className="text-amber-500" size={24} />
                     <p className="text-lg font-black text-slate-900">{stat.value}</p>
                  </>
                ) : (
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{stat.subtext}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Labor Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-base font-black text-slate-900 uppercase tracking-tight">
              <Briefcase className="text-primary" size={18} />
              Labor Expenditure Details
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified by HR Module</span>
          </div>
          <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Worker Category</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Count</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Daily Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {labor.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3">
                      <p className="font-extrabold text-slate-900 text-sm">{item.category}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Skill Level: {item.skillLevel}</p>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-700 text-sm">{item.count}</td>
                    <td className="px-4 py-3 text-right font-mono font-black text-slate-900 text-sm">
                      ${item.dailyCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-navy-dark text-white">
                <tr>
                  <td className="px-4 py-3 font-black uppercase text-[10px] tracking-widest">Total Daily Workforce Investment</td>
                  <td className="px-4 py-3 text-center font-black text-sm">
                    {labor.reduce((acc, curr) => acc + curr.count, 0)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-black text-base">
                    ${labor.reduce((acc, curr) => acc + curr.dailyCost, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Inventory Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-base font-black text-slate-900 uppercase tracking-tight">
              <Package className="text-primary" size={18} />
              Inventory & Stock Movement
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync from Material Module</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Inventory Table */}
            <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Material</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">In Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2.5 font-bold text-slate-700 text-sm">{item.material}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-sm">{item.inStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Alerts */}
            <div className="space-y-3">
              {alerts.map((alert, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg flex items-start gap-2 border-l-4 ${
                    alert.type === 'critical' 
                      ? 'bg-red-50 border-danger' 
                      : 'bg-amber-50 border-attendance-half'
                  }`}
                >
                  {alert.type === 'critical' ? (
                     <AlertTriangle className="text-danger flex-shrink-0" size={18} />
                  ) : (
                     <Info className="text-attendance-half flex-shrink-0" size={18} />
                  )}
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${
                      alert.type === 'critical' ? 'text-danger' : 'text-attendance-half'
                    }`}>
                      {alert.title}
                    </p>
                    <p className="text-xs font-bold text-slate-800">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Signatures */}
        <div className="mt-12 flex justify-between">
          <div className="w-56 border-t-2 border-slate-300 pt-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Prepared By</p>
            <p className="text-xs font-black text-slate-900 uppercase">Site Supervisor Signature</p>
          </div>
          <div className="w-56 border-t-2 border-slate-300 pt-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Authorized By</p>
            <p className="text-xs font-black text-slate-900 uppercase">Project Manager Signature</p>
          </div>
        </div>

        <div className="mt-8 text-center border-t border-slate-100 pt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Generated via SiteOps Global Management Platform v4.2.0
          </p>
        </div>

      </div>
    </div>
    </>
  );
}