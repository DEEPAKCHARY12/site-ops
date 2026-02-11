import { ClipboardList, AlertTriangle, Clock, BarChart3, TrendingUp } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  subtext: string;
  trend: string;
  icon: string;
  color: string;
}

interface InventoryStatsProps {
  stats: Stat[];
}

export default function InventoryStats({ stats }: InventoryStatsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'view_list': return <ClipboardList size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      case 'schedule': return <Clock size={20} />;
      case 'bar_chart': return <BarChart3 size={20} />;
      default: return <ClipboardList size={20} />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
        case 'primary': return 'bg-primary/10 text-primary';
        case 'red': return 'bg-red-50 text-red-600';
        case 'amber': return 'bg-amber-50 text-amber-500';
        case 'slate': return 'bg-slate-100 text-slate-600';
        default: return 'bg-slate-100 text-slate-600';
    }
  };

    const getBorderClass = (color: string) => {
        if (color === 'red') return 'border-l-4 border-l-red-500';
        return '';
    };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm ${getBorderClass(stat.color)}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 text-sm font-medium">{stat.label}</span>
            <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
              {getIcon(stat.icon)}
            </div>
          </div>
          <div className={`text-2xl font-bold ${stat.color === 'red' ? 'text-red-600' : 'text-slate-900'}`}>{stat.value}</div>
          <div className="text-xs font-medium mt-1 flex items-center gap-1">
             {stat.trend === 'up' && <TrendingUp size={12} className="text-green-600" />}
             <span className={stat.color === 'red' ? 'text-slate-500 uppercase tracking-tighter' : (stat.trend === 'up' ? 'text-green-600' : 'text-slate-500')}>
                {stat.subtext}
             </span>
          </div>
        </div>
      ))}
    </div>
  );
}
