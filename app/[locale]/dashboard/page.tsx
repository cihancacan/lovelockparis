'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context'; // Import du Auth Context
import { 
  ShieldCheck, Lock, TrendingUp, Eye, 
  PartyPopper, CreditCard, Wallet, History, Tag, XCircle, Calendar, Loader2, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Image from 'next/image';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // On récupère la fonction signOut ici
  const { user, signOut } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [locks, setLocks] = useState<any[]>([]);
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bankZone, setBankZone] = useState('EU');
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [priceInputs, setPriceInputs] = useState<Record<number, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchData();
    if (searchParams.get('payment_success') === 'true') {
      setShowSuccess(true);
      toast.success("Payment Successful!");
      window.history.replaceState(null, '', '/dashboard');
    }
  }, []);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      router.push('/purchase'); // Redirection si pas connecté
      return;
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileData) {
      setProfile(profileData);
      setFullName(profileData.full_name || '');
      setPhone(profileData.phone || '');
      setBankZone(profileData.bank_country || 'EU');
      setField1(profileData.iban || ''); 
      setField2(profileData.bank_routing_number || profileData.bic || '');
    }

    const { data: locksData } = await supabase
      .from('locks')
      .select('*')
      .eq('owner_id', session.user.id)
      .order('created_at', { ascending: false });
      
    if (locksData) {
      setLocks(locksData);
      const inputs: Record<number, string> = {};
      locksData.forEach((l: any) => {
        if (l.resale_price) inputs[l.id] = l.resale_price.toString();
      });
      setPriceInputs(inputs);
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if(!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone: phone })
      .eq('id', user.id);
    
    if (error) toast.error("Error saving profile");
    else toast.success("Profile updated");
  };

  const handleSaveBank = async () => {
    if(!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ 
        bank_country: bankZone,
        iban: field1, 
        bank_routing_number: field2, 
        bic: field2
      })
      .eq('id', user.id);
    
    if (error) toast.error("Error saving bank details");
    else toast.success("Bank details secured");
  };

  const handleSellToggle = async (lockId: number, currentStatus: string) => {
    const priceValue = priceInputs[lockId];

    if (currentStatus === 'For_Sale') {
      const { error } = await supabase
        .from('locks')
        .update({ status: 'Active', resale_price: null })
        .eq('id', lockId);
      if (!error) { toast.success("Removed from marketplace"); fetchData(); }
    } else {
      if (!priceValue || parseFloat(priceValue) <= 0) { toast.error("Invalid price"); return; }
      const { error } = await supabase
        .from('locks')
        .update({ status: 'For_Sale', resale_price: parseFloat(priceValue) })
        .eq('id', lockId);
      if (!error) { toast.success(`Listed for $${priceValue}!`); fetchData(); }
    }
  };

  const handlePriceChange = (id: number, value: string) => {
    setPriceInputs(prev => ({ ...prev, [id]: value }));
  };

  const calculateNetEarnings = (price: string) => {
    const p = parseFloat(price);
    if (isNaN(p) || p <= 0) return '0.00';
    return (p * 0.80).toFixed(2);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white text-slate-900"><Loader2 className="animate-spin h-8 w-8" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {showSuccess && (
        <div className="bg-green-600 text-white p-4 text-center font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top sticky top-0 z-50">
          <PartyPopper size={24} />
          Congratulations! Your Asset is secured.
          <Button variant="secondary" size="sm" onClick={() => setShowSuccess(false)} className="ml-4 h-8 text-xs">Close</Button>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#e11d48] text-white p-2 rounded-lg">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Investor Dashboard</h1>
            <p className="text-xs text-slate-500">Welcome, {profile?.full_name || user?.email}</p>
          </div>
        </div>
        
        {/* SECTION DROITE : BALANCE + LOGOUT */}
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="text-xs text-slate-400 font-bold uppercase">Balance</p>
            <p className="text-xl font-bold text-[#e11d48]">${profile?.earnings_balance || '0.00'}</p>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
          <Button variant="ghost" size="sm" onClick={signOut} className="text-slate-500 hover:text-[#e11d48] hover:bg-rose-50">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-none shadow-sm bg-white p-4 flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Lock size={20} /></div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Assets</p>
              <p className="text-2xl font-bold text-slate-900">{locks.length}</p>
            </div>
          </Card>
          <Card className="border-none shadow-sm bg-white p-4 flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-full text-green-600"><TrendingUp size={20} /></div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Total Value</p>
              <p className="text-2xl font-bold text-slate-900">${locks.reduce((acc, l) => acc + (l.price || 29.99), 0).toFixed(2)}</p>
            </div>
          </Card>
          <Card className="border-none shadow-sm bg-white p-4 flex items-center gap-4">
            <div className="bg-purple-50 p-3 rounded-full text-purple-600"><Eye size={20} /></div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Views</p>
              <p className="text-2xl font-bold text-slate-900">{locks.reduce((acc, l) => acc + (l.views_count || 0), 0)}</p>
            </div>
          </Card>
          <Card className="border-none shadow-sm bg-white p-4 flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-full text-amber-600"><Wallet size={20} /></div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Earnings</p>
              <p className="text-2xl font-bold text-[#e11d48]">${profile?.earnings_balance || '0.00'}</p>
            </div>
          </Card>
        </div>

        {/* TABS */}
        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList className="bg-white p-1 border border-slate-200 rounded-xl w-full md:w-auto inline-flex">
            <TabsTrigger value="assets" className="px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">My Locks</TabsTrigger>
            <TabsTrigger value="profile" className="px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Profile</TabsTrigger>
            <TabsTrigger value="bank" className="px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Bank & Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="space-y-6">
             {locks.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <Lock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No assets yet</h3>
                <Button onClick={() => router.push('/purchase')} className="mt-4 bg-[#e11d48] text-white">Buy First Lock</Button>
              </div>
            ) : (
              locks.map((lock) => (
                <div key={lock.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row transition-all hover:shadow-md">
                  <div className="md:w-1/4 bg-slate-50 p-8 flex items-center justify-center border-r border-slate-100 relative">
                     <Image src={`/images/skin-${lock.skin ? lock.skin.toLowerCase() : 'gold'}.png`} alt="Lock" width={100} height={100} className="object-contain" />
                     {lock.status === 'For_Sale' && (
                       <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">ON SALE</div>
                     )}
                  </div>
                  <div className="flex-1 p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-900 text-white text-xs font-mono px-2 py-1 rounded">#{lock.id}</span>
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">Purchased: ${lock.price}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar size={12} />
                          <span>Purchased on {new Date(lock.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 mt-1 line-clamp-1">{lock.content_text}</h3>
                        <p className="text-sm text-slate-500">{lock.zone} • {lock.skin} Edition</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => window.open(`/bridge`)}><Eye className="w-3 h-3 mr-1"/> 3D</Button>
                    </div>
                    <div className={`flex flex-col gap-3 pt-4 border-t border-slate-100 mt-2 ${lock.status === 'For_Sale' ? 'bg-green-50/50 -mx-6 px-6 py-4' : ''}`}>
                       {lock.status === 'For_Sale' ? (
                         <div className="flex items-center justify-between">
                           <div className="flex-1 text-sm text-green-700 flex flex-col gap-1">
                             <div className="flex items-center gap-2 font-bold"><Tag className="h-4 w-4"/>Listed for ${lock.resale_price}</div>
                             <span className="text-xs opacity-70">Waiting for a buyer...</span>
                           </div>
                           <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white border-0" onClick={() => handleSellToggle(lock.id, lock.status)}><XCircle className="w-3 h-3 mr-2"/> Cancel Sale</Button>
                         </div>
                       ) : (
                         <div className="space-y-3">
                           <div className="flex justify-between items-end">
                             <div className="text-sm text-slate-600">
                               <p className="font-bold mb-1">Sell on Marketplace</p>
                               <p className="text-xs text-slate-400 max-w-[250px] leading-tight">20% transfer fees applied upon sale.<br/>You will receive: <strong className="text-green-600">${calculateNetEarnings(priceInputs[lock.id])}</strong></p>
                             </div>
                             <div className="flex items-center gap-2">
                               <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                 <Input type="number" placeholder="Price" className="h-9 w-24 pl-6 bg-white" value={priceInputs[lock.id] || ''} onChange={(e) => handlePriceChange(lock.id, e.target.value)}/>
                               </div>
                               <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white" onClick={() => handleSellToggle(lock.id, lock.status)}><Tag className="w-3 h-3 mr-2"/> Sell</Button>
                             </div>
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader><CardTitle>Identity</CardTitle></CardHeader>
              <CardContent className="space-y-4 max-w-lg">
                <div className="space-y-2"><Label>Full Name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                <div className="space-y-2"><Label>Email</Label><Input value={user?.email} disabled className="bg-slate-100" /></div>
                <Button onClick={handleSaveProfile} className="bg-[#e11d48] text-white">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader><CardTitle>Payout Method</CardTitle><CardDescription>Global payouts supported.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" value={bankZone} onChange={(e) => setBankZone(e.target.value)}>
                      <option value="EU">🇪🇺 Europe</option><option value="US">🇺🇸 USA</option><option value="UK">🇬🇧 UK</option><option value="OTHER">🌍 Other</option>
                    </select>
                  </div>
                  <div className="space-y-2"><Label>Account Number / IBAN</Label><Input value={field1} onChange={(e) => setField1(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Routing / BIC / Sort Code</Label><Input value={field2} onChange={(e) => setField2(e.target.value)} /></div>
                  <Button onClick={handleSaveBank} className="w-full bg-slate-900 text-white mt-2"><Lock className="mr-2 h-4 w-4"/> Secure Save</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Payout History</CardTitle></CardHeader>
                <CardContent className="text-center py-10 text-slate-400 text-sm">No payout history yet.</CardContent>
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-[#e11d48]" /></div>}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
