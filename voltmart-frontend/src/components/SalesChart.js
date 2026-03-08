import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

function SalesChart({
  labels = ["Mon", "Tue", "Wed", "Thu", "Fri"],
  values = [200, 400, 350, 500, 650],
  label = "Sales",
}) {
  const hasData = labels.length > 0 && values.length > 0;

  if (!hasData) {
    return (
      <div style={{ padding: "0.75rem", fontSize: "0.9rem", color: "#6b7280" }}>
        No data available yet.
      </div>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: "#4f46e5",
      },
    ],
  };

  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <Bar data={data} />
    </div>
  );
}

export default SalesChart;