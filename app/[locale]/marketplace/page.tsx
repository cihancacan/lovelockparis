'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Filter,
  Search,
  TrendingUp,
  Crown,
  Zap,
  Clock,
  Heart,
  Lock,
  DollarSign,
  Eye,
  ShoppingCart,
  Star,
  TrendingDown,
  TrendingUp as TrendingUpIcon,
  Sparkles,
  Target,
  Medal,
  Trophy
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import Image from 'next/image';

type MarketLock = {
  id: number;
  zone: string;
  skin: string;
  content_text: string;
  golden_asset_price: number;
  status: 'For_Sale';
  views_count: number;
  owner_email: string;
  days_listed: number;
  price_increase: number;
  boost_level: 'none' | 'basic' | 'premium' | 'vip';
  boost_expires_at: string | null;
};

export default function MarketplacePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [locks, setLocks] = useState<MarketLock[]>([]);
  const [filteredLocks, setFilteredLocks] = useState<MarketLock[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'price_low' | 'price_high' | 'boosted'>('boosted');

  // État pour les sections
  const [featuredLocks, setFeaturedLocks] = useState<MarketLock[]>([]);
  const [premiumLocks, setPremiumLocks] = useState<MarketLock[]>([]);
  const [basicLocks, setBasicLocks] = useState<MarketLock[]>([]);
  const [regularLocks, setRegularLocks] = useState<MarketLock[]>([]);

  // ===== FONCTIONS HELPER =====
  const getBoostBadge = (level: string) => {
    switch (level) {
      case 'vip':
        return (
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <Trophy className="h-3 w-3 mr-1" /> VIP
          </Badge>
        );
      case 'premium':
        return (
          <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
            <Crown className="h-3 w-3 mr-1" /> PREMIUM
          </Badge>
        );
      case 'basic':
        return (
          <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <Sparkles className="h-3 w-3 mr-1" /> BOOSTED
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleQuickBuy = async (lockId: number, price: number) => {
    if (!user) {
      toast.error('Please login to purchase');
      router.push('/login');
      return;
    }

    router.push(`/checkout?lock_id=${lockId}&price=${price}&type=marketplace`);
  };

  const handleBoostLock = (lockId: number) => {
    router.push(`/boost/${lockId}`);
  };

  const loadMarketplaceLocks = async () => {
    setLoading(true);
    
    try {
      // Récupérer les cadenas en vente avec leurs boosts
      const { data, error } = await supabase
        .from('locks')
        .select(`
          id,
          zone,
          skin,
          content_text,
          golden_asset_price,
          status,
          views_count,
          created_at,
          boost_level,
          boost_expires_at,
          owner:owner_id (email)
        `)
        .eq('status', 'For_Sale')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedLocks = (data || []).map(lock => ({
        id: lock.id,
        zone: lock.zone,
        skin: lock.skin,
        content_text: lock.content_text,
        golden_asset_price: lock.golden_asset_price || 29.99,
        status: lock.status,
        views_count: lock.views_count || 0,
        owner_email: lock.owner?.email || 'Private',
        days_listed: Math.floor(Math.random() * 30) + 1,
        price_increase: Math.floor(Math.random() * 400) + 50,
        boost_level: lock.boost_level || 'none',
        boost_expires_at: lock.boost_expires_at
      }));

      setLocks(formattedLocks);
    } catch (error) {
      console.error('Error loading marketplace:', error);
      toast.error('Error loading marketplace data');
    } finally {
      setLoading(false);
    }
  };

  // ===== USEEFFECT =====
  useEffect(() => {
    loadMarketplaceLocks();
  }, []);

  useEffect(() => {
    if (locks.length === 0) return;

    // Filtrer par niveau de boost
    const featured = locks.filter(lock => lock.boost_level === 'vip');
    const premium = locks.filter(lock => lock.boost_level === 'premium');
    const basic = locks.filter(lock => lock.boost_level === 'basic');
    const regular = locks.filter(lock => lock.boost_level === 'none');

    // Trier chaque catégorie
    featured.sort((a, b) => b.views_count - a.views_count);
    premium.sort((a, b) => b.views_count - a.views_count);
    basic.sort((a, b) => b.views_count - a.views_count);
    regular.sort((a, b) => b.views_count - a.views_count);

    setFeaturedLocks(featured.slice(0, 3)); // Top 3 VIP
    setPremiumLocks(premium.slice(0, 7));   // Top 7 Premium
    setBasicLocks(basic.slice(0, 40));      // Top 40 Basic
    setRegularLocks(regular);               // Tous les autres
  }, [locks]);

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* ... reste du JSX ... */}
    </div>
  );
}
