import { useEffect, useMemo, useState } from "react";
import { ordersApi, productsApi } from "../api/api";
import Card from "../components/UI/Card";
import Table from "../components/UI/Table";
import SalesChart from "../components/SalesChart";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [productsResponse, lowStockResponse, ordersResponse] =
        await Promise.all([
          productsApi.list(),
          productsApi.lowStock(),
          ordersApi.list(),
        ]);

      setProducts(productsResponse.data || []);
      setLowStock(lowStockResponse.data || []);
      setOrders(ordersResponse.data || []);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
      setError("Failed to load dashboard data from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totals = useMemo(() => {
    const totalProducts = products.length;
    const lowStockItems = lowStock.length;
    const totalOrders = orders.length;

    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);

    const todaysSales = orders.reduce((sum, order) => {
      if (!order.orderDate) return sum;
      const orderDay = new Date(order.orderDate).toISOString().slice(0, 10);
      if (orderDay !== todayKey) return sum;
      return sum + (order.totalAmount || 0);
    }, 0);

    return {
      totalProducts,
      lowStockItems,
      totalOrders,
      todaysSales,
    };
  }, [products, lowStock, orders]);

  const charts = useMemo(() => {
    if (!orders.length) {
      return {
        sales: { labels: [], values: [] },
        orderCounts: { labels: [], values: [] },
      };
    }

    const salesByDay = new Map();
    const countByDay = new Map();

    orders.forEach((order) => {
      if (!order.orderDate) return;
      const day = new Date(order.orderDate).toISOString().slice(0, 10);
      const amount = order.totalAmount || 0;

      salesByDay.set(day, (salesByDay.get(day) || 0) + amount);
      countByDay.set(day, (countByDay.get(day) || 0) + 1);
    });

    const labels = Array.from(salesByDay.keys()).sort();
    const salesValues = labels.map((key) => salesByDay.get(key));
    const countValues = labels.map((key) => countByDay.get(key) || 0);

    return {
      sales: { labels, values: salesValues },
      orderCounts: { labels, values: countValues },
    };
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const da = a.orderDate ? new Date(a.orderDate).getTime() : 0;
        const db = b.orderDate ? new Date(b.orderDate).getTime() : 0;
        return db - da;
      })
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="vm-page">
      <div className="vm-page__header">
        <h1>Admin Dashboard</h1>
        <p>Live snapshot of inventory and sales.</p>
      </div>

      {error && <div className="vm-alert vm-alert--error">{error}</div>}

      <div className="vm-metrics">
        <Card title="Total Products">
          <p className="vm-metrics__value">{totals.totalProducts}</p>
        </Card>
        <Card title="Low Stock Items">
          <p className="vm-metrics__value vm-metrics__value--warning">
            {totals.lowStockItems}
          </p>
        </Card>
        <Card title="Total Orders">
          <p className="vm-metrics__value">{totals.totalOrders}</p>
        </Card>
        <Card title="Today's Sales">
          <p className="vm-metrics__value vm-metrics__value--accent">
            ₹{totals.todaysSales.toFixed(2)}
          </p>
        </Card>
      </div>

      <div className="vm-page__grid vm-page__grid--charts">
        <Card title="Sales chart">
          <SalesChart
            labels={charts.sales.labels}
            values={charts.sales.values}
            label="Daily sales (₹)"
          />
        </Card>

        <Card title="Orders chart">
          <SalesChart
            labels={charts.orderCounts.labels}
            values={charts.orderCounts.values}
            label="Orders per day"
          />
        </Card>
      </div>

      <Card title="Recent activity" subtitle="Latest orders from the POS.">
        {loading ? (
          <div className="vm-table__loading">Loading...</div>
        ) : (
          <Table
            columns={[
              { header: "Order ID", accessor: "id" },
              { header: "Customer", accessor: "customerPhone" },
              { header: "Amount", accessor: "totalAmount" },
              { header: "Date", accessor: "orderDate" },
            ]}
            data={recentOrders}
            rowKey="id"
          />
        )}
      </Card>
    </div>
  );
}

export default AdminDashboard;
