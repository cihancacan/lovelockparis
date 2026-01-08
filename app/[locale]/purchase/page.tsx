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
import { 
  ArrowLeft, 
  LogOut, 
  Lock, 
  LayoutDashboard, 
  CheckCircle, 
  Loader2, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

function PurchasePageContent() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // --- ÉTAT SIMPLE ---
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

  // --- Gestion des étapes ---
  const [step, setStep] = useState(1); // 1=Zone, 2=Skin, 3=Content, 4=Number, 5=Checkout

  // --- Validation des étapes ---
  const validateStep = (stepNum: number) => {
    switch (stepNum) {
      case 1: return selectedZone !== null;
      case 2: return selectedSkin !== null;
      case 3: return contentText.trim().length > 0 && termsAccepted;
      case 4: 
        if (customNumber) {
          return selectedNumber !== null && selectedNumber >= 1 && selectedNumber <= 1000000;
        }
        return true; // Si customNumber est désactivé, on peut passer
      default: return true;
    }
  };

  // --- Navigation ---
  const goToNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Message d'erreur spécifique
      switch (step) {
        case 1: toast.error('Please select a location'); break;
        case 2: toast.error('Please select a design'); break;
        case 3: 
          if (!contentText.trim()) toast.error('Please enter a message');
          else if (!termsAccepted) toast.error('Please accept the terms');
          break;
        case 4: toast.error('Please enter a valid custom number'); break;
      }
    }
  };

  const goToPrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- Gestion de customNumber avec validation automatique ---
  const handleCustomNumberChange = (isCustom: boolean) => {
    setCustomNumber(isCustom);
    if (!isCustom) {
      setSelectedNumber(null);
      // Si on désactive customNumber, on peut passer à l'étape suivante
      if (step === 4) {
        setTimeout(() => goToNextStep(), 100);
      }
    }
  };

  const handleNumberSelected = (num: number | null) => {
    setSelectedNumber(num);
    // Si un numéro valide est sélectionné, auto-avancer après un délai
    if (num !== null && step === 4) {
      setTimeout(() => {
        if (validateStep(4)) {
          goToNextStep();
        }
      }, 500);
    }
  };

  // --- CALCUL DU PRIX ---
  const currentPrice = (selectedZone && selectedSkin)
    ? calculateLockPrice(selectedZone, selectedSkin, mediaType, customNumber, visibility === 'Private') + (goldenAssetPrice || 0)
    : 0;

  // --- PAIEMENT ---
  const handlePurchase = async () => {
    if (!user) { setShowAuthDialog(true); return; }
    
    // Validation finale
    if (!selectedZone || !selectedSkin || !contentText.trim() || !termsAccepted) {
      toast.error('Please complete all required fields');
      return;
    }
    
    if (customNumber && !selectedNumber) {
      toast.error('Please enter a custom number');
      return;
    }
    
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

  // --- RENDU SIMPLE ---
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
        
        {/* --- BANDEAU CONNECTÉ --- */}
        {user && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8 max-w-6xl mx-auto">
             <div className="flex items-center gap-3">
               <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                 <CheckCircle className="h-6 w-6" />
               </div>
               <div>
                 <p className="font-bold text-emerald-900">Logged in as {user.email}</p>
               </div>
             </div>
          </div>
        )}

        {!user ? (
          // ECRAN LOGIN
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-rose-50 mb-6 text-[#e11d48] shadow-sm border border-rose-100">
              <Lock size={48} />
            </div>
            <h2 className="text-4xl font-serif font-bold mb-4 text-slate-900">Login to Continue</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
              You must be logged in to secure your spot on the Official Registry of Paris.
            </p>
            <Button size="lg" onClick={() => setShowAuthDialog(true)} className="bg-[#e11d48] text-white font-bold px-12 py-8 text-xl rounded-full shadow-xl">
              Login / Register
            </Button>
          </div>
        ) : (
          // PROCESSUS D'ACHAT
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-8">
                
                {/* ÉTAPE 1: ZONE */}
                {step >= 1 && (
                  <div className={step === 1 ? 'opacity-100' : 'opacity-60'}>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Choose Location</h2>
                    <ZoneSelector 
                      selectedZone={selectedZone} 
                      onSelectZone={(zone) => {
                        setSelectedZone(zone);
                        // Auto-avancer après sélection
                        setTimeout(() => {
                          setStep(2);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 300);
                      }}
                    />
                  </div>
                )}

                {/* ÉTAPE 2: SKIN */}
                {step >= 2 && selectedZone && (
                  <div className={step === 2 ? 'opacity-100' : 'opacity-60'}>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Choose Design</h2>
                    <SkinSelector 
                      selectedSkin={selectedSkin} 
                      onSelectSkin={(skin) => {
                        setSelectedSkin(skin);
                        // Auto-avancer après sélection
                        setTimeout(() => {
                          setStep(3);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 300);
                      }}
                    />
                  </div>
                )}

                {/* ÉTAPE 3: CONTENT */}
                {step >= 3 && selectedZone && selectedSkin && (
                  <div className={step === 3 ? 'opacity-100' : 'opacity-60'}>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Personalize Message</h2>
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
                {step >= 4 && selectedZone && selectedSkin && contentText.trim() && termsAccepted && (
                  <div className={step === 4 ? 'opacity-100' : 'opacity-60'}>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Custom Number (Optional)</h2>
                    <NumberSelector 
                      customNumber={customNumber} 
                      onCustomNumberChange={handleCustomNumberChange}
                      selectedNumber={selectedNumber} 
                      onSelectedNumberChange={handleNumberSelected}
                      onCheckAvailability={async (n) => true} 
                      onGoldenAssetPriceChange={setGoldenAssetPrice}
                    />
                    {customNumber && selectedNumber && step === 4 && (
                      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-emerald-700 text-sm">
                          ✓ Number #{selectedNumber} selected
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ÉTAPE 5: CHECKOUT */}
                {step === 5 && (
                  <div className="opacity-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Complete Purchase</h2>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                      <p className="text-slate-600 mb-6">
                        All steps completed! Review your selection and proceed to payment.
                      </p>
                    </div>
                  </div>
                )}

                {/* BOUTONS DE NAVIGATION */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                  <Button
                    variant="outline"
                    onClick={goToPrevStep}
                    disabled={step === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                  
                  {step < 5 ? (
                    <Button
                      onClick={goToNextStep}
                      disabled={!validateStep(step)}
                      className="bg-[#e11d48] hover:bg-[#be123c] text-white font-bold flex items-center gap-2"
                    >
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePurchase}
                      disabled={isProcessing}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Pay Now'
                      )}
                    </Button>
                  )}
                </div>

                {/* INDICATEUR D'ÉTAPE SIMPLE */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div
                      key={num}
                      className={`w-2 h-2 rounded-full ${
                        step === num 
                          ? 'bg-[#e11d48]' 
                          : step > num 
                          ? 'bg-emerald-500' 
                          : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* SIDEBAR RÉSUMÉ */}
              <div className="lg:col-span-1 lg:sticky lg:top-24">
                {(selectedZone || selectedSkin || contentText) ? (
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
                ) : (
                  <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-400">
                    <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium">Complete the steps to see summary</p>
                  </div>
                )}
              </div>
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
