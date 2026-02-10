import { useState, useMemo } from 'react';
import InventoryHeader from '../components/inventory/InventoryHeader';
import InventoryStats from '../components/inventory/InventoryStats';
import InventoryTable from '../components/inventory/InventoryTable';
import InventoryFeed from '../components/inventory/InventoryFeed';
import AddItemModal from '../components/inventory/AddItemModal';
import data from '../data.json';

export default function Inventory() {
  const [items, setItems] = useState(data.inventoryData.items);
  const [activities, setActivities] = useState(data.inventoryData.recentActivity);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: 'All', status: 'All' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Derived state for stats
  const stats = useMemo(() => {
    const totalMaterials = items.length;
    const lowStock = items.filter(i => i.status === 'low').length;
    // Mocking other stats based on initial data or simple logic
    return [
      {
        label: "Total Materials",
        value: totalMaterials.toString(),
        subtext: "+4 this week",
        trend: "up",
        icon: "view_list",
        color: "primary"
      },
      {
        label: "Low Stock Alerts",
        value: lowStock.toString(),
        subtext: "Requires Immediate Action",
        trend: lowStock > 0 ? "neutral" : "up",
        icon: "warning",
        color: lowStock > 0 ? "red" : "green"
      },
      ...data.inventoryData.stats.slice(2) // Keep the last two stats static for now
    ];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filters.category === 'All' || item.name.includes(filters.category); // Simple category matching mock
      const matchesStatus = filters.status === 'All' || item.status === filters.status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, searchQuery, filters]);

  const handleUpdateStock = (id: string, change: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        const newStatus = newQuantity <= item.threshold ? 'low' : 'in-stock';

        // Add activity log
        const actionType = change > 0 ? 'arrival' : 'consumption';
        const actionText = change > 0 ? `received ${change} ${item.unit}` : `consumed ${Math.abs(change)} ${item.unit}`;

        const newActivity = {
          id: Date.now(),
          user: "Current User",
          action: actionText + " of",
          item: item.name,
          time: "Just now",
          location: "Site Office",
          type: actionType
        };

        setActivities(prevActivities => [newActivity, ...prevActivities]);

        return { ...item, quantity: newQuantity, status: newStatus };
      }
      return item;
    }));
  };

  const handleAddItem = (newItem: any) => {
    const itemWithDefaults = {
      ...newItem,
      po: 'PENDING',
      lastReceipt: 'Just added'
    };
    setItems(prev => [itemWithDefaults, ...prev]);
  };

  return (
    <div className="flex flex-col h-full bg-background-light">
      <InventoryHeader
        onSearch={setSearchQuery}
        onNewMaterial={() => setIsAddModalOpen(true)}
      />
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <InventoryStats stats={stats} />
        <InventoryTable
          items={filteredItems}
          onUpdateStock={handleUpdateStock}
          onFilterChange={(type, value) => setFilters(prev => ({ ...prev, [type]: value }))}
        />

        <InventoryFeed activities={activities} forecast={data.inventoryData.stockForecast} />
      </div>

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddItem}
      />
    </div>
  );
}
