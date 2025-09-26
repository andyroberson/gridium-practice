import { useState, useEffect } from "react";

const readingsUrl =
  "https://snapmeter.com/api/public/meters/2080448990211/readings?start=2023-09-01&end=2025-09-01";
const billsUrl =
  "https://snapmeter.com/api/public/services/2080448990210/bills?start=2023-09-01&end=2025-09-01";
const token = "4f981c43-bf28-404c-ba22-461b5979b359";

const fetchData = async (url: string) => {
  const res = await fetch(url, {
    headers: { Authorization: token },
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
};

export const useEnergyData = () => {
  const [readings, setReadings] = useState(null);
  const [bills, setBills] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [readingsData, billsData] = await Promise.all([
          fetchData(readingsUrl),
          fetchData(billsUrl),
        ]);

        setReadings(readingsData);
        setBills(billsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { readings, bills, loading, error };
};
