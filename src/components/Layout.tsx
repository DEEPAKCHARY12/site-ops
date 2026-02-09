import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Image, ClipboardList, FileText } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <ClipboardList size={20} /> },
    { name: 'Labor', path: '/labor', icon: <Users size={20} /> },
    { name: 'Gallery', path: '/gallery', icon: <Image size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Hides when printing */}
      <aside className="w-64 bg-white shadow-md print:hidden flex flex-col">
        <div className="p-6 font-bold text-2xl text-blue-600 border-b">SiteOps</div>
        <nav className="flex-1 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 transition-colors ${
                location.pathname === item.path ? 'bg-blue-100 border-r-4 border-blue-600 text-blue-700' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t text-xs text-gray-400">
          Intern 5 (Layout)
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}