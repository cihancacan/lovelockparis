'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { GOLDEN_ASSET_IDS } from '@/lib/admin';
import { Lock } from 'lucide-react';

const TOTAL_LOCKS = 1000000;
const RESERVED_COUNT = GOLDEN_ASSET_IDS.length;

export function LockCounter() {
  const [occupiedCount, setOccupiedCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOccupiedCount = async () => {
      try {
        const { count, error } = await supabase
          .from('locks')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Active');

        if (error) throw error;
        setOccupiedCount(count || 0);
      } catch (error) {
        console.error('Error fetching lock count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOccupiedCount();
  }, []);

  const availableCount = TOTAL_LOCKS - RESERVED_COUNT - occupiedCount;

  return (
    <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-lg bg-zinc-900/80 border border-primary/30 backdrop-blur-sm">
      <Lock className="h-5 w-5 text-primary" />
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold text-primary">
          {loading ? '...' : availableCount.toLocaleString()}
        </span>
        <span className="text-sm text-muted-foreground">places restantes</span>
      </div>
    </div>
  );
}
