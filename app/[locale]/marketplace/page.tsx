'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search, Crown, Sparkles, Trophy, ShoppingCart, 
  Loader2, DollarSign, Activity, Zap, ArrowRight, Eye, TrendingUp, Filter
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

// --- TYPES ---
type MarketLock = {
  id: number;
  zone: string;
  skin: string;
  price: number;
  views_count: number;
  boost_level: 'none' | 'basic' | 'premium' | 'vip' | 'golden';
  price_increase: number;
  viewers_now: number;
};

// --- HELPER IMAGE ---
const getSkinImage = (skin: string) => {
  // Fallback sécurisé : si skin est null, on met 'gold'
  const s = skin ? skin.toLowerCase() : 'gold';
  return `/images/skin-${s}.png`;
};

// --- COMPOSANT TICKER (Version Sans Crash) ---
const LiveTicker = () => {
  return (
    <div className="bg-black text-white py-1 border-b border-white/10 text-[10px] uppercase tracking-widest font-bold overflow-hidden">
      <div className="flex items-center gap-6 whitespace-nowrap px-4 overflow-x-auto no-scrollbar">
        <span className="text-emerald-400 flex gap-1 shrink-0"><Activity size={12}/> LIVE MARKET</span>
        <span className="shrink-0">🔥 #777 sold $12,500</span>
        <span className="text-white/20 shrink-0">|</span>
        <span className="shrink-0">💎 #1313 VIP Listed</span>
        <span className="text-white/20 shrink-0">|</span>
        <span className="text-amber-400 shrink-0">⚡ 542 Buyers Online</span>
        <span className="text-white/20 shrink-0">|</span>
        <span className="shrink-0">🚀 #2024 Offer Received</span>
        <span className="text-white/20 shrink-0">|</span>
        <span className="shrink-0 text-emerald-400">💰 Total Vol: $1.2M</span>
      </div>
    </div>
  );
};

function MarketplaceContent() {
  const router = useRouter();
  const { user } = useAuth();
  
  // États
  const [locks, setLocks] = useState<MarketLock[]>([]);
  const [vipLocks, setVipLocks] = useState<MarketLock[]>([]);
  const [filteredLocks, setFilteredLocks] = useState<MarketLock[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // Protection Hydration
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'trending' | 'price_low' | 'price_high'>('trending');
  
  const ITEMS_PER_PAGE = 60;

  // 1. Protection Anti-Crash (On attend que le navigateur soit prêt)
  useEffect(() => {
    setMounted(true);
    loadMarketplaceLocks();
  }, []);

  const loadMarketplaceLocks = async () => {
    try {
      const { data, error } = await supabase
        .from('locks')
        .select('*')
        .or('status.eq.For_Sale,status.eq.Reserved_Admin') 
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedLocks = (data || []).map(lock => {
        const isGolden = lock.status === 'Reserved_Admin';
        
        let finalPrice = isGolden ? lock.golden_asset_price : lock.resale_price;
        // Sécurité prix
        if (!finalPrice || isNaN(Number(finalPrice)) || Number(finalPrice) <= 0) {
            finalPrice = 29.99;
        }

        let boostLvl = lock.boost_level || 'none';
        if (isGolden) boostLvl = 'golden';

        // Calculs stables (basés sur ID)
        const viewers = (lock.id % 12) + 2; 

        return {
          id: lock.id,
          zone: lock.zone || 'Standard',
          skin: lock.skin || 'Gold',
          price: Number(finalPrice),
          views_count: (lock.views_count || 0) + 100,
          boost_level: boostLvl,
          price_increase: ((lock.id % 20) * 5) + 10,
          viewers_now: viewers,
          is_golden: isGolden
        };
      });

      // Séparation VIP (Top 4 chers ou boostés)
      const vips = formattedLocks
        .filter(l => l.boost_level === 'vip' || l.boost_level === 'golden' || l.price >= 500)
        .slice(0, 4);
      
      setVipLocks(vips);
      setLocks(formattedLocks);
      setFilteredLocks(formattedLocks);
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage
  useEffect(() => {
    if (!mounted || locks.length === 0) return;

    let result = [...locks];
    if (search) result = result.filter(l => l.id.toString().includes(search));
    
    if (sortBy === 'price_low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'trending') result.sort((a, b) => b.price - a.price); // Les plus chers d'abord pour le show

    setFilteredLocks(result);
    setCurrentPage(1);
  }, [search, sortBy, locks, mounted]);

  const handleQuickBuy = (lockId: number, price: number) => {
    if (!user) {
      if (typeof window !== 'undefined') sessionStorage.setItem('pendingBuy', JSON.stringify({ lockId, price }));
      router.push('/purchase');
      return;
    }
    router.push(`/checkout?lock_id=${lockId}&price=${price}&type=marketplace`);
  };

  // Pagination
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredLocks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLocks.length / ITEMS_PER_PAGE);

  // Écran de chargement initial
  if (!mounted || loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin h-10 w-10 text-emerald-500"/></div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      
      <LiveTicker />

      {/* --- SECTION 1 : VIP SHOWCASE (NOIR & LUXE) --- */}
      {vipLocks.length > 0 && (
        <section className="bg-slate-900 py-10 px-4 border-b border-slate-800">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-500 p-1.5 rounded text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                <Crown size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Premium & Rare Assets</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vipLocks.map(lock => (
                <div 
                  key={lock.id}
                  onClick={() => handleQuickBuy(lock.id, lock.price)}
                  className="relative group cursor-pointer bg-slate-800 rounded-xl border border-slate-700 hover:border-amber-500/50 transition-all overflow-hidden hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                >
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-transparent text-white text-[10px] font-bold px-3 py-1 z-10">VIP</div>
                  
                  <div className="p-4 flex flex-col items-center relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 z-0"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-amber-500/10 blur-3xl rounded-full group-hover:bg-amber-500/20 transition-all"></div>

                    <div className="relative z-10 w-24 h-24 mb-3 transition-transform duration-300 group-hover:scale-110">
                      <Image src={getSkinImage(lock.skin)} alt={lock.skin} fill className="object-contain drop-shadow-2xl" />
                    </div>

                    <div className="relative z-10 text-center w-full">
                      <div className="font-black text-2xl text-white mb-1">#{lock.id}</div>
                      <div className="text-amber-400 font-bold text-lg mb-2">${lock.price.toLocaleString()}</div>
                      <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-500 text-white border-0 font-bold h-8 text-xs uppercase tracking-wide">
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- SECTION 2 : LE MUR (THE WALL) --- */}
      <div className="container mx-auto px-2 md:px-4 py-8">
        
        {/* Barre d'outils */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 bg-white p-3 rounded-xl border border-slate-200 shadow-sm sticky top-20 z-30">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Search className="text-slate-400" size={18}/>
            <Input 
              placeholder="Search ID..." 
              className="border-none bg-transparent h-8 focus-visible:ring-0 p-0 text-base w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
             <Button onClick={() => setSortBy('trending')} variant={sortBy === 'trending' ? 'default' : 'ghost'} size="sm" className={`h-8 text-xs ${sortBy === 'trending' ? 'bg-slate-900 text-white' : ''}`}>Trending</Button>
             <Button onClick={() => setSortBy('price_low')} variant={sortBy === 'price_low' ? 'default' : 'ghost'} size="sm" className={`h-8 text-xs ${sortBy === 'price_low' ? 'bg-slate-900 text-white' : ''}`}>Lowest Price</Button>
             <Button onClick={() => router.push('/sell')} size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white ml-auto whitespace-nowrap">
                <DollarSign size={12} className="mr-1"/> Sell
             </Button>
          </div>
        </div>

        {/* LA GRILLE DENSE */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3">
          {currentItems.map((lock) => {
            const isVip = lock.boost_level === 'vip' || lock.boost_level === 'golden';
            const isPremium = lock.boost_level === 'premium';
            
            let borderClass = 'border-slate-200';
            if (isVip) borderClass = 'border-purple-400 ring-2 ring-purple-100';
            if (isPremium) borderClass = 'border-amber-400 ring-2 ring-amber-100';

            let bgClass = 'bg-white';
            if (isVip) bgClass = 'bg-gradient-to-b from-purple-50 to-white';

            return (
              <div 
                key={lock.id}
                onClick={() => handleQuickBuy(lock.id, lock.price)}
                className={`
                  relative group cursor-pointer rounded-xl border transition-all duration-200
                  hover:-translate-y-1 hover:shadow-xl overflow-hidden
                  ${borderClass} ${bgClass}
                `}
              >
                {/* Pastille Viewers */}
                <div className="absolute top-1 left-1 z-20 bg-black/60 backdrop-blur text-white text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Eye size={8} className="text-green-400"/> {lock.viewers_count}
                </div>

                {/* Badge Boost */}
                {(isVip || isPremium) && (
                  <div className={`absolute top-0 right-0 z-20 px-2 py-0.5 text-[8px] font-black text-white rounded-bl-lg ${isVip ? 'bg-purple-600' : 'bg-amber-500'}`}>
                    {isVip ? 'VIP' : 'PRO'}
                  </div>
                )}

                <div className="p-2 flex flex-col h-full">
                  <div className="relative w-full aspect-square mb-2 flex items-center justify-center">
                     <Image 
                       src={getSkinImage(lock.skin)} 
                       alt={lock.skin} 
                       width={80} height={80} 
                       className="object-contain w-3/4 h-3/4 group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
                     />
                  </div>

                  <div className="mt-auto text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-bold leading-none mb-0.5 truncate">
                      {lock.zone}
                    </div>
                    <div className="text-sm font-black text-slate-800 leading-none mb-1">
                      #{lock.id}
                    </div>
                    <div className={`text-sm font-bold leading-tight ${isVip ? 'text-purple-600' : 'text-emerald-600'}`}>
                      ${lock.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-10">
             <Button variant="outline" size="sm" onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo(0,0); }} disabled={currentPage === 1}>Précédent</Button>
             <span className="text-xs font-bold text-slate-500">Page {currentPage} / {totalPages}</span>
             <Button variant="outline" size="sm" onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0,0); }} disabled={currentPage === totalPages}>Suivant</Button>
          </div>
        )}

        {locks.length === 0 && (
            <div className="text-center py-20">
               <p className="text-slate-400">Marketplace is initializing...</p>
            </div>
        )}

      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-white" /></div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
