import { useState, useEffect } from 'react';
import { Building, Sun, Briefcase, Package, AlertTriangle, Info, Share2, Printer } from 'lucide-react';
import data from '../data.json';

// Define the types based on schemas.py
interface DailyReport {
  overview: {
    labor_strength: number;
    incidents_count: number;
    weather: string;
  };
  labor_expenditure: Array<{
    category: string;
    skillLevel: string;
    count: number;
    dailyCost: number;
  }>;
  inventory_status: Array<{
    material: string;
    inStock: string;
  }>;
  alerts: Array<{
    type: string;
    title: string;
    message: string;
  }>;
}

export default function Reports() {
  const { projectInfo } = data; // Keep static project info format
  const [reportData, setReportData] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [exporting, setExporting] = useState(false);

  const fetchReport = async (selectedDate: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/reports/daily?date=${selectedDate}`);
      if (response.ok) {
        const json = await response.json();
        setReportData(json);
      }
    } catch (error) {
      console.error("Failed to fetch report", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(date);
  }, [date]);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const response = await fetch(`http://localhost:8000/api/reports/export-pdf?date=${date}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Daily_Report_${date}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to export PDF. Check backend logs.");
      }
    } catch (error) {
      console.error("Failed to export PDF", error);
      alert("Failed to export PDF.");
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = async () => {
    await fetchReport(date);
    setTimeout(() => {
      window.print();
    }, 500); 
  };

  if (loading && !reportData) {
    return <div className="p-8 text-center text-slate-500 font-bold">Loading report data...</div>;
  }

  return (
    <>
      <header className="print:hidden sticky top-0 z-40 bg-white border-b-2 border-slate-200 px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Daily Site Report</h2>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="px-2.5 py-1 bg-slate-100 text-[10px] font-black text-slate-500 rounded-md border border-slate-200 tracking-widest uppercase outline-none focus:border-primary"
                />
            </div>
            <div className="flex items-center gap-3">
                <button 
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                    <Share2 size={14} />
                    {exporting ? 'Generating...' : 'Export PDF'}
                </button>
                <button 
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-sm hover:bg-blue-600 active:scale-95 transition-all"
                    onClick={handlePrint}
                >
                    <Printer size={14} />
                    Print Report
                </button>
            </div>
        </header>

      <div className="max-w-4xl mx-auto my-6 print:my-0">
      <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-8 print-shadow-none print:border-none print:p-0">
        
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
            <div className={`bg-slate-50 print:bg-white p-4 rounded-lg border border-slate-200 print:border-slate-300`}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Labor Strength</p>
              <div className="flex items-center gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-2xl font-black text-slate-900">{reportData?.overview.labor_strength}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Personnel Active</p>
                  </div>
              </div>
            </div>

            <div className={`bg-slate-50 print:bg-white p-4 rounded-lg border border-slate-200 print:border-slate-300`}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reported Incidents</p>
              <div className="flex items-center gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-2xl font-black text-slate-900">{reportData?.overview.incidents_count}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Safety Compliance</p>
                  </div>
              </div>
            </div>

            <div className={`bg-slate-50 print:bg-white p-4 rounded-lg border border-slate-200 border-l-4 border-l-primary print:border-slate-300`}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Weather Condition</p>
              <div className="flex items-center gap-2">
                     <Sun className="text-amber-500 print:text-slate-500" size={24} />
                     <p className="text-lg font-black text-slate-900">{reportData?.overview.weather}</p>
              </div>
            </div>
        </div>

        {/* Labor Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-base font-black text-slate-900 uppercase tracking-tight">
              <Briefcase className="text-primary print:text-slate-800" size={18} />
              Labor Expenditure Details
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified by HR Module</span>
          </div>
          <div className="border-2 border-slate-200 print:border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 print:bg-slate-100 border-b-2 border-slate-200 print:border-slate-300">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Worker Category</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Count</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Daily Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 print:divide-slate-200">
                {reportData?.labor_expenditure.map((item, idx) => (
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
              <tfoot className="bg-navy-dark text-white print:bg-slate-200 print:text-slate-900">
                <tr>
                  <td className="px-4 py-3 font-black uppercase text-[10px] tracking-widest">Total Daily Workforce Investment</td>
                  <td className="px-4 py-3 text-center font-black text-sm">
                    {reportData?.labor_expenditure.reduce((acc, curr) => acc + curr.count, 0) || 0}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-black text-base">
                    ${(reportData?.labor_expenditure.reduce((acc, curr) => acc + curr.dailyCost, 0) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
              <Package className="text-primary print:text-slate-800" size={18} />
              Inventory & Stock Movement
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync from Material Module</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Inventory Table */}
            <div className="border-2 border-slate-200 print:border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 print:bg-slate-100 border-b-2 border-slate-200 print:border-slate-300">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Material</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">In Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 print:divide-slate-200">
                  {reportData?.inventory_status.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2.5 font-bold text-slate-700 text-sm">{item.material}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-sm">{item.inStock}</td>
                    </tr>
                  ))}
                  {(!reportData?.inventory_status || reportData.inventory_status.length === 0) && (
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-center text-sm text-slate-500">No inventory data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Alerts */}
            <div className="space-y-3">
              {reportData?.alerts.map((alert, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg flex items-start gap-2 border-l-4 ${
                    alert.type === 'critical' 
                      ? 'bg-red-50 border-danger print:bg-white print:border-slate-800' 
                      : 'bg-amber-50 border-attendance-half print:bg-white print:border-slate-400'
                  }`}
                >
                  {alert.type === 'critical' ? (
                     <AlertTriangle className="text-danger flex-shrink-0 print:text-slate-800" size={18} />
                  ) : (
                     <Info className="text-attendance-half flex-shrink-0 print:text-slate-800" size={18} />
                  )}
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${
                      alert.type === 'critical' ? 'text-danger print:text-slate-800' : 'text-attendance-half print:text-slate-800'
                    }`}>
                      {alert.title}
                    </p>
                    <p className="text-xs font-bold text-slate-800">{alert.message}</p>
                  </div>
                </div>
              ))}
              
              {(!reportData?.alerts || reportData.alerts.length === 0) && (
                <div className="p-3 text-sm text-center text-slate-500 italic bg-slate-50 print:bg-white rounded-lg">
                  No stock alerts at this time.
                </div>
              )}
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

        <div className="mt-8 text-center border-t border-slate-100 print:border-slate-300 pt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Generated via SiteOps Global Management Platform v4.2.0 - Date: {date}
          </p>
        </div>

      </div>
    </div>
    </>
  );
}