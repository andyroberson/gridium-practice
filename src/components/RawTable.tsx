import type { BillsData, ReadingsData } from "../utils/dataProcessors";

interface RawDataTableProps {
  bills: BillsData | null;
  readings: ReadingsData | null;
}

//Ideally, this would be a sortable table with pagination
//Could be nice to add some exports as well so users can download data they find relevant in PDF format
//For desktop, its ok to show side by side in current format, but I'd revisit that based on data in the table and what we want users to see. In mobile, I'd imagine a tab view to show one table or the other
const RawDataTable: React.FC<RawDataTableProps> = ({ bills, readings }) => {
  const recentBills =
    bills?.data
      ?.sort(
        (a, b) =>
          new Date(b.attributes.end).getTime() -
          new Date(a.attributes.end).getTime()
      ) // Sort by end date, newest first
      ?.slice(0, 10) || []; // Take top 10

  const sampleReadings = readings?.data?.[0]?.attributes?.readings?.kw
    ? Object.entries(readings.data[0].attributes.readings.kw).slice(0, 10)
    : [];

  //this ideally have no inline styles, have it in a table style file, probably
  return (
    <div className="card col-span-12">
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* Bills Table */}
        <div>
          <h3>Recent Bills</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Date
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Cost
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Peak kW
                </th>
              </tr>
            </thead>
            <tbody>
              {recentBills.map((bill, idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {new Date(bill.attributes.start).toLocaleDateString()}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    ${bill.attributes.cost.toLocaleString()}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {bill.attributes.peakDemand}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Readings Table */}
        <div>
          <h3>Sample Readings</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Time
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>kW</th>
              </tr>
            </thead>
            <tbody>
              {sampleReadings.map(([timestamp, value], idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {new Date(timestamp).toLocaleTimeString()}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {(value as number).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RawDataTable;
