'use client';

// Force le rendu dynamique par sécurité
export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
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
// CORRECTION ICI : Ajout de ShieldCheck
import { ArrowLeft, LogOut, Lock, LayoutDashboard, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

function PurchasePageContent() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // --- ETAT ---
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

  // --- CALCUL DU PRIX TOTAL (LIVE) ---
  const currentPrice = (selectedZone && selectedSkin)
    ? calculateLockPrice(selectedZone, selectedSkin, mediaType, customNumber, visibility === 'Private') + (goldenAssetPrice || 0)
    : 0;

  // --- FONCTION DE PAIEMENT COMPLETE ---
  const handlePurchase = async () => {
    if (!user) { setShowAuthDialog(true); return; }
    if (!selectedZone || !selectedSkin) { toast.error('Please select a Zone and Material'); return; }
    if (!contentText.trim()) { toast.error('Please enter a message'); return; }
    if (!termsAccepted) { toast.error('Please accept Terms'); return; }
    
    setIsProcessing(true);
    toast.loading("Processing payment...");

    try {
      // Gestion Fichier Média
      let mediaFileData = null;
      let mediaFileName = null;
      let mediaFileType = null;

      if (mediaFile) {
        const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
        
        try {
          mediaFileData = await toBase64(mediaFile);
          mediaFileName = mediaFile.name;
          mediaFileType = mediaFile.type;
        } catch (e) {
          console.error("Erreur fichier", e);
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/checkout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          zone: selectedZone,
          skin: selectedSkin,
          contentText,
          mediaType,
          totalPrice: currentPrice,
          customNumber,
          selectedNumber,
          authorName,
          goldenAssetPrice,
          isPrivate: visibility === 'Private',
          mediaFileData,
          mediaFileName,
          mediaFileType,
          userId: user.id, 
          userEmail: user.email
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; 
      } else {
        toast.error('Payment Error: ' + (data.error || 'Unknown error'));
        setIsProcessing(false);
      }

    } catch (error) {
      toast.error('Connection Error');
      setIsProcessing(false);
    }
  };

  const canCheckout = selectedZone && selectedSkin && contentText.trim() && termsAccepted;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-600 hover:bg-slate-100">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-bold font-serif text-slate-900">Configure Lock</h1>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                 <div className="flex items-center gap-2">
                   <Button onClick={() => router.push('/dashboard')} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold hidden sm:flex shadow-sm">
                     <LayoutDashboard className="h-4 w-4 mr-2"/> Dashboard
                   </Button>
                   <Button variant="outline" size="sm" onClick={signOut} className="text-slate-600 border-slate-300 hover:bg-slate-50">
                     <LogOut className="h-4 w-4 mr-2"/> Logout
                   </Button>
                 </div>
              ) : (
                 <Button size="sm" onClick={() => setShowAuthDialog(true)} className="bg-[#e11d48] text-white hover:bg-[#be123c] shadow-md">
                   Login
                 </Button>
              )}
            </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        
        {/* --- BANDEAU CONNECTÉ (UX) --- */}
        {user && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top max-w-6xl mx-auto">
             <div className="flex items-center gap-3">
               <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                 <CheckCircle className="h-6 w-6" />
               </div>
               <div>
                 <p className="font-bold text-emerald-900">Logged in as {user.email}</p>
                 <p className="text-xs text-emerald-700">Ready to secure a new asset.</p>
               </div>
             </div>
             <Button 
               onClick={() => router.push('/dashboard')} 
               variant="outline"
               className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold shadow-sm"
             >
               Go to My Dashboard
             </Button>
          </div>
        )}

        {!user ? (
          // ECRAN LOGIN (Si pas connecté)
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-rose-50 mb-6 text-[#e11d48] shadow-sm border border-rose-100 animate-pulse">
              <Lock size={48} />
            </div>
            <h2 className="text-4xl font-serif font-bold mb-4 text-slate-900">Login to Continue</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
              You must be logged in to secure your spot on the Official Registry of Paris.
            </p>
            <Button size="lg" onClick={() => setShowAuthDialog(true)} className="bg-[#e11d48] text-white font-bold px-12 py-8 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              Login / Register
            </Button>
          </div>
        ) : (
          // GRILLE DE COMMANDE (Si connecté)
          <div className="grid lg:grid-cols-3 gap-8 items-start max-w-7xl mx-auto">
            <div className="lg:col-span-2 space-y-8">
              
              <ZoneSelector selectedZone={selectedZone} onSelectZone={setSelectedZone} />
              
              {selectedZone && <SkinSelector selectedSkin={selectedSkin} onSelectSkin={setSelectedSkin} />}
              
              {selectedZone && selectedSkin && (
                <>
                  <ContentForm 
                    contentText={contentText} onContentTextChange={setContentText}
                    authorName={authorName} onAuthorNameChange={setAuthorName}
                    visibility={visibility} onVisibilityChange={(v) => setVisibility(v)}
                    termsAccepted={termsAccepted} onTermsAcceptedChange={setTermsAccepted}
                    imageRightsGranted={imageRightsGranted} onImageRightsGrantedChange={setImageRightsGranted}
                    mediaType={mediaType} onMediaTypeChange={setMediaType}
                    mediaUrl={mediaUrl} onMediaUrlChange={setMediaUrl} mediaFile={mediaFile} onMediaFileChange={setMediaFile}
                  />
                  <NumberSelector 
                    customNumber={customNumber} onCustomNumberChange={setCustomNumber}
                    selectedNumber={selectedNumber} onSelectedNumberChange={setSelectedNumber}
                    onCheckAvailability={async (n) => true} 
                    onGoldenAssetPriceChange={setGoldenAssetPrice}
                  />
                </>
              )}
            </div>

            {/* SIDEBAR RÉSUMÉ */}
            <div className="lg:col-span-1 lg:sticky lg:top-24">
              {canCheckout ? (
                <CheckoutSummary
                  zone={selectedZone} skin={selectedSkin} mediaType={mediaType}
                  contentText={contentText} customNumber={customNumber}
                  selectedNumber={selectedNumber} goldenAssetPrice={goldenAssetPrice}
                  onPurchase={handlePurchase}
                  isProcessing={isProcessing}
                />
              ) : (
                <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-400">
                  <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">Select a Zone & Skin to see summary.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
}

export default function PurchasePage() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-rose-600"/></div>}>
        <PurchasePageContent />
      </Suspense>
    </AuthProvider>
  );
}
