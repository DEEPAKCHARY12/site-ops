import { useState, useEffect, useCallback } from 'react';
import InventoryHeader from '../components/inventory/InventoryHeader';
import InventoryStats from '../components/inventory/InventoryStats';
import InventoryTable from '../components/inventory/InventoryTable';
import InventoryFeed from '../components/inventory/InventoryFeed';
import { inventoryApi, activityApi, projectApi } from '../utils/api';

export default function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtering & Pagination State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Materials');
  const [status, setStatus] = useState('Status: All');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [currentProject, setCurrentProject] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      const params = {
        search: search || undefined,
        category: category !== 'All Materials' ? category : undefined,
        status: status !== 'Status: All' ? status : undefined,
        sort_by: sortBy,
        order: order,
        page,
        limit
      };

      const [inventoryRes, statsRes, activityRes] = await Promise.all([
        inventoryApi.getInventory(params),
        inventoryApi.getStats(),
        activityApi.getActivities(),
      ]);

      setItems(inventoryRes.data.items);
      setTotal(inventoryRes.data.total);
      
      const [projectsRes] = await Promise.all([projectApi.getProjects()]);
      if (!currentProject && projectsRes.data.length > 0) {
        setCurrentProject(projectsRes.data[0]);
      }

      const backendStats = statsRes.data;
      const formattedStats = [
        {
          label: "Total Materials",
          value: backendStats.total_materials.toLocaleString(),
          subtext: "Live from database",
          trend: "neutral",
          icon: "view_list",
          color: "primary"
        },
        {
          label: "Low Stock Alerts",
          value: backendStats.low_stock_alerts.toString(),
          subtext: "Requires Immediate Action",
          trend: "neutral",
          icon: "warning",
          color: "red"
        },
        {
          label: "Pending Requests",
          value: backendStats.pending_requests.toString().padStart(2, '0'),
          subtext: "Awaiting approval",
          trend: "neutral",
          icon: "schedule",
          color: "amber"
        },
        {
          label: "Monthly Usage",
          value: backendStats.monthly_usage,
          subtext: "Estimated",
          trend: "neutral",
          icon: "bar_chart",
          color: "slate"
        }
      ];
      setStats(formattedStats);
      setActivities(activityRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setLoading(false);
    }
  }, [search, category, status, sortBy, order, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing with Site-Ops Cloud...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background-light">
      <InventoryHeader
        onMaterialAdded={fetchData}
        onSearch={setSearch}
        currentProject={currentProject}
        onProjectChange={setCurrentProject}
      />
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <InventoryStats stats={stats} />

        <InventoryTable
          items={items}
          onUpdate={fetchData}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onFilterChange={(cat, stat) => {
            setCategory(cat);
            setStatus(stat);
            setPage(1);
          }}
          onSortChange={(col, ord) => {
            setSortBy(col);
            setOrder(ord);
          }}
          currentSort={{ column: sortBy, order }}
        />

        <InventoryFeed
          activities={activities.map(a => ({
            ...a,
            time: new Date(a.timestamp).toLocaleTimeString(),
            poNumber: a.po_number
          }))}
          forecast={{
            message: "Based on current concrete pouring schedule, Ready-Mix C35 will drop below threshold in 3 days. Recommendation: Expedite PO-9918.",
            item: "Ready-Mix C35",
            po: "PO-9918"
          }}
        />
      </div>
    </div>
  );
}
