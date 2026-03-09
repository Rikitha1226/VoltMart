import { useEffect, useMemo, useState } from "react";
import Card from "../components/UI/Card";
import SalesChart from "../components/SalesChart";
import { ordersApi } from "../api/api";

function Reports() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await ordersApi.list();
        setOrders(response.data || []);
      } catch (err) {
        setError("Failed to load reports data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const { daily, monthly, topCategories } = useMemo(() => {
    if (!orders.length) {
      return {
        daily: { labels: [], values: [] },
        monthly: { labels: [], values: [] },
        topCategories: { labels: [], values: [] },
      };
    }

    const dailyMap = new Map();
    const monthlyMap = new Map();

    orders.forEach((order) => {
      if (!order.orderDate) return;
      const date = new Date(order.orderDate);
      const keyDay = date.toISOString().slice(0, 10);
      const keyMonth = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}`;
      const amount = order.totalAmount || 0;

      dailyMap.set(keyDay, (dailyMap.get(keyDay) || 0) + amount);
      monthlyMap.set(keyMonth, (monthlyMap.get(keyMonth) || 0) + amount);
    });

    const daily = {
      labels: Array.from(dailyMap.keys()).sort(),
      values: Array.from(dailyMap.keys())
        .sort()
        .map((key) => dailyMap.get(key)),
    };

    const monthlyLabels = Array.from(monthlyMap.keys()).sort();
    const monthlyValues = monthlyLabels.map((key) => monthlyMap.get(key));

    const monthly = {
      labels: monthlyLabels,
      values: monthlyValues,
    };

    // Top selling by category would require item-level data.
    // For now keep this nil as requested.
    const topCategories = { labels: [], values: [] };

    return { daily, monthly, topCategories };
  }, [orders]);

  return (
    <div className="vm-page">
      <div className="vm-page__header">
        <h1>Reports</h1>
        <p>Visualize sales performance and product trends.</p>
      </div>

      {error && <div className="vm-alert vm-alert--error">{error}</div>}

      <div className="vm-page__grid vm-page__grid--reports">
        <Card title="Daily sales">
          {loading ? (
            <div className="vm-table__loading">Loading...</div>
          ) : (
            <SalesChart
              labels={daily.labels}
              values={daily.values}
              label="Daily sales (₹)"
            />
          )}
        </Card>

        <Card title="Top selling categories">
          {/* Intentionally kept empty for now */}
          <SalesChart
            labels={topCategories.labels}
            values={topCategories.values}
            label="Top categories"
          />
        </Card>

        <Card title="Monthly revenue">
          {loading ? (
            <div className="vm-table__loading">Loading...</div>
          ) : (
            <SalesChart
              labels={monthly.labels}
              values={monthly.values}
              label="Monthly revenue (₹)"
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default Reports;
