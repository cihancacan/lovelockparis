'use client';

// Force le rendu dynamique pour éviter les erreurs Vercel
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search, Crown, Sparkles, Trophy, ShoppingCart, 
  Loader2, DollarSign, Activity, Zap, ArrowLeft, ChevronLeft, ChevronRight, ArrowRight, Eye, TrendingUp, BarChart3, Globe, Rocket, Flame
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
  is_golden: boolean;
};

// --- GÉNÉRATION DES FAUSSES DONNÉES DU TICKER (40 items) ---
const FAKE_TRANSACTIONS = Array.from({ length: 40 }).map((_, i) => {
  const id = Math.floor(Math.random() * 900000) + 100000; // ID élevé pour ne pas conflit
  const price = Math.floor(Math.random() * (5000 - 450) + 450); // Entre 450 et 5000
  const actions = ['sold for', 'bid placed', 'listed for'];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const icons = ['🔥', '💰', '🚀', '💎'];
  const icon = icons[Math.floor(Math.random() * icons.length)];
  
  return { id, price, action, icon };
});

// --- HELPER IMAGE ---
const getSkinImage = (skin: string | null) => {
  const s = skin ? skin.toLowerCase() : 'gold';
  return `/images/skin-${s}.png`;
};

// --- COMPOSANT TICKER ULTRA RAPIDE ---
const LiveTicker = () => {
  return (
    <div className="bg-black text-white py-2 border-b border-white/10 text-xs font-mono font-bold overflow-hidden relative z-50">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; width: fit-content; animation: marquee 60s linear infinite; } /* Vitesse augmentée */
      `}} />
      
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap px-4">
        {/* On double la liste pour la boucle infinie */}
        {[...FAKE_TRANSACTIONS, ...FAKE_TRANSACTIONS].map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-slate-300">
            <span className="text-lg">{t.icon}</span>
            <span>Lock <span className="text-white">#{t.id}</span> {t.action} <span className="text-emerald-400">${t.price.toLocaleString()}</span></span>
            <span className="text-slate-700 ml-6">|</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPOSANT MARKET PULSE DYNAMIQUE ---
const MarketPulse = () => {
  const [buyers, setBuyers] = useState(84);

  // Augmente les acheteurs toutes les 3 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setBuyers(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 mt-6">
      <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-slate-700/50 flex items-center justify-between shadow-lg">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Live Buyers</div>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            {buyers}
          </div>
        </div>
        <UsersIcon className="text-emerald-500/20" size={32} />
      </div>

      <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-slate-700/50 flex items-center justify-between shadow-lg">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">24h Volume</div>
          <div className="text-2xl font-black text-emerald-400">$380,000</div>
        </div>
        <BarChart3 className="text-emerald-500/20" size={32} />
      </div>

      <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-slate-700/50 flex items-center justify-between shadow-lg">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Floor Price</div>
          <div className="text-2xl font-black text-white">$29.99</div>
        </div>
        <TrendingUp className="text-blue-500/20" size={32} />
      </div>

      <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-slate-700/50 flex items-center justify-between shadow-lg">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Trades</div>
          <div className="text-2xl font-black text-white">12.4K</div>
        </div>
        <Activity className="text-purple-500/20" size={32} />
      </div>
    </div>
  );
};

// Icônes helper
const UsersIcon = ({className, size}: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

function MarketplaceContent() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [locks, setLocks] = useState<MarketLock[]>([]);
  const [vipLocks, setVipLocks] = useState<MarketLock[]>([]);
  const [filteredLocks, setFilteredLocks] = useState<MarketLock[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'trending' | 'price_low' | 'price_high'>('trending');
  
  const ITEMS_PER_PAGE = 60;

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
        if (!finalPrice || isNaN(Number(finalPrice)) || Number(finalPrice) <= 0) finalPrice = 29.99;

        let boostLvl = lock.boost_level || 'none';
        if (isGolden) boostLvl = 'golden';

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
          is_golden: isGolden,
          content_text: ''
        };
      });

      // Top 10 VIP
      const vips = formattedLocks
        .filter(l => l.boost_level === 'vip' || l.boost_level === 'golden' || l.price >= 500)
        .slice(0, 10);
      
      setVipLocks(vips);
      setLocks(formattedLocks);
      setFilteredLocks(formattedLocks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted || locks.length === 0) return;
    let result = [...locks];

    if (search) result = result.filter(l => l.id.toString().includes(search));
    
    if (sortBy === 'price_low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'trending') result.sort((a, b) => b.price - a.price);

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

  const getBoostBadge = (level: string) => {
    if (level === 'golden') return <Badge className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 text-white border-none shadow-md animate-pulse"><Crown className="h-3 w-3 mr-1" /> GOLDEN</Badge>;
    if (level === 'vip') return <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"><Trophy className="h-3 w-3 mr-1" /> VIP</Badge>;
    if (level === 'premium') return <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white"><Crown className="h-3 w-3 mr-1" /> PREMIUM</Badge>;
    if (level === 'basic') return <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white"><Sparkles className="h-3 w-3 mr-1" /> BOOSTED</Badge>;
    return null;
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredLocks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLocks.length / ITEMS_PER_PAGE);

  if (!mounted || loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin h-10 w-10 text-emerald-500"/></div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      
      <LiveTicker />

      {/* --- SECTION HERO (NOIR) --- */}
      <section className="bg-slate-900 py-12 px-4 border-b border-slate-800 relative overflow-hidden">
        {/* Fond animé subtil */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_70%)] z-0 pointer-events-none"></div>

        <div className="container mx-auto relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/50 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
                <Activity className="h-3 w-3 animate-pulse" /> Live Trading Floor
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
                Market<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Place</span>
              </h1>
              <p className="text-slate-400 mt-2 text-lg">The world's first digital love lock exchange.</p>
            </div>
            
            {/* BOUTONS D'ACTION ATTRACTIFS */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Button 
                onClick={() => router.push('/sell')} 
                className="group relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white font-black h-16 px-8 text-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-emerald-400/20 rounded-2xl transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full"><DollarSign className="h-6 w-6"/></div>
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-normal opacity-80 leading-none mb-1">Make Money</div>
                    <div className="leading-none">SELL LOCK</div>
                  </div>
                </div>
              </Button>

              <Button 
                onClick={() => router.push('/boost')} 
                className="group relative overflow-hidden bg-amber-600 hover:bg-amber-500 text-white font-black h-16 px-8 text-xl shadow-[0_0_30px_rgba(245,158,11,0.3)] border border-amber-400/20 rounded-2xl transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full"><Zap className="h-6 w-6"/></div>
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-normal opacity-80 leading-none mb-1">Get Views</div>
                    <div className="leading-none">BOOST</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* STATS DYNAMIQUES */}
          <MarketPulse />

          <div className="flex flex-col md:flex-row gap-3 bg-slate-800/50 p-2 rounded-xl border border-slate-700 mt-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input 
                placeholder="Search Lock ID #..." 
                className="pl-10 h-11 bg-slate-900 border-slate-700 text-white focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
               <Button onClick={() => setSortBy('trending')} size="sm" className={`h-11 ${sortBy === 'trending' ? 'bg-slate-700 text-white ring-1 ring-emerald-500' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>Trending</Button>
               <Button onClick={() => setSortBy('price_low')} size="sm" className={`h-11 ${sortBy === 'price_low' ? 'bg-slate-700 text-white ring-1 ring-emerald-500' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>Low $</Button>
               <Button onClick={() => setSortBy('price_high')} size="sm" className={`h-11 ${sortBy === 'price_high' ? 'bg-slate-700 text-white ring-1 ring-emerald-500' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>High $</Button>
            </div>
          </div>

        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">
        
        {/* --- VIP SECTION (10 ITEMS) --- */}
        {vipLocks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-purple-600 text-white p-2 rounded-lg shadow-lg shadow-purple-500/30"><Trophy className="h-6 w-6" /></div>
              <h2 className="text-2xl font-black text-slate-900 uppercase">Featured & Rare Assets</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {vipLocks.map((lock) => (
                <Card key={lock.id} onClick={() => handleQuickBuy(lock.id, lock.price)} className={`cursor-pointer border-2 shadow-xl overflow-hidden hover:scale-[1.02] transition-transform group ${lock.is_golden ? 'border-amber-400/50' : 'border-purple-200'}`}>
                  <div className={`p-1 text-center text-white text-[10px] font-bold tracking-widest ${lock.is_golden ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500' : 'bg-gradient-to-r from-purple-600 to-pink-600'}`}>
                    {lock.is_golden ? '👑 GOLDEN' : 'VIP'}
                  </div>
                  <CardContent className="p-4 bg-gradient-to-b from-white to-slate-50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-xl font-black text-slate-900">#{lock.id}</div>
                      {getBoostBadge(lock.boost_level)}
                    </div>
                    
                    <div className="h-24 bg-white rounded-lg mb-4 flex items-center justify-center relative overflow-hidden border border-slate-100 shadow-inner">
                       <Image src={getSkinImage(lock.skin)} alt="lock" width={60} height={60} className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    <div className="flex justify-between items-end mb-2">
                       <div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">Price</p>
                         <div className="text-2xl font-bold text-slate-900">${lock.price.toLocaleString()}</div>
                       </div>
                       <div className="text-right text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">
                         <TrendingUp className="h-3 w-3 inline mr-1" />+{lock.price_increase}%
                       </div>
                    </div>
                    <Button size="sm" className={`w-full font-bold shadow-lg h-9 text-xs ${lock.is_golden ? 'bg-amber-600 hover:bg-amber-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* --- LE MUR (GRILLE DENSE 5 COLONNES) --- */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Latest Listings</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {currentItems.map((lock) => {
              const isVip = lock.boost_level === 'vip' || lock.boost_level === 'golden';
              const isPremium = lock.boost_level === 'premium';
              
              let borderClass = 'border-slate-200';
              if (isVip) borderClass = 'border-purple-300 ring-1 ring-purple-100';
              else if (isPremium) borderClass = 'border-amber-300 ring-1 ring-amber-100';

              return (
                <div key={lock.id} onClick={() => handleQuickBuy(lock.id, lock.price)} className={`relative group cursor-pointer rounded-xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg overflow-hidden bg-white ${borderClass}`}>
                  {isVip && <div className="absolute top-0 right-0 z-20 px-2 py-0.5 text-[8px] font-black text-white rounded-bl-lg bg-purple-600">VIP</div>}
                  
                  <div className="p-3 flex flex-col h-full items-center text-center">
                    <div className="relative w-16 h-16 mb-2">
                       <Image src={getSkinImage(lock.skin)} alt={lock.skin} fill className="object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
                    </div>
                    <div className="w-full mt-auto">
                      <div className="text-[9px] text-slate-400 uppercase font-bold leading-none mb-1 truncate">{lock.zone}</div>
                      <div className="text-xs font-black text-slate-800 leading-none mb-1">#{lock.id}</div>
                      <div className={`text-sm font-bold ${isVip ? 'text-purple-600' : 'text-emerald-600'}`}>${lock.price.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 py-10">
              <Button variant="outline" size="sm" onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo(0,0); }} disabled={currentPage === 1}><ArrowLeft className="h-4 w-4 mr-1" /> Prev</Button>
              <span className="text-xs font-bold text-slate-500">Page {currentPage} / {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0,0); }} disabled={currentPage === totalPages}>Next <ArrowRight className="h-4 w-4 ml-1" /></Button>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-white" /></div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
