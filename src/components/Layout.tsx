import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Package, Image, FileText, Building } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Labor & Attendance', path: '/labor', icon: <Users size={18} /> },
    { name: 'Material Inventory', path: '/inventory', icon: <Package size={18} /> },
    { name: 'Site Gallery', path: '/gallery', icon: <Image size={18} /> },
    { name: 'Project Report', path: '/reports', icon: <FileText size={18} /> },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Fixed */}
      <aside className="no-print w-60 bg-navy-dark text-white flex-shrink-0 flex flex-col fixed h-full z-50">
        <div className="p-5 flex items-center gap-3 border-b border-slate-800">
          <Building className="text-primary" size={24} strokeWidth={2.5} />
          <h1 className="text-lg font-black tracking-tighter uppercase">SiteOps</h1>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1.5">
          {navItems.map((item) => {
             const isActive = location.pathname === item.path;
             return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span className="text-xs font-bold uppercase tracking-wider">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg">
             {/* Abstract avatar placeholder or user initials */}
            <div className="w-8 h-8 rounded-md bg-slate-700 border border-slate-600 flex items-center justify-center">
                <Users size={16} className="text-slate-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black truncate">Project Manager</p>
              <p className="text-[8px] text-slate-400 truncate uppercase tracking-tighter">Site B: Grand Central</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-60 min-h-screen bg-white">
        {/* Render child pages (Dashboard, etc.) */}
        <Outlet />
      </main>
    </div>
  );
}