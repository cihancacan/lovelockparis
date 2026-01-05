'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShieldCheck, Loader2, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

type UserLock = {
  id: number;
  zone: string;
  skin: string;
  content_text: string;
  status: string;
  price: number; // Prix achat original
};

function SellPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [userLocks, setUserLocks] = useState<UserLock[]>([]);
  const [selectedLockId, setSelectedLockId] = useState<number | null>(null);
  const [salePrice, setSalePrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [platformCommission] = useState(0.20); // 20% commission (ajusté selon ta politique)

  useEffect(() => {
    if (user) loadUserLocks();
  }, [user]);

  const loadUserLocks = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('locks')
        .select('*')
        .eq('owner_id', user.id)
        .eq('status', 'Active') // On ne peut vendre que les actifs
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserLocks(data || []);
      if (data && data.length > 0) {
        setSelectedLockId(data[0].id);
        setSalePrice((data[0].price * 2).toFixed(2)); // Suggestion x2
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
      // CORRECTION IMPORTANTE : resale_price
      const { error } = await supabase
        .from('locks')
        .update({
          status: 'For_Sale',
          resale_price: price, // Champ correct
          sale_description: description.trim() || null
        })
        .eq('id', selectedLockId)
        .eq('owner_id', user.id);

      if (error) throw error;

      toast.success('Lock listed successfully!');
      
      // Redirection vers Boost pour upsell
      setTimeout(() => {
        router.push(`/boost?lock_id=${selectedLockId}`);
      }, 1500);

    } catch (error) {
      console.error(error);
      toast.error('Error listing lock');
    } finally {
      setLoading(false);
    }
  };

  const earnings = parseFloat(salePrice) * (1 - platformCommission);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Badge className="bg-amber-500 mb-4">SELL & EARN</Badge>
          <h1 className="text-4xl font-bold mb-4">List Your Lock for Sale</h1>
          <p className="text-slate-500">Reach 85,000+ collectors. Average profit: 3x.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Sélection */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold mb-4">1. Select Lock</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {userLocks.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">No active locks found.</div>
                ) : (
                  userLocks.map(lock => (
                    <div 
                      key={lock.id}
                      onClick={() => setSelectedLockId(lock.id)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedLockId === lock.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-300'}`}
                    >
                      <div className="flex justify-between">
                        <span className="font-bold">Lock #{lock.id}</span>
                        <Badge variant="outline">${lock.price}</Badge>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{lock.zone} • {lock.skin}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Prix & Validation */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="font-bold mb-4">2. Set Price</h2>
              
              <div>
                <Label>Sale Price ($)</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4"/>
                  <Input 
                    type="number" 
                    value={salePrice} 
                    onChange={e => setSalePrice(e.target.value)} 
                    className="pl-9 text-lg font-bold"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Sale Price</span>
                  <span>${parseFloat(salePrice || '0').toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Commission (20%)</span>
                  <span className="text-red-500">-${(parseFloat(salePrice || '0') * platformCommission).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>You Receive</span>
                  <span className="text-emerald-600">${!isNaN(earnings) ? earnings.toFixed(2) : '0.00'}</span>
                </div>
              </div>

              <div>
                <Label>Description (Optional)</Label>
                <Textarea 
                  placeholder="Why is this lock special?" 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button 
                onClick={handleListForSale} 
                disabled={loading || !selectedLockId}
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
              >
                {loading ? <Loader2 className="animate-spin"/> : <TrendingUp className="mr-2 h-5 w-5"/>}
                List for Sale
              </Button>
              
              <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck size={12}/> Secure transaction
              </p>
            </CardContent>
          </Card>

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
