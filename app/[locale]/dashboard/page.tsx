'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { 
  ShieldCheck, Lock, TrendingUp, Eye, 
  PartyPopper, CreditCard, Wallet, History, Tag, XCircle, Calendar, Loader2, LogOut, DollarSign, Zap, Plus, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Image from 'next/image';

const safeDate = (date: string | null | undefined) => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) { return '-'; }
};

const getSkinImage = (skin: string | null) => `/images/skin-${skin ? skin.toLowerCase() : 'gold'}.png`;

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signOut } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [locks, setLocks] = useState<any[]>([]);
  
  // États formulaires
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bankZone, setBankZone] = useState('EU');
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Force le rechargement des données à chaque focus (retour de page)
    const onFocus = () => fetchData();
    window.addEventListener('focus', onFocus);

    const timer = setTimeout(() => {
        if (!user) router.push('/purchase'); 
        else fetchData();
    }, 500);

    if (searchParams.get('payment_success') === 'true') {
      setShowSuccess(true);
      toast.success("Payment Successful!");
      window.history.replaceState(null, '', '/dashboard');
    }
    
    return () => {
        clearTimeout(timer);
        window.removeEventListener('focus', onFocus);
    };
  }, [user, searchParams, router]);

  const fetchData = async () => {
    if (!user) return;
    try {
      // Profil
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name || '');
        setPhone(profileData.phone || '');
        setBankZone(profileData.bank_country || 'EU');
        setField1(profileData.iban || ''); 
        setField2(profileData.bank_routing_number || profileData.bic || '');
      }

      // Cadenas (On recharge tout pour avoir les prix à jour)
      const { data: locksData } = await supabase
        .from('locks')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
        
      if (locksData) setLocks(locksData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if(!user) return;
    const { error } = await supabase.from('profiles').update({ full_name: fullName, phone: phone }).eq('id', user.id);
    if (error) toast.error("Error saving profile"); else toast.success("Profile updated");
  };

  const handleSaveBank = async () => {
    if(!user) return;
    const { error } = await supabase.from('profiles').update({ bank_country: bankZone, iban: field1, bank_routing_number: field2, bic: field2 }).eq('id', user.id);
    if (error) toast.error("Error saving bank details"); else toast.success("Bank details secured");
  };

  // Annuler une vente directement depuis le dashboard
  const cancelSale = async (lockId: number) => {
    const { error } = await supabase.from('locks').update({ status: 'Active', resale_price: null }).eq('id', lockId);
    if (!error) { toast.success("Removed from marketplace"); fetchData(); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin h-8 w-8 text-white" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {showSuccess && (
        <div className="bg-emerald-500 text-white p-4 text-center font-bold flex items-center justify-center gap-2 sticky top-0 z-50 animate-in slide-in-from-top">
          <PartyPopper size={24} /> Asset Secured Successfully!
          <Button variant="ghost" size="sm" onClick={() => setShowSuccess(false)} className="ml-4 h-8 text-xs text-white border border-white/20">Close</Button>
        </div>
      )}

      {/* HEADER PREMIUM (NOIR) */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#e11d48] to-purple-600 p-2 rounded-lg shadow-lg shadow-rose-500/20">
                <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
                <h1 className="text-lg font-bold leading-tight">My Assets Portfolio</h1>
                <p className="text-xs text-slate-400">Welcome back, {profile?.full_name || user?.email}</p>
            </div>
            </div>
            
            <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
                <p className="text-xs text-slate-400 font-bold uppercase">Available Balance</p>
                <p className="text-xl font-bold text-emerald-400">${profile?.earnings_balance || '0.00'}</p>
            </div>
            <div className="h-8 w-px bg-slate-700 hidden md:block"></div>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-slate-400 hover:text-white hover:bg-white/10">
                <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
            </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* SECTION ACTIONS RAPIDES (LES 3 BOUTONS) */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* 1. VENDRE */}
            <div onClick={() => router.push('/sell')} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform"><DollarSign size={24}/></div>
                    <ArrowUpRight className="text-slate-300 group-hover:text-emerald-500"/>
                </div>
                <h3 className="font-bold text-lg text-slate-900">Sell Asset</h3>
                <p className="text-sm text-slate-500">List on marketplace</p>
            </div>
            
            {/* 2. BOOSTER */}
            <div onClick={() => router.push('/boost')} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-amber-300 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-amber-100 p-3 rounded-xl text-amber-600 group-hover:scale-110 transition-transform"><Zap size={24}/></div>
                    <ArrowUpRight className="text-slate-300 group-hover:text-amber-500"/>
                </div>
                <h3 className="font-bold text-lg text-slate-900">Boost Visibility</h3>
                <p className="text-sm text-slate-500">Sell 5x faster</p>
            </div>

            {/* 3. ACHETER (NOUVEAU) */}
            <div onClick={() => router.push('/purchase')} className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg cursor-pointer hover:scale-[1.02] transition-all group text-white">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-white/20 p-3 rounded-xl text-white group-hover:rotate-90 transition-transform"><Plus size={24}/></div>
                    <div className="bg-emerald-500 text-[10px] font-bold px-2 py-1 rounded">NEW</div>
                </div>
                <h3 className="font-bold text-lg">Buy New Asset</h3>
                <p className="text-slate-400 text-sm">Add to your collection</p>
            </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/50 border-slate-200 shadow-sm"><CardContent className="p-4 flex flex-col items-center"><span className="text-xs text-slate-500 font-bold uppercase">Total Assets</span><span className="text-2xl font-bold text-slate-900">{locks.length}</span></CardContent></Card>
          <Card className="bg-white/50 border-slate-200 shadow-sm"><CardContent className="p-4 flex flex-col items-center"><span className="text-xs text-slate-500 font-bold uppercase">Portfolio Value</span><span className="text-2xl font-bold text-slate-900">${locks.reduce((acc, l) => acc + (l.price || 29.99), 0).toFixed(0)}</span></CardContent></Card>
          <Card className="bg-white/50 border-slate-200 shadow-sm"><CardContent className="p-4 flex flex-col items-center"><span className="text-xs text-slate-500 font-bold uppercase">Total Views</span><span className="text-2xl font-bold text-slate-900">{locks.reduce((acc, l) => acc + (l.views_count || 0), 0)}</span></CardContent></Card>
          <Card className="bg-white/50 border-slate-200 shadow-sm"><CardContent className="p-4 flex flex-col items-center"><span className="text-xs text-slate-500 font-bold uppercase">Pending Sales</span><span className="text-2xl font-bold text-emerald-600">{locks.filter(l => l.status === 'For_Sale').length}</span></CardContent></Card>
        </div>

        {/* CONTENU PRINCIPAL */}
        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList className="bg-white p-1 border border-slate-200 rounded-xl w-full md:w-auto inline-flex">
            <TabsTrigger value="assets" className="px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">My Portfolio</TabsTrigger>
            <TabsTrigger value="profile" className="px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Settings</TabsTrigger>
            <TabsTrigger value="bank" className="px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Payouts</TabsTrigger>
          </TabsList>

          {/* ONGLETS ASSETS */}
          <TabsContent value="assets" className="space-y-4">
             {locks.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <Lock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Portfolio Empty</h3>
                <p className="text-slate-500 mb-6">Start your collection today.</p>
                <Button onClick={() => router.push('/purchase')} className="bg-slate-900 text-white">Buy First Lock</Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {locks.map((lock) => (
                  <div key={lock.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 transition-all hover:shadow-md">
                    {/* Image */}
                    <div className="w-24 h-24 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 relative">
                       <Image src={getSkinImage(lock.skin)} alt="Lock" width={60} height={60} className="object-contain drop-shadow-sm" />
                       {lock.status === 'For_Sale' && (
                         <div className="absolute top-1 right-1 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">ON SALE</div>
                       )}
                    </div>
                    
                    {/* Infos */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="font-black text-slate-900 text-lg">#{lock.id}</span>
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Paid: ${lock.price}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                           <span>{lock.zone}</span> • <span>{safeDate(lock.created_at)}</span>
                        </div>
                      </div>

                      {/* Barre d'action */}
                      <div className="flex gap-2 mt-3">
                         {lock.status === 'For_Sale' ? (
                           <div className="flex-1 flex items-center justify-between bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                              <span className="text-xs font-bold text-green-700">Listed: ${lock.resale_price}</span>
                              <button onClick={() => cancelSale(lock.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Cancel</button>
                           </div>
                         ) : (
                           <>
                             <Button onClick={() => router.push(`/sell`)} size="sm" variant="outline" className="flex-1 h-8 text-xs border-slate-300">Sell</Button>
                             <Button onClick={() => router.push(`/boost`)} size="sm" className="flex-1 h-8 text-xs bg-amber-500 hover:bg-amber-600 text-white border-0">Boost</Button>
                           </>
                         )}
                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => window.open('/bridge')}><Eye size={16}/></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ONGLET PROFILE */}
          <TabsContent value="profile">
            <Card>
              <CardHeader><CardTitle>Identity</CardTitle></CardHeader>
              <CardContent className="space-y-4 max-w-lg">
                <div className="space-y-2"><Label>Full Name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                <div className="space-y-2"><Label>Email</Label><Input value={user?.email} disabled className="bg-slate-100" /></div>
                <Button onClick={handleSaveProfile} className="bg-slate-900 text-white">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ONGLET BANK */}
          <TabsContent value="bank">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5"/> Payout Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Bank Region</Label>
                    <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" value={bankZone} onChange={(e) => setBankZone(e.target.value)}>
                      <option value="EU">🇪🇺 Europe</option><option value="US">🇺🇸 USA</option><option value="UK">🇬🇧 UK</option><option value="OTHER">🌍 Other</option>
                    </select>
                  </div>
                  <div className="space-y-2"><Label>IBAN / Account</Label><Input value={field1} onChange={(e) => setField1(e.target.value)} /></div>
                  <div className="space-y-2"><Label>BIC / Routing</Label><Input value={field2} onChange={(e) => setField2(e.target.value)} /></div>
                  <Button onClick={handleSaveBank} className="w-full bg-slate-900 text-white mt-2"><Lock className="mr-2 h-4 w-4"/> Secure Data</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin h-8 w-8 text-slate-400" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
