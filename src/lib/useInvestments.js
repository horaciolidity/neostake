// lib/useInvestments.js
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useInvestments(userId) {
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .eq('claimed', false);

      if (!error) {
        const now = new Date();
        const updated = data.map(inv => {
          const elapsed = (now - new Date(inv.start_date)) / (1000 * 60 * 60 * 24);
          const totalDays = (new Date(inv.end_date) - new Date(inv.start_date)) / (1000 * 60 * 60 * 24);
          const progress = Math.min(elapsed / totalDays, 1);
          const earned = (inv.amount * inv.apy) * progress;
          return { ...inv, earned, progress };
        });

        setInvestments(updated);
      }
    };

    fetchData();
  }, [userId]);

  return investments;
}
