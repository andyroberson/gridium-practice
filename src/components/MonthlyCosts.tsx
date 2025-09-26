import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import type { BillsData } from "../utils/dataProcessors";

interface MonthlyCostsProps {
  bills: BillsData | null;
}

const MonthlyCosts: React.FC<MonthlyCostsProps> = ({ bills }) => {
  const [selectedYear, setSelectedYear] = useState<string>("");

  // Derive chart data grouped by year
  const { years, monthlyData } = useMemo(() => {
    if (!bills?.data) return { years: [], monthlyData: [] };

    const grouped: Record<
      string,
      { month: string; cost: number; sortKey: number }[]
    > = {};

    bills.data.forEach((bill) => {
      const endDate = new Date(bill.attributes.end);
      const year = String(endDate.getFullYear());
      const month = endDate.toLocaleString("default", { month: "short" });

      if (!grouped[year]) grouped[year] = [];
      grouped[year].push({
        month,
        cost: bill.attributes.cost,
        sortKey: endDate.getMonth(), // 0 for Jan, 11 for Dec
      });
    });

    const sortedYears = Object.keys(grouped).sort(
      (a, b) => Number(b) - Number(a)
    );
    const latestYear = sortedYears[0] ?? "";

    const data = grouped[selectedYear || latestYear] || [];
    // 🔑 sort by numeric month (0–11)
    data.sort((a, b) => a.sortKey - b.sortKey);

    return { years: sortedYears, monthlyData: data };
  }, [bills, selectedYear]);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Monthly Costs</h2>
        <select
          aria-label="Select year for monthly costs"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{
            padding: "4px 8px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "14px",
          }}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div style={{ color: "#aaa", height: "250px" }}>
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
    </>
  );
};

export default MonthlyCosts;
