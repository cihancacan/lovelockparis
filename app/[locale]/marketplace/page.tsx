'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search, Crown, Sparkles, Target, Trophy, ShoppingCart, TrendingUp, 
  Loader2, DollarSign, Zap, Megaphone, ArrowRight, Activity
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

// --- COMPOSANT TICKER (BANDEAU DÉFILANT) ---
const LiveTicker = () => {
  return (
    <div className="bg-slate-900 text-white overflow-hidden py-2 relative border-b border-slate-800">
      <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
        <span className="flex items-center gap-2 text-xs font-mono text-emerald-400"><Activity size={12}/> MARKET LIVE</span>
        <span className="text-sm">🔥 Lock #777 sold for $12,500</span>
        <span className="text-slate-600">|</span>
        <span className="text-sm">💎 Lock #1313 received a VIP Boost</span>
        <span className="text-slate-600">|</span>
        <span className="text-sm">🚀 New listing: #2024 for $500</span>
        <span className="text-slate-600">|</span>
        <span className="text-sm">💰 User @Julie just cashed out $850</span>
        <span className="text-slate-600">|</span>
        <span className="text-sm">🔥 Lock #888 sold for $2,900</span>
        <span className="text-slate-600">|</span>
        <span className="text-sm">✨ 63 active collectors online</span>
      </div>
      {/* Styles pour l'animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

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

function MarketplaceContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [locks, setLocks] = useState<MarketLock[]>([]);
  
  const [featuredLocks, setFeaturedLocks] = useState<MarketLock[]>([]); 
  const [premiumLocks, setPremiumLocks] = useState<MarketLock[]>([]);
  const [basicLocks, setBasicLocks] = useState<MarketLock[]>([]);
  const [regularLocks, setRegularLocks] = useState<MarketLock[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'price_low' | 'price_high'>('trending');

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
        if (!finalPrice || finalPrice <= 0) finalPrice = 29.99;

        let boostLvl = lock.boost_level || 'none';
        if (isAdminLock(lock) && boostLvl === 'none') {
            boostLvl = finalPrice > 100 ? 'vip' : 'premium';
        }

        return {
          id: lock.id,
          zone: lock.zone,
          skin: lock.skin,
          content_text: isGolden ? '✨ Golden Asset' : lock.content_text,
          price: Number(finalPrice),
          views_count: lock.views_count || Math.floor(Math.random() * 500) + 50,
          boost_level: boostLvl,
          price_increase: Math.floor((lock.id % 100) * 3) + 10,
          is_golden: isGolden
        };
      });

      distributeLocks(formattedLocks);
      setLocks(formattedLocks);
    } catch (error) {
      console.error(error);
      toast.error('Error loading marketplace data');
    } finally {
      setLoading(false);
    }
  };

  const isAdminLock = (lock: any) => lock.status === 'Reserved_Admin';

  const distributeLocks = (allLocks: MarketLock[]) => {
    const featured = allLocks.filter(l => l.boost_level === 'vip' || l.boost_level === 'golden');
    const premium = allLocks.filter(l => l.boost_level === 'premium');
    const basic = allLocks.filter(l => l.boost_level === 'basic');
    const regular = allLocks.filter(l => (l.boost_level === 'none' || !l.boost_level) && l.boost_level !== 'golden');

    setFeaturedLocks(featured);
    setPremiumLocks(premium);
    setBasicLocks(basic);
    setRegularLocks(regular);
  };

  useEffect(() => {
    let filtered = [...locks];
    if (search) filtered = filtered.filter(l => l.id.toString().includes(search));
    if (sortBy === 'price_low') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price_high') filtered.sort((a, b) => b.price - a.price);
    distributeLocks(filtered);
  }, [search, sortBy, locks]);

  const handleQuickBuy = (lockId: number, price: number) => {
    if (!user) {
      sessionStorage.setItem('pendingBuy', JSON.stringify({ lockId, price }));
      router.push('/purchase');
      return;
    }
    router.push(`/checkout?lock_id=${lockId}&price=${price}&type=marketplace`);
  };

  const getBoostBadge = (level: string) => {
    if (level === 'golden') return <Badge className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 text-white border-none shadow-md animate-pulse"><Crown className="h-3 w-3 mr-1" /> GOLDEN ASSET</Badge>;
    if (level === 'vip') return <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"><Trophy className="h-3 w-3 mr-1" /> VIP</Badge>;
    if (level === 'premium') return <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white"><Crown className="h-3 w-3 mr-1" /> PREMIUM</Badge>;
    if (level === 'basic') return <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white"><Sparkles className="h-3 w-3 mr-1" /> BOOSTED</Badge>;
    return null;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-emerald-500"/></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. LIVE TICKER */}
      <LiveTicker />

      {/* 2. HERO + ACTIONS VENDEUR (LA ZONE QUE TU VOULAIS) */}
      <section className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-12">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Texte Hero */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-4">
                <Target className="h-3 w-3" /> LIVE MARKETPLACE
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Buy, Sell & Trade <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Digital Love Locks</span>
              </h1>
              <p className="text-slate-500 text-lg">
                Join 85,000+ collectors. Secure a rare number or sell your asset for profit.
              </p>
            </div>

            {/* BOUTONS D'ACTION (LE COEUR DU SYSTÈME) */}
            <div className="flex flex-col gap-4 w-full md:w-auto">
              
              {/* Carte d'action : VENDRE */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-1 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
                <div className="bg-slate-900 rounded-xl p-5 flex items-center gap-4">
                  <div className="bg-emerald-500/20 p-3 rounded-full text-emerald-400 group-hover:scale-110 transition-transform">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Sell Your Lock</h3>
                    <p className="text-slate-400 text-xs">Turn your asset into cash</p>
                  </div>
                  <Button 
                    onClick={() => router.push('/sell')} 
                    className="ml-4 bg-white text-slate-900 hover:bg-slate-100 font-bold"
                  >
                    List Now <ArrowRight className="ml-2 h-4 w-4"/>
                  </Button>
                </div>
              </div>

              {/* Carte d'action : BOOSTER */}
              <div className="bg-white border-2 border-amber-100 p-1 rounded-2xl shadow-sm hover:border-amber-300 transition-all group cursor-pointer" onClick={() => router.push('/boost')}>
                <div className="rounded-xl p-4 flex items-center gap-4">
                  <div className="bg-amber-100 p-3 rounded-full text-amber-600 group-hover:rotate-12 transition-transform">
                    <Zap size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-slate-900 font-bold flex items-center gap-2">
                      Boost Visibility <Badge className="bg-amber-500 text-[10px] h-5">HOT</Badge>
                    </h3>
                    <p className="text-slate-500 text-xs">Sell 3x faster with ads</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Barre de recherche */}
          <div className="mt-10 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input 
                placeholder="Search by Lock ID (e.g. 777)..." 
                className="pl-12 h-12 text-lg bg-slate-50 border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. CONTENU PRINCIPAL */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        
        {/* VIP & GOLDEN SECTION */}
        {featuredLocks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-lg"><Trophy className="h-6 w-6 text-purple-600" /></div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Featured & Rare Assets</h2>
                  <p className="text-slate-500 text-sm">High visibility, high value.</p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {featuredLocks.map((lock) => (
                <Card key={lock.id} className={`border-2 shadow-xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer group ${lock.is_golden ? 'border-amber-400/50' : 'border-purple-200'}`}>
                  <div className={`p-2 text-center text-white text-xs font-bold tracking-widest ${lock.is_golden ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500' : 'bg-gradient-to-r from-purple-600 to-pink-600'}`}>
                    {lock.is_golden ? '👑 OFFICIAL GOLDEN ASSET' : 'VIP COLLECTION'}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-3xl font-black text-slate-900">#{lock.id}</div>
                      {getBoostBadge(lock.boost_level)}
                    </div>
                    
                    {/* Image visuelle (facultatif si tu as une image générée) */}
                    <div className="h-32 bg-slate-50 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                       <div className={`absolute inset-0 opacity-10 ${lock.is_golden ? 'bg-amber-500' : 'bg-purple-500'}`}></div>
                       <Lock size={48} className={lock.is_golden ? 'text-amber-500' : 'text-purple-500'} />
                    </div>

                    <div className="flex justify-between items-end mb-4">
                       <div>
                         <p className="text-xs text-slate-400 font-bold uppercase">Current Price</p>
                         <div className="text-3xl font-bold text-slate-900">${lock.price.toFixed(2)}</div>
                       </div>
                       <div className="text-right">
                         <div className="flex items-center gap-1 text-sm text-emerald-600 font-bold">
                           <TrendingUp className="h-4 w-4" /> +{lock.price_increase}%
                         </div>
                         <p className="text-[10px] text-slate-400">Growth (24h)</p>
                       </div>
                    </div>

                    <Button onClick={() => handleQuickBuy(lock.id, lock.price)} className={`w-full h-12 font-bold text-lg shadow-lg ${lock.is_golden ? 'bg-amber-600 hover:bg-amber-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* REGULAR LISTINGS (Grille compacte) */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Latest User Listings</h2>
            <div className="flex gap-2">
              <Button variant={sortBy === 'price_low' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('price_low')}>Price: Low to High</Button>
              <Button variant={sortBy === 'price_high' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('price_high')}>Price: High to Low</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...premiumLocks, ...basicLocks, ...regularLocks].map((lock) => (
              <Card key={lock.id} className="hover:shadow-lg transition-all border-slate-200 group cursor-pointer" onClick={() => handleQuickBuy(lock.id, lock.price)}>
                <CardContent className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-slate-700">#{lock.id}</span>
                    {lock.boost_level !== 'none' && <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />}
                  </div>
                  
                  <div className="aspect-square bg-slate-50 rounded-lg mb-3 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                    <Lock className="text-slate-300" size={24}/>
                  </div>

                  <div className="text-lg font-bold text-slate-900 mb-1">${lock.price.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-400 mb-3">{lock.zone}</div>
                  
                  <Button size="sm" className="w-full text-xs bg-white border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors">
                    Buy
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {locks.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
               <Megaphone className="h-10 w-10 text-slate-300 mx-auto mb-2"/>
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
