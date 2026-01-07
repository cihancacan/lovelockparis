'use client';

// Force le rendu dynamique
export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { 
  ShieldCheck, Lock, TrendingUp, Eye, PartyPopper, CreditCard, Wallet, 
  LogOut, DollarSign, Zap, Plus, ArrowUpRight, Loader2, Home, Store, 
  Video, Image as ImageIcon, Mic, Upload, Trash2, PlayCircle, Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge'; // <--- LIGNE AJOUTÉE (CORRECTION)
import { toast } from 'sonner';
import Image from 'next/image';

// Définition des types média
type MediaType = 'none' | 'photo' | 'video' | 'audio';

const safeDate = (date: string | null | undefined) => {
  if (!date) return '-';
  try { return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); } 
  catch (e) { return '-'; }
};

const getSkinImage = (skin: string | null) => `/images/skin-${skin ? skin.toLowerCase() : 'gold'}.png`;

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signOut } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [locks, setLocks] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  
  // États formulaires
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bankZone, setBankZone] = useState('EU');
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [priceInputs, setPriceInputs] = useState<Record<number, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        if (!user) router.push('/purchase'); 
        else fetchData();
    }, 500);

    if (searchParams.get('payment_success') === 'true') {
      setShowSuccess(true);
      toast.success("Transaction Successful!");
      window.history.replaceState(null, '', '/dashboard');
    }
    return () => clearTimeout(timer);
  }, [user, searchParams, router]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name || '');
        setPhone(profileData.phone || '');
        setBankZone(profileData.bank_country || 'EU');
        setField1(profileData.iban || ''); 
        setField2(profileData.bank_routing_number || profileData.bic || '');
      }

      // ON RECUPERE LE media_type
      const { data: locksData } = await supabase
        .from('locks')
        .select('*')
        .eq('owner_id', user.id)
        .neq('status', 'Pending')
        .order('created_at', { ascending: false });
        
      if (locksData) {
        setLocks(locksData);
        const inputs: Record<number, string> = {};
        locksData.forEach((l: any) => {
          if (l.resale_price) inputs[l.id] = l.resale_price.toString();
        });
        setPriceInputs(inputs);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSaveProfile = async () => {
    if(!user) return;
    const { error } = await supabase.from('profiles').update({ full_name: fullName, phone: phone }).eq('id', user.id);
    if (error) toast.error("Error"); else toast.success("Saved");
  };

  const handleSaveBank = async () => {
    if(!user) return;
    const { error } = await supabase.from('profiles').update({ bank_country: bankZone, iban: field1, bank_routing_number: field2, bic: field2 }).eq('id', user.id);
    if (error) toast.error("Error"); else toast.success("Saved");
  };

  const handleSellToggle = async (lockId: number, currentStatus: string) => {
    const priceValue = priceInputs[lockId];
    if (currentStatus === 'For_Sale') {
      const { error } = await supabase.from('locks').update({ status: 'Active', resale_price: null }).eq('id', lockId);
      if (!error) { toast.success("Removed from market"); fetchData(); }
    } else {
      if (!priceValue || parseFloat(priceValue) <= 0) { toast.error("Invalid price"); return; }
      const { error } = await supabase.from('locks').update({ status: 'For_Sale', resale_price: parseFloat(priceValue) }).eq('id', lockId);
      if (!error) { toast.success("Listed!"); fetchData(); }
    }
  };

  const handlePriceChange = (id: number, value: string) => {
    setPriceInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  // --- GESTION MEDIA ---
  const handleBuyMediaOption = (lockId: number, type: string) => {
    let price = 9.99;
    if (type === 'audio') price = 14.99;
    if (type === 'video') price = 29.99;
    
    // Redirection vers Checkout avec le type spécifique
    router.push(`/checkout?type=media_upgrade&lock_id=${lockId}&media_type=${type}&price=${price}`);
  };

  const handleUploadMedia = async (lockId: number, file: File, type: string) => {
    if (!file) return;
    
    // Vérification basique du type
    if (type === 'photo' && !file.type.startsWith('image/')) return toast.error("Please upload an image");
    if (type === 'video' && !file.type.startsWith('video/')) return toast.error("Please upload a video");
    if (type === 'audio' && !file.type.startsWith('audio/')) return toast.error("Please upload an audio file");

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${lockId}-${Date.now()}.${fileExt}`;
      
      // Upload Storage
      const { error: uploadError } = await supabase.storage.from('lock-media').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('lock-media').getPublicUrl(fileName);
      
      // Update DB
      await supabase.from('locks').update({ content_media_url: publicUrl }).eq('id', lockId);
      toast.success("Media uploaded successfully!");
      fetchData();
    } catch (e: any) {
      toast.error("Upload failed: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (lockId: number) => {
    if(!confirm("Delete this content?")) return;
    await supabase.from('locks').update({ content_media_url: null }).eq('id', lockId);
    toast.success("Media deleted");
    fetchData();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin h-8 w-8 text-slate-400" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {showSuccess && (
        <div className="bg-emerald-500 text-white p-4 text-center font-bold flex items-center justify-center gap-2 sticky top-0 z-50 animate-in slide-in-from-top">
          <PartyPopper size={24} /> Transaction Successful!
          <Button variant="ghost" size="sm" onClick={() => setShowSuccess(false)} className="ml-4 h-8 text-xs text-white border border-white/20">Close</Button>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-[#e11d48] to-purple-600 p-2 rounded-lg shadow-lg shadow-rose-500/20"><ShieldCheck size={20} className="text-white" /></div>
                    <div><h1 className="text-lg font-bold leading-tight">My Assets</h1><p className="text-xs text-slate-400">{profile?.full_name || user?.email}</p></div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="md:hidden text-slate-400"><LogOut className="h-5 w-5" /></Button>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto bg-slate-800/50 p-1.5 rounded-xl overflow-x-auto">
                <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-slate-300 hover:text-white hover:bg-white/10 gap-2"><Home size={16}/> Home</Button>
                <Button variant="ghost" size="sm" onClick={() => router.push('/marketplace')} className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 gap-2"><Store size={16}/> Marketplace</Button>
                <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block"></div>
                <div className="px-3 hidden sm:block"><p className="text-[10px] text-slate-400 font-bold uppercase">Balance</p><p className="text-sm font-bold text-emerald-400">${profile?.earnings_balance || '0.00'}</p></div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 hidden sm:flex"><LogOut size={16}/></Button>
            </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* ACTIONS */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div onClick={() => router.push('/sell')} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all group"><div className="flex justify-between items-start mb-4"><div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform"><DollarSign size={24}/></div><ArrowUpRight className="text-slate-300 group-hover:text-emerald-500"/></div><h3 className="font-bold text-lg text-slate-900">Sell Asset</h3><p className="text-slate-500 text-sm">List on marketplace</p></div>
            <div onClick={() => router.push('/boost')} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-amber-300 transition-all group"><div className="flex justify-between items-start mb-4"><div className="bg-amber-100 p-3 rounded-xl text-amber-600 group-hover:scale-110 transition-transform"><Zap size={24}/></div><ArrowUpRight className="text-slate-300 group-hover:text-amber-500"/></div><h3 className="font-bold text-lg text-slate-900">Boost Visibility</h3><p className="text-sm text-slate-500">Sell 5x faster</p></div>
            <div onClick={() => router.push('/purchase')} className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg cursor-pointer hover:scale-[1.02] transition-all group text-white"><div className="flex justify-between items-start mb-4"><div className="bg-white/20 p-3 rounded-xl text-white group-hover:rotate-90 transition-transform"><Plus size={24}/></div><div className="bg-emerald-500 text-[10px] font-bold px-2 py-1 rounded">NEW</div></div><h3 className="font-bold text-lg">Buy New Asset</h3><p className="text-slate-400 text-sm">Add to your collection</p></div>
        </div>

        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList className="bg-white p-1 border border-slate-200 rounded-xl w-full md:w-auto inline-flex">
            <TabsTrigger value="assets" className="px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">My Portfolio</TabsTrigger>
            <TabsTrigger value="profile" className="px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Profile</TabsTrigger>
            <TabsTrigger value="bank" className="px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="space-y-4">
             {locks.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200"><Lock className="h-12 w-12 text-slate-300 mx-auto mb-4" /><h3 className="text-lg font-bold text-slate-900">Portfolio Empty</h3><p className="text-slate-500 mb-6">Start your collection today.</p><Button onClick={() => router.push('/purchase')} className="bg-slate-900 text-white">Buy First Lock</Button></div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {locks.map((lock) => (
                  <div key={lock.id} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md">
                    
                    {/* Colonne 1: Visuel */}
                    <div className="flex gap-4 md:w-1/3">
                        <div className="w-24 h-24 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 relative">
                           <Image src={getSkinImage(lock.skin)} alt="Lock" width={60} height={60} className="object-contain drop-shadow-sm" />
                           {lock.status === 'For_Sale' && <div className="absolute top-1 right-1 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">ON SALE</div>}
                        </div>
                        <div>
                            <div className="font-black text-slate-900 text-xl">#{lock.id}</div>
                            <div className="text-xs text-slate-500 mt-1 mb-2">{lock.zone} • {safeDate(lock.created_at)}</div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="bg-slate-50">{lock.media_type ? lock.media_type.toUpperCase() : 'NO MEDIA'}</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Colonne 2: Media Studio */}
                    <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-100">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-sm text-slate-700 flex items-center gap-2"><Video size={16}/> Media Studio</h4>
                            {lock.media_type && lock.media_type !== 'none' && (
                                <div className="text-[10px] flex items-center gap-3 font-medium text-slate-500">
                                    <span className="flex items-center gap-1"><Eye size={12}/> {lock.media_views || 0} views</span>
                                    <span className="flex items-center gap-1 text-emerald-600 font-bold"><DollarSign size={12}/> ${lock.media_earnings || 0} earned</span>
                                </div>
                            )}
                        </div>

                        {(!lock.media_type || lock.media_type === 'none') && (
                            <div className="grid grid-cols-3 gap-2">
                                <div onClick={() => handleBuyMediaOption(lock.id, 'photo')} className="cursor-pointer border border-dashed border-slate-300 rounded p-2 text-center hover:bg-white hover:border-slate-400 transition-all">
                                    <ImageIcon className="h-4 w-4 mx-auto text-slate-400 mb-1"/>
                                    <div className="text-[10px] font-bold">Photo</div>
                                    <div className="text-[9px] text-blue-600">+$9.99</div>
                                </div>
                                <div onClick={() => handleBuyMediaOption(lock.id, 'audio')} className="cursor-pointer border border-dashed border-slate-300 rounded p-2 text-center hover:bg-white hover:border-slate-400 transition-all">
                                    <Mic className="h-4 w-4 mx-auto text-slate-400 mb-1"/>
                                    <div className="text-[10px] font-bold">Audio</div>
                                    <div className="text-[9px] text-blue-600">+$14.99</div>
                                </div>
                                <div onClick={() => handleBuyMediaOption(lock.id, 'video')} className="cursor-pointer border border-dashed border-slate-300 rounded p-2 text-center hover:bg-white hover:border-slate-400 transition-all">
                                    <Video className="h-4 w-4 mx-auto text-slate-400 mb-1"/>
                                    <div className="text-[10px] font-bold">Video</div>
                                    <div className="text-[9px] text-blue-600">+$29.99</div>
                                </div>
                            </div>
                        )}

                        {lock.media_type && lock.media_type !== 'none' && (
                            <div className="flex items-center gap-3">
                                {lock.content_media_url ? (
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="flex-1 bg-white border px-3 py-2 rounded text-xs text-slate-600 truncate flex items-center gap-2">
                                            {lock.media_type === 'photo' && <ImageIcon size={14} className="text-purple-500"/>}
                                            {lock.media_type === 'video' && <PlayCircle size={14} className="text-blue-500"/>}
                                            {lock.media_type === 'audio' && <Music size={14} className="text-amber-500"/>}
                                            Content Uploaded
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => handleDeleteMedia(lock.id)}>
                                            <Trash2 size={16}/>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <Label htmlFor={`file-${lock.id}`} className="cursor-pointer flex items-center justify-center gap-2 w-full h-9 bg-white border border-dashed border-slate-300 rounded hover:border-indigo-500 text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                                            {uploading ? <Loader2 size={14} className="animate-spin"/> : <><Upload size={14}/> Upload {lock.media_type}</>}
                                        </Label>
                                        <Input 
                                            id={`file-${lock.id}`} 
                                            type="file" 
                                            className="hidden" 
                                            accept={lock.media_type === 'photo' ? 'image/*' : lock.media_type === 'video' ? 'video/*' : 'audio/*'} 
                                            onChange={(e) => e.target.files && handleUploadMedia(lock.id, e.target.files[0], lock.media_type)} 
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Colonne 3: Vente & Boost */}
                    <div className="md:w-1/4 flex flex-col justify-center gap-2">
                        {lock.status === 'For_Sale' ? (
                            <div className="text-center">
                                <div className="text-xs text-green-600 font-bold mb-1">Listed: ${lock.resale_price}</div>
                                <Button size="sm" variant="outline" onClick={() => handleSellToggle(lock.id, lock.status)} className="w-full text-xs h-8 border-red-200 text-red-500 hover:bg-red-50">Cancel</Button>
                            </div>
                        ) : (
                            <>
                                <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span><Input className="h-8 pl-5 text-xs" placeholder="Price" value={priceInputs[lock.id] || ''} onChange={(e) => handlePriceChange(lock.id, e.target.value)} /></div>
                                <Button size="sm" onClick={() => handleSellToggle(lock.id, lock.status)} className="w-full h-8 text-xs bg-slate-900 text-white">List for Sale</Button>
                                <Button size="sm" variant="outline" onClick={() => router.push(`/boost?lock_id=${lock.id}`)} className="w-full h-8 text-xs text-amber-600 border-amber-200 hover:bg-amber-50">Boost</Button>
                            </>
                        )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="profile"><Card><CardHeader><CardTitle>Identity</CardTitle></CardHeader><CardContent className="space-y-4 max-w-lg"><div className="space-y-2"><Label>Full Name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div><div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div><Button onClick={handleSaveProfile} className="bg-slate-900 text-white">Save Changes</Button></CardContent></Card></TabsContent>
          <TabsContent value="bank"><div className="grid md:grid-cols-2 gap-8"><Card><CardHeader><CardTitle>Payout Method</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Region</Label><select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" value={bankZone} onChange={(e) => setBankZone(e.target.value)}><option value="EU">🇪🇺 Europe</option><option value="US">🇺🇸 USA</option><option value="UK">🇬🇧 UK</option><option value="OTHER">🌍 Other</option></select></div><div className="space-y-2"><Label>IBAN / Account</Label><Input value={field1} onChange={(e) => setField1(e.target.value)} /></div><div className="space-y-2"><Label>BIC / Routing</Label><Input value={field2} onChange={(e) => setField2(e.target.value)} /></div><Button onClick={handleSaveBank} className="w-full bg-slate-900 text-white mt-2"><Lock className="mr-2 h-4 w-4"/> Secure Save</Button></CardContent></Card></div></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin h-10 w-10 text-slate-400" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
