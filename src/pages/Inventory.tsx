import InventoryHeader from '../components/inventory/InventoryHeader';
import InventoryStats from '../components/inventory/InventoryStats';
import InventoryTable from '../components/inventory/InventoryTable';
import InventoryFeed from '../components/inventory/InventoryFeed';
import data from '../data.json';

export default function Inventory() {
  const { stats, items, recentActivity, stockForecast } = data.inventoryData;

  const activityWithForecast = recentActivity.map(activity => ({
        ...activity,
        // Ensure type safety/compatibility by adding missing optional properties if needed or transforming data
    }));


  return (
    <div className="flex flex-col h-full bg-background-light">
      <InventoryHeader />
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <InventoryStats stats={stats} />
        <InventoryTable items={items} />
        
        <InventoryFeed activities={activityWithForecast} forecast={stockForecast} />
      </div>
    </div>
  );
}
