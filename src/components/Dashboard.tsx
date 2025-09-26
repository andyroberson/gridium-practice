import "./dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEnergyData } from "../hooks/useEnergyData.ts";
import {
  getLatestBillMetrics,
  getMonthlyBillData,
} from "../utils/dataProcessors.ts";

const Dashboard = () => {
  const { readings, bills, loading, error } = useEnergyData();

  console.log(readings, bills);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const billMetrics = getLatestBillMetrics(bills);
  const monthlyData = getMonthlyBillData(bills);

  console.log(billMetrics);

  return (
    <div className="dashboard-grid">
      {/* Row 1 */}

      <div className="card col-span-4">
        <h2>Key Metrics</h2>
        <div className="card-content">
          {billMetrics && (
            <>
              <p>Current cost: ${billMetrics.currentCost.toLocaleString()}</p>
              <p className={`${billMetrics.costChange >= 0 ? "red" : "green"}`}>
                {billMetrics.costChange > 0 ? "+" : ""}
                {billMetrics.costChange.toFixed(1)}% from last month
              </p>
            </>
          )}
        </div>
      </div>
      <div className="card col-span-8">
        <h2>Monthly Costs</h2>
        <div
          style={{
            color: "#aaa",
            height: "150px",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  "Cost",
                ]}
                labelStyle={{ color: "#374151" }}
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2 */}
      <div className="card col-span-6">
        <h2>Daily Usage Pattern</h2>
        <div
          style={{
            height: "200px",
            textAlign: "center",
            lineHeight: "200px",
            color: "#aaa",
          }}
        >
          Line Chart Placeholder
        </div>
      </div>

      <div className="card col-span-6">
        <h2>Peak Demand Analysis</h2>
        <div
          style={{
            height: "200px",
            textAlign: "center",
            lineHeight: "200px",
            color: "#aaa",
          }}
        >
          Bar Chart Placeholder
        </div>
      </div>

      {/* Row 3 */}
      <div className="card col-span-12">
        <h2>Raw Data</h2>
        <div
          style={{
            height: "150px",
            textAlign: "center",
            lineHeight: "150px",
            color: "#aaa",
          }}
        >
          Table Placeholder
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
