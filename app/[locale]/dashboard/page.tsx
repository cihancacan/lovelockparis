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

  // ✅ États profil : Prénom/Nom + Tel + Email
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // États formulaires
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

        // ✅ Priorité: first_name / last_name, sinon split full_name, sinon metadata Auth
        const metaFirst = (user?.user_metadata?.first_name || '').toString().trim();
        const metaLast  = (user?.user_metadata?.last_name || '').toString().trim();

        let pFirst = (profileData.first_name || '').toString().trim();
        let pLast  = (profileData.last_name || '').toString().trim();

        if (!pFirst && !pLast) {
          const source = (profileData.full_name || `${metaFirst} ${metaLast}`).toString().trim();
          const parts = source.split(' ').filter(Boolean);
          if (!pFirst && parts.length) pFirst = parts[0] || '';
          if (!pLast && parts.length > 1) pLast = parts.slice(1).join(' ');
        }

        setFirstName(pFirst || metaFirst || '');
        setLastName(pLast || metaLast || '');
        setPhone(profileData.phone || '');
        setEmail((profileData.email || user?.email || '').toString());

        setBankZone(profileData.bank_country || 'EU');
        setField1(profileData.iban || '');
        setField2(profileData.bank_routing_number || profileData.bic || '');
      } else {
        // fallback minimal si profiles n'existe pas encore
        const metaFirst = (user?.user_metadata?.first_name || '').toString().trim();
        const metaLast  = (user?.user_metadata?.last_name || '').toString().trim();
        setFirstName(metaFirst || '');
        setLastName(metaLast || '');
        setEmail((user?.email || '').toString());
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
    if (!user) return;

    const fn = firstName.trim();
    const ln = lastName.trim();
    const computedFullName = `${fn} ${ln}`.trim();
    const newEmail = email.trim();

    // 1) Update profiles (DB)
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: fn || null,
        last_name: ln || null,
        full_name: computedFullName || null, // compat si d'autres endroits l'utilisent
        phone: phone.trim() || null,
        email: newEmail || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      toast.error("Error");
      return;
    }

    // 2) Si l'email a changé, on demande la mise à jour Auth (peut nécessiter confirmation)
    if (newEmail && user.email && newEmail !== user.email) {
      const { error: authErr } = await supabase.auth.updateUser({ email: newEmail });
      if (authErr) toast.error("Email update failed");
      else toast.success("Email update requested (check inbox)");
    }

    toast.success("Saved");
    fetchData();
  };

  const handleSaveBank = async () => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update({
      bank_country: bankZone,
      iban: field1,
      bank_routing_number: field2,
      bic: field2
    }).eq('id', user.id);

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
    router.push(`/checkout?type=media_upgrade&lock_id=${lockId}&media_type=${type}&price=${price}`);
  };

  const handleUploadMedia = async (lockId: number, file: File, type: string) => {
    if (!file) return;

    if (type === 'photo' && !file.type.startsWith('image/')) return toast.error("Please upload an image");
    if (type === 'video' && !file.type.startsWith('video/')) return toast.error("Please upload a video");
    if (type === 'audio' && !file.type.startsWith('audio/')) return toast.error("Please upload an audio file");

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}/${lockId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('lock-media').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('lock-media').getPublicUrl(fileName);

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
    if (!confirm("Delete this content?")) return;
    await supabase.from('locks').update({ content_media_url: null }).eq('id', lockId);
    toast.success("Media deleted");
    fetchData();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin h-8 w-8 text-slate-400" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* SUCCESS BANNER */}
      {showSuccess && (
        <div className="bg-emerald-500 text-white p-4 text-center font-bold flex items-center justify-center gap-2 sticky top-0 z-50 animate-in slide-in-from-top">
          <PartyPopper size={24} /> Transaction Successful!
          <Button variant="ghost" size="sm" onClick={() => setShowSuccess(false)} className="ml-4 h-8 text-xs text-white border border-white/20">
            Close
          </Button>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-[#e11d48] to-purple-600 p-2 rounded-lg shadow-lg shadow-rose-500/20">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">My Assets</h1>
                <p className="text-xs text-slate-400">
                  {`${firstName} ${lastName}`.trim() || profile?.full_name || user?.email}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="md:hidden text-slate-400">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto bg-slate-800/50 p-1.5 rounded-xl overflow-x-auto">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-slate-300 hover:text-white hover:bg-white/10 gap-2">
              <Home size={16} /> Home
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push('/marketplace')} className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 gap-2">
              <Store size={16} /> Marketplace
            </Button>
            <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block"></div>
            <div className="px-3 hidden sm:block">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Balance</p>
              <p className="text-sm font-bold text-emerald-400">${profile?.earnings_balance || '0.00'}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 hidden sm:flex">
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* ACTIONS */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div onClick={() => router.push('/sell')} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform"><DollarSign size={24} /></div>
              <ArrowUpRight className="text-slate-300 group-hover:text-emerald-500" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Sell Asset</h3>
            <p className="text-slate-500 text-sm">List on marketplace</p>
          </div>

          <div onClick={() => router.push('/boost')} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-amber-300 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-amber-100 p-3 rounded-xl text-amber-600 group-hover:scale-110 transition-transform"><Zap size={24} /></div>
              <ArrowUpRight className="text-slate-300 group-hover:text-amber-500" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Boost Visibility</h3>
            <p className="text-sm text-slate-500">Sell 5x faster</p>
          </div>

          <div onClick={() => router.push('/purchase')} className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg cursor-pointer hover:scale-[1.02] transition-all group text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl text-white group-hover:rotate-90 transition-transform"><Plus size={24} /></div>
              <div className="bg-emerald-500 text-[10px] font-bold px-2 py-1 rounded">NEW</div>
            </div>
            <h3 className="font-bold text-lg">Buy New Asset</h3>
            <p className="text-slate-400 text-sm">Add to your collection</p>
          </div>
        </div>

        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList className="bg-white p-1 border border-slate-200 rounded-xl w-full md:w-auto inline-flex">
            <TabsTrigger value="assets" className="px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">My Portfolio</TabsTrigger>
            <TabsTrigger value="profile" className="px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Profile</TabsTrigger>
            <TabsTrigger value="bank" className="px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Payouts</TabsTrigger>
          </TabsList>

          {/* PORTFOLIO TAB */}
          <TabsContent value="assets" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Lock size={20} /> Your Digital Locks</CardTitle>
                  <CardDescription>Manage your assets and media content</CardDescription>
                </div>
                <Badge className="bg-slate-900">{locks.length} Assets</Badge>
              </CardHeader>

              <CardContent>
                {locks.length === 0 ? (
                  <div className="text-center py-12">
                    <Lock className="mx-auto text-slate-300 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No assets yet</h3>
                    <p className="text-slate-500 mb-6">Purchase your first lock to get started</p>
                    <Button onClick={() => router.push('/purchase')} className="bg-slate-900 text-white">
                      <Plus className="mr-2" size={16} /> Buy Your First Lock
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {locks.map((lock) => (
                      <Card key={lock.id} className="border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 border-b border-slate-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-bold text-lg flex items-center gap-2">
                                <Lock size={18} className="text-[#e11d48]" />
                                Lock #{lock.id}
                              </h3>
                              <p className="text-sm text-slate-500">
                                {lock.zone} • {lock.skin}
                              </p>
                            </div>
                            <Badge className={lock.status === 'For_Sale' ? "bg-emerald-500" : "bg-slate-700"}>
                              {lock.status === 'For_Sale' ? 'For Sale' : 'Owned'}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-4 space-y-4">
                          {/* Lock Preview */}
                          <div className="flex gap-4 items-start">
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-white">
                              <Image
                                src={getSkinImage(lock.skin)}
                                alt={`Lock skin ${lock.skin}`}
                                width={64}
                                height={64}
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900 line-clamp-2">
                                {lock.content_text || 'No message'}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                Purchased: {safeDate(lock.created_at)}
                              </p>
                            </div>
                          </div>

                          {/* Media Section */}
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                {lock.media_type === 'photo' ? <ImageIcon size={16} /> :
                                  lock.media_type === 'video' ? <Video size={16} /> :
                                    lock.media_type === 'audio' ? <Mic size={16} /> :
                                      <Eye size={16} />}
                                Media Content
                              </p>
                              {!lock.media_type || lock.media_type === 'none' ? (
                                <Badge variant="outline" className="text-xs">Not enabled</Badge>
                              ) : (
                                <Badge className="bg-blue-600 text-xs">Enabled</Badge>
                              )}
                            </div>

                            {/* If media not enabled */}
                            {(!lock.media_type || lock.media_type === 'none') ? (
                              <div className="space-y-2">
                                <p className="text-xs text-slate-500">Add media to increase the value of your asset:</p>
                                <div className="grid grid-cols-3 gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleBuyMediaOption(lock.id, 'photo')} className="text-xs">
                                    <ImageIcon size={14} className="mr-1" /> Photo
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleBuyMediaOption(lock.id, 'video')} className="text-xs">
                                    <Video size={14} className="mr-1" /> Video
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleBuyMediaOption(lock.id, 'audio')} className="text-xs">
                                    <Mic size={14} className="mr-1" /> Audio
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {/* If media enabled but no content yet */}
                                {!lock.content_media_url ? (
                                  <div className="space-y-2">
                                    <p className="text-xs text-slate-500">Upload your {lock.media_type} content:</p>
                                    <div className="flex gap-2">
                                      <Input
                                        type="file"
                                        accept={
                                          lock.media_type === 'photo' ? 'image/*' :
                                            lock.media_type === 'video' ? 'video/*' :
                                              lock.media_type === 'audio' ? 'audio/*' : '*'
                                        }
                                        className="text-xs"
                                        disabled={uploading}
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleUploadMedia(lock.id, file, lock.media_type);
                                        }}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {/* Media preview */}
                                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                                      {lock.media_type === 'photo' ? (
                                        <Image
                                          src={lock.content_media_url}
                                          alt="Media content"
                                          width={400}
                                          height={250}
                                          className="w-full h-40 object-cover rounded-md"
                                        />
                                      ) : lock.media_type === 'video' ? (
                                        <div className="relative w-full h-40 bg-slate-900 rounded-md flex items-center justify-center">
                                          <PlayCircle className="text-white" size={48} />
                                          <p className="absolute bottom-2 left-2 text-xs text-white/80">Video uploaded</p>
                                        </div>
                                      ) : (
                                        <div className="w-full h-20 bg-slate-900 rounded-md flex items-center justify-center gap-2">
                                          <Music className="text-white" size={24} />
                                          <p className="text-white text-sm">Audio uploaded</p>
                                        </div>
                                      )}
                                    </div>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() => handleDeleteMedia(lock.id)}
                                    >
                                      <Trash2 size={14} className="mr-2" />
                                      Delete Media
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Resale Section */}
                          <div className="space-y-2">
                            <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                              <TrendingUp size={16} /> Resale
                            </p>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Price ($)"
                                value={priceInputs[lock.id] || ''}
                                onChange={(e) => handlePriceChange(lock.id, e.target.value)}
                                className="flex-1"
                                type="number"
                              />
                              <Button
                                onClick={() => handleSellToggle(lock.id, lock.status)}
                                className={lock.status === 'For_Sale' ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}
                              >
                                {lock.status === 'For_Sale' ? "Remove" : "Sell"}
                              </Button>
                            </div>
                          </div>

                          {/* Boost */}
                          <Button
                            variant="outline"
                            className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
                            onClick={() => router.push(`/boost?lock_id=${lock.id}`)}
                          >
                            <Zap size={16} className="mr-2" />
                            Boost Visibility
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ✅ PROFILE TAB (modifié) */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Identity</CardTitle>
                <CardDescription>Update your info anytime.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                  <p className="text-xs text-slate-500">If you change email, you may need to confirm it via email.</p>
                </div>

                <Button onClick={handleSaveProfile} className="bg-slate-900 text-white">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PAYOUT TAB */}
          <TabsContent value="bank">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wallet size={20} /> Payout Settings</CardTitle>
                <CardDescription>Setup your payout method for earnings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 max-w-lg">
                <div className="space-y-2">
                  <Label>Region</Label>
                  <select
                    className="w-full h-10 px-3 border border-slate-300 rounded-md bg-white text-sm"
                    value={bankZone}
                    onChange={(e) => setBankZone(e.target.value)}
                  >
                    <option value="EU">Europe (IBAN)</option>
                    <option value="US">USA (Routing)</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>{bankZone === 'EU' ? 'IBAN' : 'Account Number'}</Label>
                  <Input value={field1} onChange={(e) => setField1(e.target.value)} placeholder={bankZone === 'EU' ? 'FR76...' : '123456789'} />
                </div>

                <div className="space-y-2">
                  <Label>{bankZone === 'EU' ? 'BIC' : 'Routing Number'}</Label>
                  <Input value={field2} onChange={(e) => setField2(e.target.value)} placeholder={bankZone === 'EU' ? 'BNPAFRPP...' : '021000021'} />
                </div>

                <Button onClick={handleSaveBank} className="bg-slate-900 text-white w-full">
                  <CreditCard size={16} className="mr-2" /> Save Payout Method
                </Button>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
                  <p className="font-bold text-slate-700 mb-1">Payout schedule</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Processed every 30 days</li>
                    <li>Minimum threshold: $50</li>
                    <li>Secure verification may be required</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
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
