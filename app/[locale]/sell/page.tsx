'use client';

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
  Wallet, Info, Tag, AlertCircle, LogIn, Lock, Sparkles, Zap, BarChart3 
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
  price: number;
};

const getSkinImage = (skin: string | null) => `/images/skin-${skin ? skin.toLowerCase() : 'gold'}.png`;

// --- TICKER VENTE ---
const SellTicker = () => (
  <div className="bg-emerald-950/30 border-b border-emerald-500/20 py-2 overflow-hidden">
    <div className="flex items-center gap-8 whitespace-nowrap animate-marquee text-xs font-mono text-emerald-400">
       <span className="flex items-center gap-1"><TrendingUp size={12}/> MARKET UPTREND</span>
       <span>•</span>
       <span className="flex items-center gap-1"><DollarSign size={12}/> AVG SALE: $145</span>
       <span>•</span>
       <span className="flex items-center gap-1"><Zap size={12}/> FASTEST SALE: 4 MIN</span>
       <span>•</span>
       <span className="text-white">DEMAND IS HIGH FOR RARE NUMBERS</span>
    </div>
    <style jsx>{`
      .animate-marquee { animation: marquee 30s linear infinite; }
      @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
    `}</style>
  </div>
);

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
    if (user) {
        loadUserLocks();
    } else {
        setLoading(false); // On charge la page même sans user
    }
  }, [user]);

  const loadUserLocks = async () => {
    try {
      const { data, error } = await supabase
        .from('locks')
        .select('*')
        .eq('owner_id', user?.id)
        .eq('status', 'Active') 
        .order('created_at', { ascending: false });

      if (error) throw error;
      const safeData = data || [];
      setUserLocks(safeData);
      
      if (safeData.length > 0) {
        setSelectedLockId(safeData[0].id);
        setSalePrice(((safeData[0].price || 29.99) * 2).toFixed(2));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleListForSale = async () => {
    if (!user) return router.push('/purchase');
    if (!selectedLockId) return toast.error('Please select a lock');
    
    const price = parseFloat(salePrice);
    if (isNaN(price) || price < 29.99) return toast.error('Minimum sale price is $29.99');

    setSubmitting(true);
    try {
      const { error } = await supabase.from('locks').update({
          status: 'For_Sale',
          resale_price: price,
          sale_description: description.trim() || null
        }).eq('id', selectedLockId).eq('owner_id', user.id);

      if (error) throw error;
      toast.success('Asset Listed Successfully!');
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
  
  const originalPrice = selectedLock?.price || 29.99;
  const roi = ((earnings - originalPrice) / originalPrice) * 100;

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-emerald-500 h-10 w-10"/></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Header Retour */}
      <div className="bg-slate-900/50 backdrop-blur border-b border-slate-800 px-4 py-4 sticky top-0 z-30">
        <div className="container mx-auto max-w-6xl flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <DollarSign className="text-emerald-500 fill-emerald-500 h-5 w-5"/> Sell Asset
          </h1>
        </div>
      </div>

      <SellTicker />

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        
        {/* TITRE PUNCHY */}
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
                <BarChart3 size={12} className="animate-pulse"/> Current Floor Price: $29.99
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
                Turn Your Asset <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Into Profit.</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Set your price. We handle the secure transfer. <br/>
                <span className="text-white">Funds are sent instantly</span> to your wallet upon sale.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* GAUCHE : SÉLECTION (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. SELECT LOCK */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-3">
                <span className="bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-sm border border-slate-700">1</span>
                Select Asset to Sell
              </h3>
              
              {!user ? (
                // --- NON CONNECTÉ (Effet Coffre-fort) ---
                <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/50 flex flex-col items-center justify-center relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="bg-slate-800 p-4 rounded-full mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <Lock className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">My Portfolio Vault</h3>
                    <p className="text-slate-500 mb-6 text-sm">Login to access your digital assets.</p>
                    <Button onClick={() => router.push('/purchase')} className="bg-white text-black hover:bg-emerald-400 hover:text-black font-bold px-8">
                        <LogIn className="mr-2 h-4 w-4"/> Access Vault
                    </Button>
                </div>
              ) : userLocks.length === 0 ? (
                // --- CONNECTÉ MAIS RIEN ---
                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
                  <p className="text-slate-500 mb-4">You don't have any active locks to sell.</p>
                  <Button onClick={() => router.push('/purchase')} variant="outline" className="border-slate-700 text-white">Buy Your First Asset</Button>
                </div>
              ) : (
                // --- LISTE DES CADENAS ---
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {userLocks.map(lock => (
                    <div 
                      key={lock.id}
                      onClick={() => { setSelectedLockId(lock.id); setSalePrice((lock.price * 2).toFixed(2)); }}
                      className={`
                        relative group cursor-pointer rounded-xl border-2 transition-all overflow-hidden p-3 text-center
                        ${selectedLockId === lock.id 
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.02]' 
                          : 'border-slate-800 bg-slate-800/50 hover:border-slate-600'}
                      `}
                    >
                      {selectedLockId === lock.id && (
                        <div className="absolute top-2 right-2 bg-emerald-500 text-black rounded-full p-0.5"><Check size={12}/></div>
                      )}
                      
                      <div className="relative w-full aspect-square mb-3 flex items-center justify-center">
                          <Image src={getSkinImage(lock.skin)} alt="lock" width={80} height={80} className="object-contain drop-shadow-xl group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="font-black text-white text-lg">#{lock.id}</div>
                      <div className="text-[10px] text-slate-500 font-medium uppercase mt-1">{lock.zone}</div>
                      <Badge variant="outline" className="mt-2 text-[10px] border-slate-700 text-slate-400">
                        Paid: ${lock.price}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. DESCRIPTION */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                 <span className="bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-sm border border-slate-700">2</span>
                 Sales Pitch
              </h3>
              <Textarea 
                placeholder="Ex: 'Unique number 777', 'Anniversary date', 'Located near Eiffel Tower'..." 
                className="resize-none bg-slate-950 border-slate-800 focus:border-emerald-500 text-white placeholder:text-slate-600"
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

          </div>

          {/* COLONNE DROITE : SIMULATEUR & ACTION (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              
              {/* PREVIEW CARD */}
              <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                 <Card className="bg-slate-900 border-slate-800 relative z-10 overflow-hidden">
                    <div className="bg-black/30 p-3 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Marketplace Preview</span>
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded text-emerald-400 text-xs font-bold">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live
                        </div>
                    </div>
                    <CardContent className="p-6">
                        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xl relative overflow-hidden group/card">
                           <div className="flex justify-between items-center mb-4">
                              <span className="text-xl font-black text-slate-900">#{selectedLock ? selectedLock.id : '000'}</span>
                              <Sparkles size={16} className="text-amber-500 fill-amber-500"/>
                           </div>
                           <div className="h-28 flex items-center justify-center mb-4">
                              <Image 
                                src={getSkinImage(selectedLock?.skin || 'gold')} 
                                alt="lock" width={80} height={80} 
                                className="drop-shadow-lg object-contain group-hover/card:scale-110 transition-transform duration-300"
                              />
                           </div>
                           <div className="flex justify-between items-end">
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Buy Now</p>
                                <p className="text-2xl font-bold text-slate-900">${priceNum.toFixed(2)}</p>
                              </div>
                              <Button size="sm" className="h-8 text-xs font-bold bg-slate-900 text-white">Purchase</Button>
                           </div>
                        </div>
                    </CardContent>
                 </Card>
              </div>

              {/* CALCULATEUR */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                
                {/* Input Prix */}
                <div className="mb-6">
                  <Label className="text-slate-400 text-xs uppercase font-bold mb-2 block">Set Your Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-6 w-6"/>
                    <Input 
                      type="number" 
                      value={salePrice} 
                      onChange={e => setSalePrice(e.target.value)} 
                      className="pl-12 h-16 text-3xl font-black bg-slate-950 border-slate-700 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder:text-slate-700"
                      placeholder="0.00"
                    />
                  </div>
                  
                  {/* Boutons ROI */}
                  <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                    {[2, 3, 5, 10, 50].map(m => (
                       <button 
                         key={m}
                         onClick={() => selectedLock && setSalePrice((selectedLock.price * m).toFixed(2))}
                         className="px-3 py-1 bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-md text-xs font-bold text-slate-400 transition-colors border border-slate-700"
                       >
                         x{m} Multiplier
                       </button>
                    ))}
                  </div>
                </div>

                {/* Détail */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Platform Fee (20%)</span>
                    <span className="text-rose-500">-${commission.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white uppercase text-sm tracking-wide">Net Profit</span>
                    <span className="text-3xl font-black text-emerald-400 tracking-tight">
                      ${!isNaN(earnings) ? earnings.toFixed(2) : '0.00'}
                    </span>
                  </div>

                  {roi > 0 && (
                    <div className="flex justify-end">
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0 hover:bg-emerald-500/30">
                        <TrendingUp size={12} className="mr-1"/> +{roi.toFixed(0)}% ROI
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Bouton Action */}
                <Button 
                  onClick={handleListForSale} 
                  disabled={submitting}
                  className="w-full h-14 text-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] mt-6 rounded-xl"
                >
                  {submitting ? <Loader2 className="animate-spin"/> : user ? <div className="flex items-center gap-2"><Tag size={20}/> LIST ASSET</div> : <div className="flex items-center gap-2"><LogIn size={20}/> LOGIN TO SELL</div>}
                </Button>
                
                <p className="text-[10px] text-center text-slate-500 mt-4 flex items-center justify-center gap-1">
                  <ShieldCheck size={12}/> Secured by Smart Contract
                </p>

              </div>
            </div>
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
