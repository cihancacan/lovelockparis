'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search, Crown, Sparkles, Target, Trophy, Eye, ShoppingCart, TrendingUp, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

type MarketLock = {
  id: number;
  zone: string;
  skin: string;
  content_text: string;
  price: number; // Prix final unifié
  views_count: number;
  boost_level: 'none' | 'basic' | 'premium' | 'vip';
  price_increase: number;
};

function MarketplaceContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [locks, setLocks] = useState<MarketLock[]>([]);
  
  // États pour les sections
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
      // On récupère TOUT : Les ventes Users + Les réserves Admin
      const { data, error } = await supabase
        .from('locks')
        .select('*')
        .or('status.eq.For_Sale,status.eq.Reserved_Admin') 
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedLocks = (data || []).map(lock => {
        const isAdminLock = lock.status === 'Reserved_Admin';
        
        // 1. Calcul du prix (On prend le bon champ selon le type)
        // Si Admin -> golden_asset_price, Si User -> resale_price
        let finalPrice = isAdminLock ? lock.golden_asset_price : lock.resale_price;
        
        // Sécurité : Si pas de prix, on met une valeur par défaut pour ne pas bloquer
        if (!finalPrice || finalPrice <= 0) finalPrice = 29.99;

        // 2. Niveau de boost (Les Admin Locks sont boostés par défaut pour être visibles)
        let boostLvl = lock.boost_level || 'none';
        if (isAdminLock && boostLvl === 'none') {
            // On booste artificiellement les cadenas admin pour qu'ils soient en haut
            boostLvl = finalPrice > 100 ? 'vip' : 'premium';
        }

        return {
          id: lock.id,
          zone: lock.zone,
          skin: lock.skin,
          // On affiche le vrai texte, ou un texte générique vendeur pour l'admin
          content_text: lock.content_text || 'Premium Selection', 
          price: Number(finalPrice), // On force le type Nombre
          views_count: lock.views_count || Math.floor(Math.random() * 500) + 50,
          boost_level: boostLvl,
          price_increase: Math.floor((lock.id % 100) * 3) + 10,
        };
      });

      // Tri initial
      distributeLocks(formattedLocks);
      setLocks(formattedLocks);
    } catch (error) {
      console.error('Error loading marketplace:', error);
      toast.error('Error loading marketplace data');
    } finally {
      setLoading(false);
    }
  };

  const distributeLocks = (allLocks: MarketLock[]) => {
    const featured = allLocks.filter(l => l.boost_level === 'vip');
    const premium = allLocks.filter(l => l.boost_level === 'premium');
    const basic = allLocks.filter(l => l.boost_level === 'basic');
    const regular = allLocks.filter(l => l.boost_level === 'none' || !l.boost_level);

    setFeaturedLocks(featured);
    setPremiumLocks(premium);
    setBasicLocks(basic);
    setRegularLocks(regular);
  };

  // Filtrage dynamique
  useEffect(() => {
    let filtered = [...locks];

    if (search) {
      filtered = filtered.filter(l => l.id.toString().includes(search));
    }

    if (sortBy === 'price_low') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price_high') filtered.sort((a, b) => b.price - a.price);
    
    distributeLocks(filtered);
  }, [search, sortBy, locks]);

  // --- FONCTION D'ACHAT CORRIGÉE ---
  const handleQuickBuy = (lockId: number, price: number) => {
    console.log("Tentative achat:", lockId, price);

    if (!user) {
      // On sauvegarde l'intention d'achat pour rediriger après login
      sessionStorage.setItem('pendingBuy', JSON.stringify({ lockId, price }));
      router.push('/purchase'); // Redirection vers Login
      return;
    }

    if (!price || isNaN(price)) {
      toast.error("Price error");
      return;
    }
    
    // Redirection vers le checkout avec les bons paramètres
    // Le type 'marketplace' gère le transfert de propriété
    const url = `/checkout?lock_id=${lockId}&price=${price}&type=marketplace`;
    router.push(url);
  };

  const getBoostBadge = (level: string) => {
    if (level === 'vip') return <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"><Trophy className="h-3 w-3 mr-1" /> VIP</Badge>;
    if (level === 'premium') return <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white"><Crown className="h-3 w-3 mr-1" /> PREMIUM</Badge>;
    if (level === 'basic') return <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white"><Sparkles className="h-3 w-3 mr-1" /> BOOSTED</Badge>;
    return null;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-emerald-500"/></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-full text-xs font-bold mb-6">
            <Target className="h-4 w-4" /> LIVE MARKETPLACE
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Digital Assets <span className="text-emerald-400">Marketplace</span></h1>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Buy exclusive numbers, invest in rare locks, and trade with collectors worldwide.
          </p>
          <div className="flex gap-4 justify-center max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input 
                placeholder="Search lock ID #..." 
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">
        
        {/* VIP SECTION (Mélange Admin & User) */}
        {featuredLocks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold">Featured Assets</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredLocks.map((lock) => (
                <Card key={lock.id} className="border-2 border-purple-200 shadow-xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 text-center text-white text-xs font-bold tracking-widest">
                    VIP COLLECTION
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-2xl font-bold text-slate-900">#{lock.id}</div>
                      {getBoostBadge(lock.boost_level)}
                    </div>
                    
                    <div className="text-sm text-slate-500 mb-2 line-clamp-1">"{lock.content_text}"</div>

                    <div className="text-3xl font-bold text-slate-900 mb-2">${lock.price.toFixed(2)}</div>
                    <div className="flex items-center gap-2 text-sm text-emerald-600 font-bold mb-6">
                      <TrendingUp className="h-4 w-4" /> +{lock.price_increase}% Value
                    </div>
                    <Button onClick={() => handleQuickBuy(lock.id, lock.price)} className="w-full bg-purple-600 hover:bg-purple-700">
                      <ShoppingCart className="h-4 w-4 mr-2" /> Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* REGULAR LISTINGS */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Latest Listings</h2>
            <div className="flex gap-2">
              <Button variant={sortBy === 'price_low' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('price_low')}>Price Low</Button>
              <Button variant={sortBy === 'price_high' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('price_high')}>Price High</Button>
            </div>
          </div>
          
          {regularLocks.length === 0 && basicLocks.length === 0 && featuredLocks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed">
              <p className="text-slate-500">No locks for sale at the moment.</p>
              <Button variant="link" onClick={() => router.push('/sell')}>Be the first to sell!</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...premiumLocks, ...basicLocks, ...regularLocks].map((lock) => (
                <Card key={lock.id} className="hover:shadow-md transition-all border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-slate-700">#{lock.id}</span>
                      {lock.boost_level !== 'none' && <Sparkles className="h-4 w-4 text-amber-500" />}
                    </div>
                    <div className="text-lg font-bold text-slate-900 mb-1">${lock.price.toFixed(2)}</div>
                    <div className="text-xs text-slate-400 mb-4">{lock.zone} • {lock.skin}</div>
                    <Button 
                      size="sm" 
                      className="w-full text-xs bg-slate-900 text-white hover:bg-slate-800"
                      onClick={() => handleQuickBuy(lock.id, lock.price)}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
