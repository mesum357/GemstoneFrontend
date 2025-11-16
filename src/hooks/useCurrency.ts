import { useState, useEffect } from 'react';

interface CurrencyRate {
  rate: number;
  lastUpdated: number;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const CACHE_KEY = 'pkr_usd_rate';
const FALLBACK_RATE = 278.50; // Fallback rate if API fails

// Fetch real-time PKR to USD exchange rate
const fetchExchangeRate = async (): Promise<number> => {
  try {
    // Using exchangerate-api.com (free tier)
    // Alternative: You can use other APIs like fixer.io, currencyapi.com, etc.
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/PKR');
    
    if (response.ok) {
      const data = await response.json();
      const rate = data.rates?.USD;
      if (rate && typeof rate === 'number') {
        // Cache the rate
        const cached: CurrencyRate = {
          rate,
          lastUpdated: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
        return rate;
      }
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
  }

  // Try to use cached rate if available
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed: CurrencyRate = JSON.parse(cached);
      const age = Date.now() - parsed.lastUpdated;
      if (age < CACHE_DURATION * 2) { // Use cache up to 20 minutes old
        return parsed.rate;
      }
    }
  } catch (error) {
    console.error('Error reading cached rate:', error);
  }

  // Return fallback rate if all else fails
  return FALLBACK_RATE;
};

export const useCurrency = () => {
  const [exchangeRate, setExchangeRate] = useState<number>(FALLBACK_RATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExchangeRate = async () => {
      try {
        setLoading(true);
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed: CurrencyRate = JSON.parse(cached);
          const age = Date.now() - parsed.lastUpdated;
          
          if (age < CACHE_DURATION) {
            // Use cached rate if fresh
            setExchangeRate(parsed.rate);
            setLoading(false);
            // Fetch fresh rate in background
            fetchExchangeRate().then(setExchangeRate).catch(() => {});
            return;
          }
        }

        // Fetch fresh rate
        const rate = await fetchExchangeRate();
        setExchangeRate(rate);
      } catch (error) {
        console.error('Error loading exchange rate:', error);
        // Use fallback rate
        setExchangeRate(FALLBACK_RATE);
      } finally {
        setLoading(false);
      }
    };

    loadExchangeRate();

    // Refresh rate every 10 minutes
    const interval = setInterval(loadExchangeRate, CACHE_DURATION);
    return () => clearInterval(interval);
  }, []);

  const pkrToUsd = (pkrAmount: number): number => {
    // Exchange rate from API is 1 PKR = X USD (typically ~0.0036)
    // So to convert PKR to USD, we multiply
    // However, if rate is > 1, it means 1 USD = X PKR, so we divide
    if (exchangeRate > 1) {
      // Rate is USD to PKR (e.g., 278.50 means 1 USD = 278.50 PKR)
      return pkrAmount / exchangeRate;
    } else {
      // Rate is PKR to USD (e.g., 0.0036 means 1 PKR = 0.0036 USD)
      return pkrAmount * exchangeRate;
    }
  };

  const formatPKR = (amount: number): string => {
    return `PKR ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatUSD = (amount: number): string => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return {
    exchangeRate,
    loading,
    pkrToUsd,
    formatPKR,
    formatUSD,
  };
};

