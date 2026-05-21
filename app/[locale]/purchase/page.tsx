'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Zone, Skin, MediaType, calculateLockPrice } from '@/lib/pricing';
import { ZoneSelector } from '@/components/purchase/zone-selector';
import { SkinSelector } from '@/components/purchase/skin-selector';
import { ContentForm } from '@/components/purchase/content-form';
import { NumberSelector } from '@/components/purchase/number-selector';
import { CheckoutSummary } from '@/components/purchase/checkout-summary';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, LayoutDashboard, Loader2, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

function PurchasePageContent() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);
  const [contentText, setContentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [visibility, setVisibility] = useState<'Private' | 'For_Sale'>('Private');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [imageRightsGranted, setImageRightsGranted] = useState(false);
  const [mediaType, setMediaType] = useState<MediaType>('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [customNumber, setCustomNumber] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [goldenAssetPrice, setGoldenAssetPrice] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const validZone = selectedZone !== null;
  const validSkin = selectedSkin !== null;
  const validContent = contentText.trim().length > 0 && termsAccepted;
  const validNumber = !customNumber || (selectedNumber !== null && selectedNumber >= 1 && selectedNumber <= 1000000);
  const mediaUploadLater = mediaType !== 'none' && !mediaFile && !mediaUrl;
  const currentPrice = selectedZone && selectedSkin
    ? calculateLockPrice(selectedZone, selectedSkin, mediaType, customNumber, visibility === 'Private') + (goldenAssetPrice || 0)
    : 0;

  async function handlePurchase() {
    if (isProcessing) return;

    if (!validZone || !validSkin || !validContent || !validNumber) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsProcessing(true);
    toast.loading('Redirecting to secure Stripe checkout...');

    try {
      let mediaFileData: string | null = null;
      let mediaFileName: string | null = null;
      let mediaFileType: string | null = null;

      if (mediaFile && !mediaUploadLater) {
        const reader = new FileReader();
        mediaFileData = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(mediaFile);
        });
        mediaFileName = mediaFile.name;
        mediaFileType = mediaFile.type;
      }

      const sessionResult = user ? await supabase.auth.getSession() : null;
      const session = sessionResult?.data?.session;
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          zone: selectedZone,
          skin: selectedSkin,
          contentText,
          mediaType,
          mediaUploadLater,
          totalPrice: currentPrice,
          customNumber,
          selectedNumber,
          authorName,
          goldenAssetPrice,
          isPrivate: visibility === 'Private',
          mediaFileData,
          mediaFileName,
          mediaFileType,
          userId: user?.id || null,
          userEmail: user?.email || null,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.assign(data.url);
      } else {
        toast.error('Payment Error: ' + (data.error || 'Unknown error'));
        setIsProcessing(false);
      }
    } catch {
      toast.error('Connection Error');
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
            <h1 className="text-lg font-bold font-serif text-slate-900">Configure Lock</h1>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <Button onClick={() => router.push('/dashboard')} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold hidden sm:flex"><LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard</Button>
              <Button variant="outline" size="sm" onClick={signOut}><LogOut className="h-4 w-4 mr-2" /> Logout</Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => setShowAuthDialog(true)} variant="outline" className="text-[#e11d48] border-rose-200">Login optional</Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto mb-8 rounded-xl border border-rose-100 bg-rose-50 p-4 flex gap-3">
          <Sparkles className="h-6 w-6 text-[#e11d48] mt-1" />
          <div><p className="font-bold text-rose-900">Design first. Pay now. Account after.</p><p className="text-sm text-rose-700">Create the lock without an account. Stripe collects the email during payment.</p></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <section><h2 className="text-xl font-bold mb-4">1. Choose Location</h2><ZoneSelector selectedZone={selectedZone} onSelectZone={setSelectedZone} /></section>
            {validZone && <section><h2 className="text-xl font-bold mb-4">2. Choose Design</h2><SkinSelector selectedSkin={selectedSkin} onSelectSkin={setSelectedSkin} /></section>}
            {validZone && validSkin && <section><h2 className="text-xl font-bold mb-4">3. Personalize Message</h2><ContentForm contentText={contentText} onContentTextChange={setContentText} authorName={authorName} onAuthorNameChange={setAuthorName} visibility={visibility} onVisibilityChange={setVisibility} termsAccepted={termsAccepted} onTermsAcceptedChange={setTermsAccepted} imageRightsGranted={imageRightsGranted} onImageRightsGrantedChange={setImageRightsGranted} mediaType={mediaType} onMediaTypeChange={setMediaType} mediaUrl={mediaUrl} onMediaUrlChange={setMediaUrl} mediaFile={mediaFile} onMediaFileChange={setMediaFile} /></section>}
            {validZone && validSkin && validContent && <section><h2 className="text-xl font-bold mb-4">4. Choose Number (Optional)</h2><NumberSelector customNumber={customNumber} onCustomNumberChange={setCustomNumber} selectedNumber={selectedNumber} onSelectedNumberChange={setSelectedNumber} onCheckAvailability={async () => true} onGoldenAssetPriceChange={setGoldenAssetPrice} /></section>}
            {validZone && validSkin && validContent && validNumber && <section className="rounded-xl border border-slate-200 bg-slate-50 p-6"><h2 className="text-xl font-bold mb-2">5. Review & Pay</h2><p className="text-slate-600 mb-5">Pay securely now. Your account can be created after payment to manage the lock.</p>{mediaUploadLater && <div className="mb-4 p-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700">Media selected. You can upload it later from Dashboard after payment.</div>}<Button onClick={handlePurchase} disabled={isProcessing} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 text-lg min-h-[64px]">{isProcessing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Redirecting to Stripe...</> : <><CreditCard className="mr-2 h-5 w-5" /> Pay Securely Now</>}</Button></section>}
          </div>
          <aside className="lg:col-span-1">
            {validZone || validSkin || validContent ? <CheckoutSummary zone={selectedZone} skin={selectedSkin} mediaType={mediaType} contentText={contentText} customNumber={customNumber} selectedNumber={selectedNumber} goldenAssetPrice={goldenAssetPrice} onPurchase={handlePurchase} isProcessing={isProcessing} /> : <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-400"><ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-20" /><p className="text-sm font-medium">Select a Zone & Skin to see summary.</p></div>}
          </aside>
        </div>
      </main>
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
}

export default function PurchasePage() {
  return <AuthProvider><Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-rose-600" /></div>}><PurchasePageContent /></Suspense></AuthProvider>;
}
