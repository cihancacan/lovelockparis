'use client';

// Force dynamic
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, ShieldCheck, Loader2, TrendingUp, ArrowLeft, Check, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

type UserLock = { id: number; zone: string; skin: string | null; content_text: string; status: string; price: number; };
const getSkinImage = (skin: string | null) => `/images/skin-${skin ? skin.toLowerCase() : 'gold'}.png`;

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
  }, [user]);

  const loadUserLocks = async () => {
    const { data } = await supabase.from('locks').select('*').eq('owner_id', user?.id).eq('status', 'Active').order('created_at', { ascending: false });
    setUserLocks(data || []);
    if (data && data.length > 0) {
        setSelectedLockId(data[0].id);
        setSalePrice((data[0].price * 2).toFixed(2));
    }
  };

  const handleListForSale = async () => {
    if (!user) { router.push('/purchase'); return; }
    if (!selectedLockId) { toast.error('Select a lock'); return; }
    const price = parseFloat(salePrice);
    if (isNaN(price) || price < 29.99) { toast.error('Min price $29.99'); return; }

    setLoading(true);
    try {
      await supabase.from('locks').update({ status: 'For_Sale', resale_price: price, sale_description: description }).eq('id', selectedLockId).eq('owner_id', user.id);
      toast.success('Listed!');
      router.push(`/boost?lock_id=${selectedLockId}`);
    } catch (e) { toast.error('Error'); } finally { setLoading(false); }
  };

  const earnings = parseFloat(salePrice) * (1 - platformCommission);

  return (
    <div className="min-h-screen bg-slate-50">
      
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto max-w-5xl flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5"/></Button>
          <h1 className="font-bold text-lg">Sell Asset</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> Select Lock</h2>
            
            {!user ? (
                <div className="text-center py-10 bg-white rounded-xl border-2 border-dashed border-slate-200">
                  <Lock className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400 mb-4">Login to view your collection.</p>
                  <Button onClick={() => router.push('/purchase')}>Login</Button>
                </div>
            ) : userLocks.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed"><p className="text-slate-400 mb-4">No active locks.</p><Button onClick={() => router.push('/purchase')}>Buy a Lock</Button></div>
            ) : (
                <div className="grid grid-cols-3 gap-3 max-h-[500px] overflow-y-auto p-1">
                  {userLocks.map(lock => (
                    <div key={lock.id} onClick={() => setSelectedLockId(lock.id)} className={`relative group cursor-pointer rounded-xl border-2 transition-all p-3 text-center ${selectedLockId === lock.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                      {selectedLockId === lock.id && <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5"><Check size={10}/></div>}
                      <div className="relative w-full aspect-square mb-2"><Image src={getSkinImage(lock.skin)} alt="lock" fill className="object-contain" /></div>
                      <div className="font-black text-slate-900 text-sm">#{lock.id}</div>
                    </div>
                  ))}
                </div>
            )}
          </div>

          <div>
            <Card className="sticky top-24 border-0 shadow-xl ring-1 ring-slate-200">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> Set Price</h2>
                
                <div>
                    <Label className="text-xs font-bold text-slate-500 uppercase">Sale Price (USD)</Label>
                    <div className="relative mt-2">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-6 w-6"/>
                    <Input type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} className="pl-12 h-14 text-2xl font-bold bg-slate-50" />
                    </div>
                </div>

                <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 space-y-3">
                    <div className="flex justify-between text-sm"><span>Price</span><span className="font-bold">${parseFloat(salePrice || '0').toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm text-red-500"><span>Fee (20%)</span><span>-${(parseFloat(salePrice || '0') * platformCommission).toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-xl pt-2 border-t border-emerald-200 text-emerald-700"><span>You Receive</span><span>${!isNaN(earnings) ? earnings.toFixed(2) : '0.00'}</span></div>
                </div>

                <Button onClick={handleListForSale} disabled={loading || !user} className="w-full bg-slate-900 hover:bg-emerald-600 h-14 text-lg font-bold shadow-lg transition-all">
                    {loading ? <Loader2 className="animate-spin"/> : <TrendingUp className="mr-2 h-5 w-5"/>} List on Marketplace
                </Button>
                
                <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-1"><ShieldCheck size={12}/> Secure transaction</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function SellPage() { return <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin"/></div>}><SellPageContent /></Suspense>; }
