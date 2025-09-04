import { useEffect, useState } from "react";

const CACHE_KEY = "exchange_rate_usd_jpy";
const CACHE_TIME_KEY = "exchange_rate_timestamp";
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in ms

export function useExchangeRate() {
  const [rate, setRate] = useState<number | null>(null);
  const [loadingP, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cached value
        const cachedRate = localStorage.getItem(CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(CACHE_TIME_KEY);

        if (cachedRate && cachedTimestamp) {
          const isExpired = Date.now() - Number(cachedTimestamp) > CACHE_DURATION;

          if (!isExpired) {
            setRate(Number(cachedRate));
            setLoading(false);
            return; // ✅ Use cached value
          }
        }

        // Fetch from API if no cache or expired
        const res = await fetch(
          `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_wMqLhgvbowL2atZiZd2t7SPTzf2vqVtIHFaHEhh2&currencies=USD&base_currency=JPY`
        );

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        const jpyToUsd = data?.data?.USD;

        if (typeof jpyToUsd === "number") {
          setRate(jpyToUsd);

          // ✅ Cache the value and timestamp
          localStorage.setItem(CACHE_KEY, jpyToUsd.toString());
          localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
        } else {
          setError("JPY → USD conversion rate not found.");
          console.error("Unexpected API response:", data);
        }
      } catch (error: any) {
        setError(error.message);
        console.error("Failed to fetch exchange rate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, []);

  return { rate, loadingP, error };
}
