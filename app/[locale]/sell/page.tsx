'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShieldCheck, Loader2, TrendingUp, ArrowLeft, Wallet, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

type UserLock = {
  id: number;
  zone: string;
  skin: string;
  content_text: string;
  status: string;
  price: number;
};

const getSkinImage = (skin: string) => `/images/skin-${skin ? skin.toLowerCase() : 'gold'}.png`;

function SellPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [userLocks, setUserLocks] = useState<UserLock[]>([]);
  const [selectedLockId, setSelectedLockId] = useState<number | null>(null);
  const [salePrice, setSalePrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [platformCommission] = useState(0.20); 

  useEffect(() => {
    if (user) loadUserLocks();
    else router.push('/purchase'); // Redirection si pas connecté
  }, [user]);

  const loadUserLocks = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('locks')
        .select('*')
        .eq('owner_id', user.id)
        .eq('status', 'Active') 
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserLocks(data || []);
      
      // Auto-select premier lock si dispo
      if (data && data.length > 0) {
        setSelectedLockId(data[0].id);
        setSalePrice((data[0].price * 2).toFixed(2));
      }
    } catch (error) {
      console.error(error);
      toast.error('Error loading your locks');
    }
  };

  const handleListForSale = async () => {
    if (!user || !selectedLockId) {
      toast.error('Please select a lock');
      return;
    }

    const price = parseFloat(salePrice);
    if (isNaN(price) || price < 29.99) {
      toast.error('Minimum sale price is $29.99');
      return;
    }

    setLoading(true);

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
      
      // Redirection intelligente : Proposer le Boost après la mise en vente
      router.push(`/boost?lock_id=${selectedLockId}`);

    } catch (error) {
      console.error(error);
      toast.error('Error listing lock');
    } finally {
      setLoading(false);
    }
  };

  const earnings = parseFloat(salePrice) * (1 - platformCommission);
  const selectedLock = userLocks.find(l => l.id === selectedLockId);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Header Retour */}
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-20">
        <div className="container mx-auto max-w-5xl flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-lg">Sell Asset</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* COLONNE GAUCHE : SÉLECTION */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                Select Lock to Sell
              </h2>
              
              {userLocks.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed">
                  <p className="text-slate-400 mb-4">You don't have any active locks to sell.</p>
                  <Button onClick={() => router.push('/purchase')}>Buy a Lock</Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto p-1">
                  {userLocks.map(lock => (
                    <div 
                      key={lock.id}
                      onClick={() => setSelectedLockId(lock.id)}
                      className={`
                        relative group cursor-pointer rounded-xl border-2 transition-all overflow-hidden
                        ${selectedLockId === lock.id ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-200' : 'border-slate-200 bg-white hover:border-emerald-300'}
                      `}
                    >
                      {selectedLockId === lock.id && (
                        <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-0.5"><Check size={12}/></div>
                      )}
                      
                      <div className="p-3 text-center">
                        <div className="relative w-full aspect-square mb-2">
                           <Image src={getSkinImage(lock.skin)} alt={lock.skin} fill className="object-contain" />
                        </div>
                        <div className="font-black text-slate-900 text-sm">#{lock.id}</div>
                        <div className="text-[10px] text-slate-500">{lock.zone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* COLONNE DROITE : PRIX & VALIDATION */}
          <div>
            <Card className="sticky top-24 border-0 shadow-xl ring-1 ring-slate-200">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                   <span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                   Set Price
                </h2>
                
                {selectedLock ? (
                  <>
                    <div>
                      <Label className="text-xs font-bold text-slate-500 uppercase">Sale Price (USD)</Label>
                      <div className="relative mt-2">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-6 w-6"/>
                        <Input 
                          type="number" 
                          value={salePrice} 
                          onChange={e => setSalePrice(e.target.value)} 
                          className="pl-12 h-14 text-2xl font-bold bg-slate-50 border-slate-200 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-xl border border-emerald-100 space-y-3">
                      <div className="flex justify-between text-slate-600 text-sm">
                        <span>Sale Price</span>
                        <span className="font-medium">${parseFloat(salePrice || '0').toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 text-sm">
                        <span>Platform Fee (20%)</span>
                        <span className="text-red-500">-${(parseFloat(salePrice || '0') * platformCommission).toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-emerald-200/50 my-2"></div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-800">You Receive</span>
                        <span className="text-3xl font-black text-emerald-600">
                          ${!isNaN(earnings) ? earnings.toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleListForSale} 
                      disabled={loading}
                      className="w-full bg-slate-900 hover:bg-emerald-600 h-14 text-lg font-bold shadow-lg transition-all"
                    >
                      {loading ? <Loader2 className="animate-spin"/> : <TrendingUp className="mr-2 h-5 w-5"/>}
                      List on Marketplace
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-10 text-slate-400 italic">Select a lock on the left to start.</div>
                )}
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
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin"/></div>}>
      <SellPageContent />
    </Suspense>
  );
}
