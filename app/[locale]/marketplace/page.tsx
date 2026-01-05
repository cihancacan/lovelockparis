'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Important pour les images des cadenas
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search, Crown, Sparkles, Target, Trophy, ShoppingCart, 
  Loader2, DollarSign, Activity, Zap, ArrowRight, ChevronLeft, ChevronRight, Filter
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
    <div className="bg-slate-900 text-white overflow-hidden py-1 border-b border-slate-800 text-xs">
      <div className="flex items-center gap-8 whitespace-nowrap overflow-x-auto no-scrollbar px-4">
        <span className="flex items-center gap-2 font-mono text-emerald-400 shrink-0 animate-pulse"><Activity size={10}/> LIVE</span>
        <span className="shrink-0">🔥 #777 sold $12,500</span>
        <span className="text-slate-700 shrink-0">|</span>
        <span className="shrink-0">💎 #1313 VIP Boost</span>
        <span className="text-slate-700 shrink-0">|</span>
        <span className="shrink-0">🚀 #2024 listed $500</span>
        <span className="text-slate-700 shrink-0">|</span>
        <span className="shrink-0">✨ 142 collectors</span>
      </div>
    </div>
  );
};

// Helper pour l'image du skin
const getSkinImage = (skin: string) => {
  const s = skin ? skin.toLowerCase() : 'gold';
  // Assure-toi que ces images existent dans public/images/
  return `/images/skin-${s}.png`;
};

function MarketplaceContent() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Données
  const [locks, setLocks] = useState<MarketLock[]>([]);
  const [filteredLocks, setFilteredLocks] = useState<MarketLock[]>([]);
  
  // Pagination et Filtres
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'trending' | 'price_low' | 'price_high'>('trending');
  
  // CONFIGURATION DEMANDÉE : 60 PAR PAGE
  const ITEMS_PER_PAGE = 60;

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
        
        let finalPrice = isGolden ? lock.golden_asset_price : lock.resale_price;
        if (!finalPrice || isNaN(finalPrice) || finalPrice <= 0) finalPrice = 29.99;

        let boostLvl = lock.boost_level || 'none';
        if (isGolden && boostLvl === 'none') {
            boostLvl = finalPrice > 100 ? 'vip' : 'premium';
        }

        const stableViews = (lock.views_count || 0) + ((lock.id % 50) * 10);
        const stableIncrease = ((lock.id % 20) * 5) + 10;

        return {
          id: lock.id,
          zone: lock.zone || 'Standard',
          skin: lock.skin || 'Gold', // Par défaut Gold si vide
          content_text: isGolden ? '✨ Golden Asset' : (lock.content_text || 'Digital Lock'),
          price: Number(finalPrice),
          views_count: stableViews,
          boost_level: boostLvl,
          price_increase: stableIncrease,
          is_golden: isGolden
        };
      });

      setLocks(formattedLocks);
      setFilteredLocks(formattedLocks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage et Tri
  useEffect(() => {
    let result = [...locks];
    
    if (search) {
      result = result.filter(l => l.id.toString().includes(search));
    }
    
    if (sortBy === 'price_low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'trending') result.sort((a, b) => {
       // Les boostés d'abord
       const scoreA = (a.boost_level === 'vip' ? 3 : a.boost_level === 'premium' ? 2 : 1);
       const scoreB = (b.boost_level === 'vip' ? 3 : b.boost_level === 'premium' ? 2 : 1);
       return scoreB - scoreA;
    });

    setFilteredLocks(result);
    setCurrentPage(1); // Reset page au filtre
  }, [search, sortBy, locks]);

  const handleQuickBuy = (lockId: number, price: number) => {
    if (!user) {
      if (typeof window !== 'undefined') sessionStorage.setItem('pendingBuy', JSON.stringify({ lockId, price }));
      router.push('/purchase');
      return;
    }
    router.push(`/checkout?lock_id=${lockId}&price=${price}&type=marketplace`);
  };

  // --- PAGINATION ---
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredLocks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLocks.length / ITEMS_PER_PAGE);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-emerald-500"/></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      
      <LiveTicker />

      {/* HEADER ACTIONS (Compact) */}
      <section className="bg-white border-b border-slate-200 py-6 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input 
                  placeholder="Search Lock ID..." 
                  className="pl-9 h-10 text-sm bg-slate-50 border-slate-200"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              {/* Boutons de Tri Compacts */}
              <div className="flex border rounded-md overflow-hidden shrink-0">
                <button onClick={() => setSortBy('price_low')} className={`px-3 py-2 text-xs font-bold ${sortBy === 'price_low' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>$↓</button>
                <button onClick={() => setSortBy('price_high')} className={`px-3 py-2 text-xs font-bold ${sortBy === 'price_high' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>$↑</button>
                <button onClick={() => setSortBy('trending')} className={`px-3 py-2 text-xs font-bold ${sortBy === 'trending' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}><Zap size={14}/></button>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
               <Button onClick={() => router.push('/sell')} size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <DollarSign className="mr-1 h-4 w-4"/> Sell
               </Button>
               <Button onClick={() => router.push('/boost')} size="sm" variant="outline" className="flex-1 border-amber-500 text-amber-600 hover:bg-amber-50">
                  <Zap className="mr-1 h-4 w-4"/> Boost
               </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-2 py-6">
        
        {/* GRILLE DENSE (3 par ligne mobile, 6 à 8 par ligne Desktop) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-4 mb-10">
          {currentItems.map((lock) => {
            const isBoosted = lock.boost_level !== 'none';
            const isVip = lock.boost_level === 'vip' || lock.boost_level === 'golden';

            return (
              <div 
                key={lock.id} 
                className={`
                  group relative bg-white rounded-xl border transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1
                  ${isVip ? 'border-amber-400 shadow-md ring-1 ring-amber-100' : 'border-slate-200'}
                  ${lock.boost_level === 'premium' ? 'border-purple-300' : ''}
                `}
                onClick={() => handleQuickBuy(lock.id, lock.price)}
              >
                {/* Badge Boost Flottant */}
                {isBoosted && (
                  <div className={`absolute top-1 right-1 z-10 rounded-full p-1 ${isVip ? 'bg-amber-500' : 'bg-blue-500'}`}>
                    {isVip ? <Crown size={10} className="text-white"/> : <Sparkles size={10} className="text-white"/>}
                  </div>
                )}

                <div className="p-2 md:p-3">
                  
                  {/* Image Cadenas (Zoom au survol) */}
                  <div className="aspect-square relative mb-2 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-slate-100/50" />
                    <Image 
                      src={getSkinImage(lock.skin)} 
                      alt={lock.skin}
                      width={80}
                      height={80}
                      className="object-contain w-[70%] h-[70%] drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Infos Compactes */}
                  <div className="text-center">
                    <div className="font-black text-slate-800 text-sm md:text-base leading-none mb-1">#{lock.id}</div>
                    
                    {/* Config (Zone/Skin) tronquée */}
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide truncate mb-1">
                      {lock.skin} • {lock.zone === 'Premium_Eiffel' ? 'Eiffel' : lock.zone === 'Sky_Balloon' ? 'Sky' : 'Bridge'}
                    </div>

                    {/* Prix */}
                    <div className={`text-sm md:text-lg font-bold leading-tight ${isVip ? 'text-amber-600' : 'text-slate-900'}`}>
                      ${lock.price.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Bouton d'achat (Apparaît au survol sur Desktop, toujours visible mais discret sur mobile) */}
                <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                  <Button size="sm" className="w-full h-8 text-xs bg-slate-900 text-white">Buy</Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLocks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400">No locks found matching your search.</p>
          </div>
        )}
        
        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pb-10">
            <Button variant="outline" size="icon" onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo(0,0); }} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm font-bold text-slate-600 px-4">
              Page {currentPage} / {totalPages}
            </span>

            <Button variant="outline" size="icon" onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0,0); }} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
