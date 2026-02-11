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
  LayoutGrid,
  Layers,
  Droplet,
  CheckCircle
} from 'lucide-react';
import data from '../data/data.json';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                <Construction size={20} />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-navy-dark uppercase">SiteOps</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 h-16">
              <a href="#" className="text-primary border-b-2 border-primary h-full flex items-center px-1 text-sm font-semibold">Dashboard</a>
              <a href="#" className="text-slate-500 hover:text-navy-dark h-full flex items-center px-1 text-sm font-semibold transition-colors">Workforce</a>
              <a href="#" className="text-slate-500 hover:text-navy-dark h-full flex items-center px-1 text-sm font-semibold transition-colors">Inventory</a>
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
                <p className="text-sm font-bold text-navy-dark">{data.user.name}</p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">{data.user.role}</p>
              </div>
              <img
                src={data.user.avatar}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <MapPin size={14} />
              <span className="text-xs font-bold uppercase tracking-widest">{data.user.site}</span>
            </div>
            <h1 className="text-4xl font-extrabold text-navy-dark tracking-tight">Executive Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1">Reviewing daily operational metrics and site progress.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-lg flex items-center gap-2 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm">
              <History size={18} />
              Sync History
            </button>
            <button className="bg-primary text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
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
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{data.metrics.workers.trend}</span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Workers Present</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-extrabold text-navy-dark">{data.metrics.workers.count}</h3>
              <span className="text-slate-400 text-sm font-medium">{data.metrics.workers.label}</span>
            </div>
            <p className="text-xs text-slate-400 mt-4 border-t border-slate-50 pt-3">{data.metrics.workers.subtitle}</p>
          </div>

          {/* Critical Stock */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full uppercase">{data.metrics.criticalStock.status}</span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Critical Stock Alerts</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-extrabold text-navy-dark">{data.metrics.criticalStock.count.toString().padStart(2, '0')}</h3>
              <span className="text-slate-400 text-sm font-medium">{data.metrics.criticalStock.label}</span>
            </div>
            <p className="text-xs text-slate-400 mt-4 border-t border-slate-50 pt-3">{data.metrics.criticalStock.subtitle}</p>
          </div>

          {/* Project Deadline */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Calendar className="text-amber-600" size={24} />
              </div>
              <div className="flex gap-1">
                <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden self-center">
                  <div className="h-full bg-primary" style={{ width: `${data.metrics.project.progress}%` }}></div>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Project Deadline</p>
            <h3 className="text-2xl font-extrabold text-navy-dark uppercase tracking-tight">{data.metrics.project.deadline}</h3>
            <p className="text-xs text-slate-400 mt-4 border-t border-slate-50 pt-3">{data.metrics.project.remaining} ({data.metrics.project.progress}% Complete)</p>
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
                  <p className="text-5xl font-extrabold text-navy-dark tracking-tighter">{data.weather.temp}</p>
                  <p className="text-slate-500 font-bold mt-1">{data.weather.condition}</p>
                </div>
                <Sun className="text-amber-400" size={72} strokeWidth={1.5} />
              </div>
              <div className="mt-8 grid grid-cols-2 gap-8 border-t border-slate-50 pt-6">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Wind Speed</p>
                  <p className="font-extrabold text-navy-dark">{data.weather.windSpeed}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Humidity</p>
                  <p className="font-extrabold text-navy-dark">{data.weather.humidity}</p>
                </div>
              </div>
            </div>

            {/* Work in Progress */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
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
                {data.timeline.map((item, index) => (
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
            <a href="#" className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Full Inventory</a>
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
                {data.inventory.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          {item.icon === 'grid_view' && <LayoutGrid size={20} />}
                          {item.icon === 'layers' && <Layers size={20} />}
                          {item.icon === 'water_drop' && <Droplet size={20} />}
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
                <span className="text-3xl font-extrabold">{data.crew.total}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">On Site</span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-800"></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Shift Status</p>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span className="text-[10px] font-bold">{data.crew.fullDay} Full Day</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  <span className="text-[10px] font-bold">{data.crew.halfDay} Half Day</span>
                </div>
              </div>
            </div>
          </div>
          <button className="bg-primary text-white px-8 py-3 rounded-lg flex items-center gap-3 font-extrabold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40 uppercase tracking-widest">
            <CheckCircle size={18} />
            Finalize & Sync Day
          </button>
        </div>
      </footer>
    </div>
  );
}