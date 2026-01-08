'use client';

// Force le rendu dynamique par sécurité
export const dynamic = 'force-dynamic';

import { useState, Suspense, useRef } from 'react';
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
import { 
  ArrowLeft, 
  LogOut, 
  Lock, 
  LayoutDashboard, 
  CheckCircle, 
  Loader2, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

function PurchasePageContent() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // --- ÉTAT ---
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

  // --- Références pour le scroll ---
  const zoneRef = useRef<HTMLDivElement>(null);
  const skinRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);

  // --- Validation ---
  const validateZone = () => selectedZone !== null;
  const validateSkin = () => selectedSkin !== null;
  const validateContent = () => contentText.trim().length > 0 && termsAccepted;
  const validateNumber = () => !customNumber || (selectedNumber !== null && selectedNumber >= 1 && selectedNumber <= 1000000);

  // --- Auto-scroll vers l'étape ---
  const scrollToStep = (step: string) => {
    setTimeout(() => {
      let ref = null;
      switch (step) {
        case 'zone': ref = zoneRef; break;
        case 'skin': ref = skinRef; break;
        case 'content': ref = contentRef; break;
        case 'number': ref = numberRef; break;
        case 'checkout': ref = checkoutRef; break;
      }
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // --- Gestion des sélections avec auto-progression ---
  const handleSelectZone = (zone: Zone) => {
    setSelectedZone(zone);
    setTimeout(() => scrollToStep('skin'), 100);
  };

  const handleSelectSkin = (skin: Skin) => {
    setSelectedSkin(skin);
    setTimeout(() => scrollToStep('content'), 100);
  };

  // --- Navigation entre étapes ---
  const goToStep = (step: string) => {
    scrollToStep(step);
  };

  // --- CALCUL DU PRIX ---
  const currentPrice = (selectedZone && selectedSkin)
    ? calculateLockPrice(selectedZone, selectedSkin, mediaType, customNumber, visibility === 'Private') + (goldenAssetPrice || 0)
    : 0;

  // --- PAIEMENT ---
  const handlePurchase = async () => {
    if (!user) { setShowAuthDialog(true); return; }
    if (!validateZone() || !validateSkin() || !validateContent() || !validateNumber()) { 
      toast.error('Please complete all required fields'); 
      return; 
    }
    
    setIsProcessing(true);
    toast.loading("Processing payment...");

    try {
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
        
        mediaFileData = await toBase64(mediaFile);
        mediaFileName = mediaFile.name;
        mediaFileType = mediaFile.type;
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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* HEADER SIMPLIFIÉ */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-600 hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-slate-900">Secure Your Lock</h1>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button onClick={() => router.push('/dashboard')} size="sm" variant="ghost" className="hidden sm:flex">
                  Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={signOut} className="text-slate-600">
                  Logout
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setShowAuthDialog(true)} className="bg-[#e11d48] text-white">
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        
        {/* BANDEAU CONNECTÉ */}
        {user && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-900">Logged in as {user.email}</p>
            </div>
            <Button onClick={() => router.push('/dashboard')} size="sm" variant="ghost" className="text-emerald-700">
              Dashboard
            </Button>
          </div>
        )}

        {!user ? (
          // ECRAN LOGIN
          <div className="text-center py-16">
            <Lock className="h-16 w-16 text-[#e11d48] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Login to Continue</h2>
            <p className="text-slate-500 mb-6">
              You must be logged in to secure your spot.
            </p>
            <Button onClick={() => setShowAuthDialog(true)} className="bg-[#e11d48] text-white px-8 py-6 text-lg">
              Login / Register
            </Button>
          </div>
        ) : (
          // FORMULAIRE DYNAMIQUE
          <div className="max-w-4xl mx-auto">
            {/* ÉTAPE 1: ZONE */}
            <div ref={zoneRef} className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">1. Choose Location</h2>
                {validateZone() && (
                  <Check className="h-5 w-5 text-emerald-500" />
                )}
              </div>
              <ZoneSelector 
                selectedZone={selectedZone} 
                onSelectZone={handleSelectZone}
              />
            </div>

            {/* ÉTAPE 2: SKIN */}
            {validateZone() && (
              <div ref={skinRef} className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">2. Choose Design</h2>
                  {validateSkin() && (
                    <Check className="h-5 w-5 text-emerald-500" />
                  )}
                </div>
                <SkinSelector 
                  selectedSkin={selectedSkin} 
                  onSelectSkin={handleSelectSkin}
                />
              </div>
            )}

            {/* ÉTAPE 3: CONTENT */}
            {validateZone() && validateSkin() && (
              <div ref={contentRef} className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">3. Personalize Message</h2>
                  {validateContent() && (
                    <Check className="h-5 w-5 text-emerald-500" />
                  )}
                </div>
                <ContentForm 
                  contentText={contentText} onContentTextChange={setContentText}
                  authorName={authorName} onAuthorNameChange={setAuthorName}
                  visibility={visibility} onVisibilityChange={(v) => setVisibility(v)}
                  termsAccepted={termsAccepted} onTermsAcceptedChange={setTermsAccepted}
                  imageRightsGranted={imageRightsGranted} onImageRightsGrantedChange={setImageRightsGranted}
                  mediaType={mediaType} onMediaTypeChange={setMediaType}
                  mediaUrl={mediaUrl} onMediaUrlChange={setMediaUrl} mediaFile={mediaFile} onMediaFileChange={setMediaFile}
                />
              </div>
            )}

            {/* ÉTAPE 4: NUMBER */}
            {validateZone() && validateSkin() && validateContent() && (
              <div ref={numberRef} className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">4. Choose Number (Optional)</h2>
                  {validateNumber() && (
                    <Check className="h-5 w-5 text-emerald-500" />
                  )}
                </div>
                <NumberSelector 
                  customNumber={customNumber} onCustomNumberChange={setCustomNumber}
                  selectedNumber={selectedNumber} onSelectedNumberChange={setSelectedNumber}
                  onCheckAvailability={async (n) => true} 
                  onGoldenAssetPriceChange={setGoldenAssetPrice}
                />
              </div>
            )}

            {/* ÉTAPE 5: CHECKOUT */}
            {validateZone() && validateSkin() && validateContent() && validateNumber() && (
              <div ref={checkoutRef} className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">5. Review & Checkout</h2>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <CheckoutSummary
                    zone={selectedZone} 
                    skin={selectedSkin} 
                    mediaType={mediaType}
                    contentText={contentText} 
                    customNumber={customNumber}
                    selectedNumber={selectedNumber} 
                    goldenAssetPrice={goldenAssetPrice}
                    onPurchase={handlePurchase}
                    isProcessing={isProcessing}
                  />
                  <Button
                    onClick={handlePurchase}
                    disabled={isProcessing}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Complete Purchase'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* NAVIGATION RAPIDE (flottante) */}
            <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-10">
              {selectedZone && (
                <Button variant="outline" size="sm" onClick={() => goToStep('zone')} className="bg-white">
                  Location ✓
                </Button>
              )}
              {selectedSkin && (
                <Button variant="outline" size="sm" onClick={() => goToStep('skin')} className="bg-white">
                  Design ✓
                </Button>
              )}
              {contentText && termsAccepted && (
                <Button variant="outline" size="sm" onClick={() => goToStep('content')} className="bg-white">
                  Message ✓
                </Button>
              )}
              {(customNumber ? selectedNumber : true) && (
                <Button variant="outline" size="sm" onClick={() => goToStep('number')} className="bg-white">
                  Number ✓
                </Button>
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
