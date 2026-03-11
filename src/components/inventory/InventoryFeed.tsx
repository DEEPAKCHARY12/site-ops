import { History, TrendingDown, Calendar, Zap } from 'lucide-react';
import { ordersApi } from '../../utils/api';

interface Activity {
  id: number;
  user: string;
  action: string;
  item: string;
  time: string;
  location: string;
  type: 'consumption' | 'arrival' | 'po';
  poNumber?: string;
}

interface InventoryFeedProps {
  activities: Activity[];
  forecast: {
    message: string;
    item: string;
    po: string;
  };
}

export default function InventoryFeed({ activities, forecast }: InventoryFeedProps) {

  const handleExpedite = async () => {
    try {
      const res = await ordersApi.expedite();
      alert(res.data.message);
    } catch (error) {
      console.error("Error expediting order:", error);
    }
  };

  const handleViewSchedule = async (itemId?: number) => {
    try {
      const res = await ordersApi.getSchedule(itemId || 1);
      const scheduleText = res.data.schedule.map((s: any) => `${s.date}: ${s.event}`).join('\n');
      alert(`Project Schedule for ${forecast.item}:\n\n${scheduleText}`);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <History size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 leading-tight">Recent Activity</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Inventory logs</p>
          </div>
        </div>
        <div className="space-y-6">
          {activities.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">No recent activity</div>
          ) : (
            activities.map((activity: any) => (
              <div key={activity.id} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className={`size-3 rounded-full border-2 border-white shadow-sm ring-2 ${activity.type === 'arrival' ? 'ring-green-500 bg-green-500' :
                    activity.type === 'po' ? 'ring-primary bg-primary' : 'ring-amber-500 bg-amber-500'}`}
                  />
                  <div className="w-px flex-1 bg-slate-100 group-last:hidden mt-2"></div>
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-xs font-bold text-slate-900">
                    {activity.user} <span className="font-normal text-slate-500">{activity.action}</span> {activity.item}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-400 font-medium">{activity.time}</span>
                    <span className="size-1 bg-slate-300 rounded-full"></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{activity.location}</span>
                    {activity.poNumber && (
                      <span className="text-[10px] text-primary font-black hover:underline cursor-pointer ml-auto">{activity.poNumber}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <button className="w-full mt-6 py-2.5 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-100 transition-colors">
          View full log
        </button>
      </div>

      <div className="bg-navy-dark rounded-xl shadow-2xl p-6 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 transform group-hover:scale-110 transition-transform">
          <TrendingDown size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center text-amber-400">
              <TrendingDown size={20} />
            </div>
            <div>
              <h3 className="font-black leading-tight">Stock Forecast</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-primary font-black uppercase tracking-widest">AI Insights</span>
                <span className="size-1 bg-white/20 rounded-full"></span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active simulation</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm mb-6">
            <div className="flex items-start gap-4">
              <div className="size-8 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-500 flex-shrink-0 animate-pulse">
                <TrendingDown size={18} />
              </div>
              <p className="text-sm text-slate-200 leading-relaxed italic">
                "{forecast.message}"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExpedite}
              className="flex items-center justify-center gap-2 py-3 bg-primary hover:bg-blue-600 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95"
            >
              <Zap size={14} fill="currentColor" />
              Expedite Order
            </button>
            <button
              onClick={() => handleViewSchedule()}
              className="flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 active:scale-95"
            >
              <Calendar size={14} />
              View Schedule
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 py-2 bg-white/5 rounded-lg border border-dashed border-white/10 opacity-70 cursor-not-allowed">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Automated re-order system:</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Disabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
