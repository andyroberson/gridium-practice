import { useState, useEffect } from "react";

const readingsUrl =
  "https://snapmeter.com/api/public/meters/2080448990211/readings?start=2023-09-01&end=2025-09-01";
const billsUrl =
  "https://snapmeter.com/api/public/services/2080448990210/bills?start=2023-09-01&end=2025-09-01";

// in production, we would want to hide this. Likely have it in env variables and pass through secure endpoint
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

//Ideally, we'd have a useFetch hook that took in the urls,
//but for this exercise, I'm keeping the energy-specific logic together for simplicity
export const useEnergyData = () => {
  const [readings, setReadings] = useState(null);
  const [bills, setBills] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { readings, bills, loading, error };
};
