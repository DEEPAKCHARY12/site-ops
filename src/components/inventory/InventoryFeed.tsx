import { History, LineChart } from 'lucide-react';

interface RecentActivity {
  id: number;
  user: string;
  action: string;
  item: string;
  time: string;
  location: string;
  type: string;
  poNumber?: string;
}

interface StockForecast {
  message: string;
  item: string;
  po: string;
}

interface InventoryFeedProps {
  activities: RecentActivity[];
  forecast: StockForecast;
}

export default function InventoryFeed({ activities, forecast }: InventoryFeedProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <History className="text-primary" size={20} />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
               <div className={`mt-1 size-2 rounded-full ${
                    activity.type === 'consumption' ? 'bg-primary' :
                    activity.type === 'arrival' ? 'bg-green-500' :
                    'bg-amber-500'
               }`}></div>
              <div className="flex-1">
                <p className="text-sm">
                  <strong>{activity.user}</strong> {activity.action} {activity.item && <strong>{activity.item}</strong>}
                </p>
                <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">
                  {activity.time} • {activity.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Forecast */}
      <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold flex items-center gap-2 text-primary">
            <LineChart size={20} />
            Stock Forecast
          </h3>
          <span className="text-[10px] font-bold uppercase text-primary/60">AI Insights</span>
        </div>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          {forecast.message}
        </p>
        <div className="flex gap-2">
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:brightness-110 transition-all">Expedite Order</button>
          <button className="bg-white text-slate-600 px-4 py-2 rounded-lg text-xs font-bold border border-primary/20">View Schedule</button>
        </div>
      </div>
    </div>
  );
}
