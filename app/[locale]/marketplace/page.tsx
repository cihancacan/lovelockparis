'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search, Crown, Sparkles, Target, Trophy, ShoppingCart, TrendingUp, 
  Loader2, DollarSign, Activity, Zap, ArrowRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

// --- TYPES ---
type MarketLock = {
  id: number;
  zone: string;
  skin: string;
  content_text: string;
  price: number;
  views_count: number;
  boost_level: 'none' | 'basic' | 'premium' | 'vip' | 'golden';
  price_increase: number;
  is_golden: boolean;
};

// --- COMPOSANT TICKER ---
const LiveTicker = () => {
  return (
    <div className="bg-slate-900 text-white overflow-hidden py-2 border-b border-slate-800">
      <div className="flex items-center gap-8 whitespace-nowrap overflow-x-auto no-scrollbar px-4">
        <span className="flex items-center gap-2 text-xs font-mono text-emerald-400 shrink-0 animate-pulse"><Activity size={12}/> MARKET LIVE</span>
        <span className="text-sm shrink-0">🔥 Lock #777 sold for $12,500</span>
        <span className="text-slate-600 shrink-0">|</span>
        <span className="text-sm shrink-0">💎 VIP Spot taken by Lock #1313</span>
        <span className="text-slate-600 shrink-0">|</span>
        <span className="text-sm shrink-0">🚀 #2024 listed for $500</span>
        <span className="text-slate-600 shrink-0">|</span>
        <span className="text-sm shrink-0">✨ 142 active collectors</span>
      </div>
    </div>
  );
};

function MarketplaceContent() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Données brutes
  const [locks, setLocks] = useState<MarketLock[]>([]);
  
  // Segmentation
  const [vipLocks, setVipLocks] = useState<MarketLock[]>([]); 
  const [premiumLocks, setPremiumLocks] = useState<MarketLock[]>([]);
  const [generalFeedLocks, setGeneralFeedLocks] = useState<MarketLock[]>([]); // Basic + Regular
  
  // Pagination et Filtres
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    loadMarketplaceLocks();
  }, []);

  const loadMarketplaceLocks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('locks')
        .select('*')
        .or('status.eq.For_Sale,status.eq.Reserved_Admin') 
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedLocks = (data || []).map(lock => {
        const isGolden = lock.status === 'Reserved_Admin';
        
        // Prix
        let finalPrice = isGolden ? lock.golden_asset_price : lock.resale_price;
        if (!finalPrice || isNaN(finalPrice) || finalPrice <= 0) finalPrice = 29.99;

        // Boost
        let boostLvl = lock.boost_level || 'none';
        if (isGolden && boostLvl === 'none') {
            boostLvl = finalPrice > 100 ? 'vip' : 'premium';
        }

        // Stats simulées stables
        const stableViews = (lock.views_count || 0) + ((lock.id % 50) * 10);
        const stableIncrease = ((lock.id % 20) * 5) + 10;

        return {
          id: lock.id,
          zone: lock.zone || 'Standard',
          skin: lock.skin || 'Iron',
          content_text: isGolden ? '✨ Golden Asset' : (lock.content_text || 'Digital Lock'),
          price: Number(finalPrice),
          views_count: stableViews,
          boost_level: boostLvl,
          price_increase: stableIncrease,
          is_golden: isGolden
        };
      });

      distributeLocks(formattedLocks);
      setLocks(formattedLocks); // Garde une copie complète
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const distributeLocks = (allLocks: MarketLock[]) => {
    // 1. VIP & Golden (Top Tier - $99.99 Boost)
    const vip = allLocks.filter(l => l.boost_level === 'vip' || l.boost_level === 'golden');
    
    // 2. Premium (Mid Tier - $49.99 Boost)
    const premium = allLocks.filter(l => l.boost_level === 'premium');
    
    // 3. Basic & Regular (Feed - $19.99 Boost or None)
    const feed = allLocks.filter(l => l.boost_level === 'basic' || l.boost_level === 'none' || !l.boost_level);

    setVipLocks(vip);
    setPremiumLocks(premium);
    setGeneralFeedLocks(feed);
  };

  // Filtrage (Barre de recherche)
  useEffect(() => {
    if (!locks.length) return;
    let filtered = [...locks];
    
    if (search) {
      filtered = filtered.filter(l => l.id.toString().includes(search));
    }
    
    // Réinitialiser la page quand on cherche
    setCurrentPage(1);
    distributeLocks(filtered);
  }, [search, locks]);

  const handleQuickBuy = (lockId: number, price: number) => {
    if (!user) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pendingBuy', JSON.stringify({ lockId, price }));
      }
      router.push('/purchase');
      return;
    }
    router.push(`/checkout?lock_id=${lockId}&price=${price}&type=marketplace`);
  };

  // --- LOGIQUE PAGINATION ---
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentFeedItems = generalFeedLocks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(generalFeedLocks.length / ITEMS_PER_PAGE);

  const getBoostBadge = (level: string) => {
    if (level === 'golden' || level === 'vip') return <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"><Trophy className="h-3 w-3 mr-1" /> VIP FEATURED</Badge>;
    if (level === 'premium') return <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white"><Crown className="h-3 w-3 mr-1" /> TOP 10</Badge>;
    if (level === 'basic') return <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white"><Sparkles className="h-3 w-3 mr-1" /> BOOSTED</Badge>;
    return null;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-emerald-500"/></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      
      <LiveTicker />

      {/* HEADER ACTIONS */}
      <section className="bg-white border-b border-slate-200 py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">Marketplace</h1>
          <p className="text-slate-500 mb-8">Buy rare assets. Sell for profit. Collect history.</p>
          
          <div className="flex justify-center gap-4 mb-8">
             <Button onClick={() => router.push('/sell')} className="bg-slate-900 text-white hover:bg-slate-800 h-12 px-8 text-lg shadow-xl hover:-translate-y-1 transition-all">
                <DollarSign className="mr-2 h-5 w-5"/> Sell Lock
             </Button>
             <Button onClick={() => router.push('/boost')} variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50 h-12 px-8 text-lg border-2">
                <Zap className="mr-2 h-5 w-5"/> Boost Visibility
             </Button>
          </div>

          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input 
              placeholder="Search Lock ID #..." 
              className="pl-12 h-12 text-lg rounded-full bg-slate-50 border-slate-200 focus:ring-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">
        
        {/* SECTION 1: VIP (La vitrine - $99.99 Boost) */}
        {vipLocks.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-600 p-2 rounded-lg text-white shadow-lg shadow-purple-200">
                <Trophy size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">VIP Spotlight</h2>
                <p className="text-purple-600 text-sm font-bold">Homepage Feature • Max Visibility</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {vipLocks.map((lock) => (
                <Card key={lock.id} className="border-0 shadow-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity"/>
                  
                  {/* Bandeau VIP */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold py-2 px-4 flex justify-between items-center">
                    <span>VIP COLLECTION</span>
                    <TrendingUp size={14} />
                  </div>

                  <CardContent className="p-8 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-4xl font-black text-slate-900 tracking-tighter">#{lock.id}</span>
                      {getBoostBadge('vip')}
                    </div>

                    <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl mb-6 flex items-center justify-center border border-slate-100 group-hover:border-purple-200 transition-colors">
                      <Target size={64} className="text-purple-200 group-hover:text-purple-500 transition-colors duration-500" />
                    </div>

                    <div className="flex justify-between items-end">
                       <div>
                         <p className="text-xs text-slate-400 font-bold uppercase mb-1">Price</p>
                         <div className="text-3xl font-bold text-slate-900">${lock.price.toFixed(2)}</div>
                       </div>
                       <Button onClick={() => handleQuickBuy(lock.id, lock.price)} className="bg-slate-900 hover:bg-purple-600 text-white font-bold px-6 shadow-lg transition-colors">
                         Buy Now
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: PREMIUM (Le Top 10 - $49.99 Boost) */}
        {premiumLocks.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-500 p-2 rounded-lg text-white shadow-lg shadow-amber-200">
                <Crown size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Premium Trending</h2>
                <p className="text-amber-600 text-sm font-bold">Top 10 Fixed • High Demand</p>
              </div>
            </div>

            {/* Scroll Horizontal pour le Premium si beaucoup d'items, ou Grille */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {premiumLocks.map((lock) => (
                <Card key={lock.id} className="border-2 border-amber-100 hover:border-amber-400 transition-all cursor-pointer group" onClick={() => handleQuickBuy(lock.id, lock.price)}>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-xl text-slate-800">#{lock.id}</span>
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0">TOP 10</Badge>
                    </div>
                    
                    <div className="text-2xl font-bold text-slate-900 mb-1">${lock.price.toFixed(2)}</div>
                    <div className="text-xs text-slate-500 mb-4">{lock.views_count.toLocaleString()} views today</div>
                    
                    <Button size="sm" className="w-full bg-white border-2 border-slate-100 text-slate-900 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-all font-bold">
                      View Asset
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: THE FEED (Basic & Regular - Pagination) */}
        <section id="feed" className="scroll-mt-20">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg text-white">
                <ShoppingCart size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">All Listings</h2>
                <p className="text-slate-500 text-sm">Fresh market finds.</p>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
            {currentFeedItems.map((lock) => (
              <Card key={lock.id} className={`hover:shadow-lg transition-all cursor-pointer group ${lock.boost_level === 'basic' ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100'}`} onClick={() => handleQuickBuy(lock.id, lock.price)}>
                <CardContent className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-slate-700">#{lock.id}</span>
                    {lock.boost_level === 'basic' && <Sparkles className="h-4 w-4 text-blue-500 fill-blue-500 animate-pulse" />}
                  </div>
                  
                  <div className="aspect-square bg-slate-50 rounded-lg mb-3 flex items-center justify-center group-hover:bg-white transition-colors border border-slate-100">
                    <DollarSign className={lock.boost_level === 'basic' ? "text-blue-300" : "text-slate-200"} size={24}/>
                  </div>

                  <div className="text-lg font-bold text-slate-900 mb-1">${lock.price.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-400 mb-3">{lock.zone}</div>
                  
                  <Button size="sm" className={`w-full text-xs h-8 ${lock.boost_level === 'basic' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white'}`}>
                    Buy
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                   setCurrentPage(p => Math.max(1, p - 1));
                   document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Logique simple pour afficher les pages autour de la courante
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'ghost'}
                      className={currentPage === pageNum ? 'bg-slate-900 text-white' : 'text-slate-600'}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                   setCurrentPage(p => Math.min(totalPages, p + 1));
                   document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {locks.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
               <p className="text-slate-500 font-medium">Marketplace is quiet today.</p>
               <Button variant="link" onClick={() => router.push('/sell')} className="text-emerald-600">Be the first to list a lock!</Button>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
