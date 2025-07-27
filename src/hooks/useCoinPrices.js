import { useEffect, useState } from 'react';
import axios from 'axios';

const useCoinPrices = () => {
  const [coinPrices, setCoinPrices] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price',
          {
            params: {
              ids: 'bitcoin,ethereum,tether',
              vs_currencies: 'usd',
              include_24hr_change: 'true',
            },
          }
        );
        setCoinPrices(res.data);
      } catch (error) {
        console.error('Error fetching coin prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // actualiza cada 30s
    return () => clearInterval(interval);
  }, []);

  return coinPrices;
};

export default useCoinPrices;
