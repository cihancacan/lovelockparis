'use client';

// Force le rendu dynamique pour éviter les erreurs Vercel
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, ShieldCheck, Loader2, TrendingUp, ArrowLeft, Check, 
  Wallet, Info, Tag, AlertCircle 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

type UserLock = {
  id: number;
  zone: string;
  skin: string | null;
  content_text: string;
  status: string;
  price: number; // Prix d'achat original
};

const getSkinImage = (skin: string | null) => `/images/skin-${skin ? skin.toLowerCase() : 'gold'}.png`;

function SellPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [userLocks, setUserLocks] = useState<UserLock[]>([]);
  const [selectedLockId, setSelectedLockId] = useState<number | null>(null);
  
  const [salePrice, setSalePrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const PLATFORM_COMMISSION = 0.20; // 20%

  useEffect(() => {
    // Petit délai pour l'auth
    const timer = setTimeout(() => {
        if (user) loadUserLocks();
        else router.push('/purchase');
    }, 500);
    return () => clearTimeout(timer);
  }, [user, router]);

  const loadUserLocks = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('locks')
        .select('*')
        .eq('owner_id', user.id)
        .eq('status', 'Active') // On ne vend que les actifs
        .order('created_at', { ascending: false });

      if (error) throw error;
      const safeData = data || [];
      setUserLocks(safeData);
      
      // Auto-select le premier
      if (safeData.length > 0) {
        setSelectedLockId(safeData[0].id);
        setSalePrice(((safeData[0].price || 29.99) * 2).toFixed(2)); // x2 par défaut
      }
    } catch (error) {
      console.error(error);
      toast.error('Error loading assets');
    } finally {
      setLoading(false);
    }
  };

  const handleListForSale = async () => {
    if (!user || !selectedLockId) return toast.error('Please select a lock');
    
    const price = parseFloat(salePrice);
    if (isNaN(price) || price < 29.99) return toast.error('Minimum sale price is $29.99');

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('locks')
        .update({
          status: 'For_Sale',
          resale_price: price,
          sale_description: description.trim() || null
        })
        .eq('id', selectedLockId)
        .eq('owner_id', user.id);

      if (error) throw error;

      toast.success('Lock listed successfully!');
      // Redirection vers Boost pour l'upsell
      router.push(`/boost?lock_id=${selectedLockId}`);

    } catch (error) {
      toast.error('Error listing lock');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedLock = userLocks.find(l => l.id === selectedLockId);
  const priceNum = parseFloat(salePrice) || 0;
  const commission = priceNum * PLATFORM_COMMISSION;
  const earnings = priceNum - commission;

  // Calcul du ROI (Retour sur investissement)
  const originalPrice = selectedLock?.price || 29.99;
  const roi = ((earnings - originalPrice) / originalPrice) * 100;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-emerald-500 h-10 w-10"/></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* HEADER RETOUR (Sombre) */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-4 sticky top-0 z-20">
        <div className="container mx-auto max-w-6xl flex items-center gap-4 text-white">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-white/10 text-slate-300 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <DollarSign className="text-emerald-500 h-5 w-5"/> Sell Your Asset
          </h1>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="bg-slate-900 text-white pb-12 pt-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="bg-emerald-600 mb-4 hover:bg-emerald-500 border-0">MARKETPLACE SELLER</Badge>
          <h2 className="text-3xl md:text-5xl font-black mb-4">Turn Your Lock Into <span className="text-emerald-400">Profit</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            List your digital asset on the marketplace. With 85k+ collectors, rare numbers sell for up to <strong>100x</strong> their value.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-6xl -mt-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* COLONNE GAUCHE : SÉLECTION (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. SELECT LOCK */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
                <span className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Select Asset to Sell
              </h3>
              
              {userLocks.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <p className="text-slate-400 mb-4">You have no active locks available for sale.</p>
                  <Button onClick={() => router.push('/purchase')}>Buy Your First Asset</Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {userLocks.map(lock => (
                    <div 
                      key={lock.id}
                      onClick={() => { setSelectedLockId(lock.id); setSalePrice((lock.price * 2).toFixed(2)); }}
                      className={`
                        relative group cursor-pointer rounded-xl border-2 transition-all overflow-hidden p-3 text-center
                        ${selectedLockId === lock.id 
                          ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-100 shadow-lg' 
                          : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-md'}
                      `}
                    >
                      {selectedLockId === lock.id && (
                        <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-sm"><Check size={12}/></div>
                      )}
                      
                      <div className="relative w-full aspect-square mb-3 bg-slate-50 rounded-lg flex items-center justify-center">
                          <Image src={getSkinImage(lock.skin)} alt="lock" width={80} height={80} className="object-contain drop-shadow-md group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="font-black text-slate-900 text-lg">#{lock.id}</div>
                      <div className="text-xs text-slate-500 font-medium uppercase mt-1">{lock.zone}</div>
                      <Badge variant="secondary" className="mt-2 text-[10px] bg-slate-100 text-slate-500 border border-slate-200">
                        Paid: ${lock.price}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. DESCRIPTION */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 opacity-90 hover:opacity-100 transition-opacity">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-3">
                 <span className="bg-slate-200 text-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                 Description (Optional)
              </h3>
              <Textarea 
                placeholder="Tell buyers why this lock is special (e.g. Rare number, Anniversary date...)" 
                className="resize-none bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

          </div>

          {/* COLONNE DROITE : PRIX & PROFIT (5 cols) */}
          <div className="lg:col-span-5">
            <Card className="sticky top-24 border-0 shadow-2xl ring-1 ring-slate-200 overflow-hidden">
              {/* Header Carte */}
              <div className="bg-slate-900 text-white p-6 pb-8">
                 <h2 className="text-xl font-bold flex items-center gap-2">
                   <Wallet className="text-emerald-400"/> Set Your Price
                 </h2>
                 <p className="text-slate-400 text-sm mt-1">Define the value of your asset.</p>
              </div>

              <CardContent className="p-6 -mt-4 bg-white rounded-t-2xl relative z-10">
                
                {/* Input Prix */}
                <div className="mb-6">
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-6 w-6"/>
                    <Input 
                      type="number" 
                      value={salePrice} 
                      onChange={e => setSalePrice(e.target.value)} 
                      className="pl-12 h-16 text-3xl font-black bg-slate-50 border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900"
                      placeholder="0.00"
                    />
                  </div>
                  
                  {/* Boutons Rapides */}
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {[2, 3, 5, 10].map(m => (
                       <button 
                         key={m}
                         onClick={() => setSalePrice((originalPrice * m).toFixed(2))}
                         className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-xs font-bold text-slate-600 transition-colors border border-slate-200"
                       >
                         x{m} ROI
                       </button>
                    ))}
                  </div>
                </div>

                {/* Calculateur Profit */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 space-y-4 shadow-inner">
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-500 font-medium">Sale Price</span>
                    <span className="font-bold text-slate-800 text-lg">${priceNum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-500 flex items-center gap-1"><Info size={12}/> Platform Fee (20%)</span>
                    <span className="text-red-500 font-medium">-${commission.toFixed(2)}</span>
                  </div>
                  
                  <div className="h-px bg-emerald-200/50 my-2"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-900 uppercase text-sm tracking-wide">Net Profit</span>
                    <span className="text-4xl font-black text-emerald-600 tracking-tight">
                      ${!isNaN(earnings) ? earnings.toFixed(2) : '0.00'}
                    </span>
                  </div>

                  {roi > 0 && (
                    <div className="flex justify-end">
                      <Badge className="bg-emerald-200 text-emerald-800 hover:bg-emerald-200 border-0">
                        <TrendingUp size={12} className="mr-1"/> +{roi.toFixed(0)}% ROI
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Warning prix bas */}
                {priceNum > 0 && priceNum < 29.99 && (
                   <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-2 border border-red-100">
                     <AlertCircle size={16}/> Minimum sale price is $29.99
                   </div>
                )}

                {/* Bouton Action */}
                <Button 
                  onClick={handleListForSale} 
                  disabled={submitting || !selectedLockId}
                  className="w-full bg-slate-900 hover:bg-emerald-600 h-14 text-lg font-bold shadow-xl transition-all mt-6 hover:scale-[1.02]"
                >
                  {submitting ? <Loader2 className="animate-spin"/> : <Tag className="mr-2 h-5 w-5"/>}
                  List Item on Market
                </Button>
                
                <p className="text-[10px] text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                  <ShieldCheck size={12}/> Secured by Smart Contract
                </p>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function SellPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-emerald-500"/></div>}>
      <SellPageContent />
    </Suspense>
  );
}
