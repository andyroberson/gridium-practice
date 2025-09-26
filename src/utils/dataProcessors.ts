interface BillAttributes {
  cost: number;
  start: string;
  end: string;
  use: number;
  peakDemand: number;
  demandUnit: string;
}

interface Bill {
  id: string;
  attributes: BillAttributes;
  type: string;
}

interface BillsData {
  data: Bill[];
}

interface BillMetrics {
  currentCost: number;
  costChange: number;
  billingPeriod: string;
}

interface MonthlyData {
  month: string;
  cost: number;
  usage: number;
  peakDemand: number;
}
interface ReadingsData {
  data: Array<{
    attributes: {
      readings: {
        kw: Record<string, number>;
      };
    };
  }>;
}

interface HourlyUsageData {
  hour: string;
  avgKw: number;
  count: number;
}

/**
 * Processes billing data to extract key metrics for the latest bill
 *
 * @param billsData - Raw billing data from API
 * @returns Object containing current cost, percentage change from previous month, and billing period
 *
 * Example output:
 * {
 *   currentCost: 3699.85,
 *   costChange: 23.15,
 *   billingPeriod: "9/21/2023 - 10/22/2023"
 * }
 */
export const getLatestBillMetrics = (
  billsData: BillsData | null
): BillMetrics | null => {
  if (!billsData?.data?.length) return null;

  const sortedBills = [...billsData.data].sort(
    (a, b) =>
      new Date(b.attributes.end).getTime() -
      new Date(a.attributes.end).getTime()
  );

  const latest = sortedBills[0];
  const previous = sortedBills[1];

  const costChange = previous
    ? ((latest.attributes.cost - previous.attributes.cost) /
        previous.attributes.cost) *
      100
    : 0;

  return {
    currentCost: latest.attributes.cost,
    costChange: costChange,
    billingPeriod: `${new Date(
      latest.attributes.start
    ).toLocaleDateString()} - ${new Date(
      latest.attributes.end
    ).toLocaleDateString()}`,
  };
};

/**
 * Transforms billing data into a format suitable for time-series charts
 *
 * @param billsData - Raw billing data from API
 * @returns Array of monthly data points sorted chronologically
 *
 * Example output:
 * [
 *   { month: "Sep 2023", cost: 3699.85, usage: 8576.55, peakDemand: 55.2 },
 *   { month: "Oct 2023", cost: 3204.12, usage: 7890.23, peakDemand: 48.7 },
 * ]
 */
export const getMonthlyBillData = (
  billsData: BillsData | null
): MonthlyData[] => {
  if (!billsData?.data?.length) return [];

  return billsData.data
    .sort(
      (a, b) =>
        new Date(a.attributes.start).getTime() -
        new Date(b.attributes.start).getTime()
    )
    .map((bill) => ({
      month: new Date(bill.attributes.start).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      cost: bill.attributes.cost,
      usage: bill.attributes.use,
      peakDemand: bill.attributes.peakDemand,
    }));
};

/**
 * Aggregates 15-minute electricity readings into average hourly usage patterns
 *
 * @param readingsData - Raw meter readings (15-min intervals) from API
 * @returns Array of 24 hourly averages showing typical daily usage pattern
 *
 * Example output:
 * [
 *   { hour: "12 AM", avgKw: 6.8, count: 12 },    // Low overnight usage
 *   { hour: "1 AM", avgKw: 7.1, count: 12 },
 *   { hour: "9 AM", avgKw: 14.2, count: 12 },    // Business hours ramp-up
 *   { hour: "2 PM", avgKw: 31.4, count: 12 },    // Peak afternoon usage
 *   { hour: "6 PM", avgKw: 8.3, count: 12 }      // Evening drop-off
 * ]
 */
export const getHourlyUsagePattern = (
  readingsData: ReadingsData | null
): HourlyUsageData[] => {
  if (!readingsData?.data?.[0]?.attributes?.readings?.kw) return [];

  const kwReadings = readingsData.data[0].attributes.readings.kw;
  const hourlyData: Record<number, { total: number; count: number }> = {};

  // Group readings by hour of day
  Object.entries(kwReadings).forEach(([timestamp, value]) => {
    const date = new Date(timestamp);
    const hour = date.getHours();

    if (!hourlyData[hour]) {
      hourlyData[hour] = { total: 0, count: 0 };
    }
    hourlyData[hour].total += value;
    hourlyData[hour].count += 1;
  });

  // Create array with all 24 hours
  return Array.from({ length: 24 }, (_, hour) => ({
    hour:
      hour === 0
        ? "12 AM"
        : hour < 12
        ? `${hour} AM`
        : hour === 12
        ? "12 PM"
        : `${hour - 12} PM`,
    avgKw: hourlyData[hour]
      ? hourlyData[hour].total / hourlyData[hour].count
      : 0,
    count: hourlyData[hour]?.count || 0,
  }));
};
