import "./dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { useEnergyData } from "../hooks/useEnergyData.ts";
import {
  getHourlyUsagePattern,
  getLatestBillMetrics,
  getMonthlyBillData,
  getPeakDemandTrends,
  getTopPeakIntervals,
} from "../utils/dataProcessors.ts";
import RawDataTable from "./RawTable.tsx";

const Dashboard = () => {
  const { readings, bills, loading, error } = useEnergyData();

  console.log(readings, bills);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const billMetrics = getLatestBillMetrics(bills);
  const monthlyData = getMonthlyBillData(bills);
  const hourlyData = getHourlyUsagePattern(readings);
  const peakTrends = getPeakDemandTrends(bills);
  // const topIntervals = getTopPeakIntervals(readings);

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
        <div style={{ height: "250px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 10 }}
                interval={2} // Show every 3rd hour to avoid crowding
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value.toFixed(1)} kW`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value.toFixed(2)} kW`,
                  "Avg Usage",
                ]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="avgKw"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: "#10B981", strokeWidth: 1, r: 2 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card col-span-6">
        <h2>Peak Demand Analysis</h2>
        <div
          style={{
            height: "250px",
            color: "#aaa",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peakTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${value} kW`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(1)} kW`,
                  "Peak Demand",
                ]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar dataKey="peakDemand" fill="#EF4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3 */}
      <div className="card col-span-12">
        <h2>Raw Data</h2>
        <RawDataTable readings={readings} bills={bills} />
      </div>
    </div>
  );
};

export default Dashboard;
