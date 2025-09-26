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
