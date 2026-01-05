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

  // Fonctions helper - DÉFINIES AVANT LEUR UTILISATION
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Hero Marketplace */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-lg">
              <Target className="h-5 w-5" />
              SMART INVESTMENT PLATFORM
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Digital Assets <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Marketplace</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Buy, sell, and boost digital love locks. Premium placement starting at $19.99. Turn $29.99 into thousands.
            </p>
            
            {/* Boost Packages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <div className="text-sm text-slate-300 mb-2">BASIC BOOST</div>
                <div className="text-3xl font-bold text-white mb-2">$19.99</div>
                <div className="text-sm text-slate-300 mb-4">7 days • Top 50</div>
                <Button 
                  variant="outline" 
                  className="w-full border-white text-white hover:bg-white/10"
                  onClick={() => router.push('/boost')}
                >
                  <Sparkles className="h-4 w-4 mr-2" /> Boost Your Lock
                </Button>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm p-6 rounded-2xl border border-amber-500/30">
                <div className="text-sm text-amber-200 mb-2">PREMIUM BOOST</div>
                <div className="text-3xl font-bold text-white mb-2">$49.99</div>
                <div className="text-sm text-amber-200 mb-4">14 days • Top 10</div>
                <Button 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                  onClick={() => router.push('/boost')}
                >
                  <Crown className="h-4 w-4 mr-2" /> Get Premium
                </Button>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30">
                <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600">VIP FEATURED</Badge>
                <div className="text-3xl font-bold text-white mb-2">$99.99</div>
                <div className="text-sm text-purple-200 mb-4">30 days • Top 3</div>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  onClick={() => router.push('/boost')}
                >
                  <Trophy className="h-4 w-4 mr-2" /> VIP Placement
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Featured Locks (Top 3) */}
      {featuredLocks.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-purple-600" />
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">VIP Featured Locks</h2>
                  <p className="text-slate-600">Top 3 positions • 30-day placement</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                $99.99 Boost
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredLocks.map((lock, index) => (
                <Card key={lock.id} className="border-2 border-purple-200 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-xl font-bold text-purple-700">
                          #{lock.id}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Spot #{index + 1}</div>
                          <div className="text-xs text-slate-500">VIP Featured</div>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <Medal className="h-3 w-3 mr-1" /> TOP {index + 1}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm text-slate-500 mb-1">Asking Price</div>
                      <div className="text-2xl font-bold text-slate-900">
                        ${lock.golden_asset_price.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm text-slate-500 mb-1">Original Price</div>
                      <div className="text-lg line-through text-slate-400">$29.99</div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-6">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" /> {lock.views_count.toLocaleString()} views
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-emerald-600" /> +{lock.price_increase}%
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => handleQuickBuy(lock.id, lock.golden_asset_price)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" /> Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium Boosted Locks (Top 7-10) */}
      {premiumLocks.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Crown className="h-8 w-8 text-amber-600" />
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Premium Boosted Locks</h2>
                  <p className="text-slate-600">Top 10 positions • 14-day placement • $49.99 boost</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                7 SPOTS LEFT
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {premiumLocks.map((lock) => (
                <Card key={lock.id} className="border-2 border-amber-100 hover:border-amber-300 transition-all">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-bold text-lg text-slate-900">#{lock.id}</div>
                      {getBoostBadge(lock.boost_level)}
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm text-slate-500">Price</div>
                      <div className="text-xl font-bold text-slate-900">
                        ${lock.golden_asset_price.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span>{lock.views_count} views</span>
                      <span className="text-emerald-600 font-bold">+{lock.price_increase}%</span>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      onClick={() => handleQuickBuy(lock.id, lock.golden_asset_price)}
                    >
                      <ShoppingCart className="h-3 w-3 mr-2" /> Quick Buy
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Basic Boosted Locks (Top 11-50) */}
      {basicLocks.length > 0 && (
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-blue-600" />
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Boosted Locks</h2>
                  <p className="text-slate-600">Top 50 rotation • 7-day placement • Starting at $19.99</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push('/boost')}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Sparkles className="h-4 w-4 mr-2" /> Boost Your Lock
              </Button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {basicLocks.slice(0, 20).map((lock) => (
                <Card key={lock.id} className="border border-blue-100 hover:border-blue-300 transition-all">
                  <CardContent className="p-3">
                    <div className="text-center">
                      <div className="font-bold text-slate-900 mb-1">#{lock.id}</div>
                      <div className="text-sm font-bold text-blue-600 mb-2">
                        ${lock.golden_asset_price.toFixed(2)}
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="w-full text-xs"
                        onClick={() => handleQuickBuy(lock.id, lock.golden_asset_price)}
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {basicLocks.length > 20 && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline"
                  onClick={() => setBasicLocks([...basicLocks])}
                >
                  Show All {basicLocks.length} Boosted Locks
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Regular Locks (Non-boosted) */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All Available Locks</h2>
            <p className="text-slate-600">Starting from $29.99 • Boost to get featured</p>
          </div>
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search lock numbers..."
                className="pl-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'boosted' ? 'default' : 'outline'}
                onClick={() => setSortBy('boosted')}
              >
                <Sparkles className="h-4 w-4 mr-2" /> Boosted First
              </Button>
              <Button
                variant={sortBy === 'price_low' ? 'default' : 'outline'}
                onClick={() => setSortBy('price_low')}
              >
                <DollarSign className="h-4 w-4 mr-2" /> Price Low
              </Button>
            </div>
          </div>
          
          {/* Locks Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {regularLocks.slice(0, 48).map((lock) => (
              <Card key={lock.id} className="border border-slate-200 hover:border-slate-300 transition-all">
                <CardContent className="p-4 text-center">
                  <div className="font-bold text-slate-900 mb-2">#{lock.id}</div>
                  <div className="text-sm text-slate-600 mb-3">
                    ${lock.golden_asset_price.toFixed(2)}
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="w-full text-xs"
                    onClick={() => handleQuickBuy(lock.id, lock.golden_asset_price)}
                  >
                    <Eye className="h-3 w-3 mr-1" /> View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="w-full text-xs mt-2"
                    onClick={() => handleBoostLock(lock.id)}
                  >
                    <Sparkles className="h-3 w-3 mr-1" /> Boost
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Card className="inline-block border-2 border-dashed border-slate-300">
              <CardContent className="p-8">
                <Sparkles className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Get Featured Today!</h3>
                <p className="text-slate-600 mb-6 max-w-sm">
                  Boost your lock to the top of the marketplace. Get more views and higher sale prices.
                </p>
                <div className="flex gap-3">
                  <Button 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600"
                    onClick={() => router.push('/boost')}
                  >
                    <Sparkles className="h-4 w-4 mr-2" /> Boost from $19.99
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/sell')}
                  >
                    <DollarSign className="h-4 w-4 mr-2" /> Sell Your Lock
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
