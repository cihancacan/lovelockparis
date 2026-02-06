'use client';

// Force le rendu dynamique par sécurité
export const dynamic = 'force-dynamic';

import { useState, Suspense, useEffect, useRef } from 'react';
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
  ChevronDown,
  Check,
  MapPin,
  Palette,
  FileText,
  Hash,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';

function PurchasePageContent() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // --- Références pour le scroll ---
  const zoneRef = useRef<HTMLDivElement>(null);
  const skinRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);

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

  // --- Gestion simple de la progression ---
  const [currentStep, setCurrentStep] = useState<'zone' | 'skin' | 'content' | 'number' | 'checkout'>('zone');

  // --- Validation simple ---
  const validateZone = () => selectedZone !== null;
  const validateSkin = () => selectedSkin !== null;
  const validateContent = () => contentText.trim().length > 0 && termsAccepted;
  const validateNumber = () => !customNumber || (selectedNumber !== null && selectedNumber >= 1 && selectedNumber <= 1000000);

  // --- Auto-scroll vers l'étape ---
  const scrollToStep = (step: string) => {
    setTimeout(() => {
      let ref: React.RefObject<HTMLDivElement> | null = null;
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
    }, 100);
  };

  // --- Gestion des sélections avec auto-progression ---
  const handleSelectZone = (zone: Zone) => {
    setSelectedZone(zone);
    setTimeout(() => {
      setCurrentStep('skin');
      scrollToStep('skin');
    }, 300);
  };

  const handleSelectSkin = (skin: Skin) => {
    setSelectedSkin(skin);
    setTimeout(() => {
      setCurrentStep('content');
      scrollToStep('content');
    }, 300);
  };

  // --- Validation et progression manuelle ---
  const goToNextStep = () => {
    switch (currentStep) {
      case 'zone':
        if (validateZone()) {
          setCurrentStep('skin');
          scrollToStep('skin');
        } else {
          toast.error('Please select a location');
        }
        break;
      case 'skin':
        if (validateSkin()) {
          setCurrentStep('content');
          scrollToStep('content');
        } else {
          toast.error('Please select a design');
        }
        break;
      case 'content':
        if (validateContent()) {
          setCurrentStep('number');
          scrollToStep('number');
        } else if (!contentText.trim()) {
          toast.error('Please enter a message');
        } else {
          toast.error('Please accept the terms and conditions');
        }
        break;
      case 'number':
        if (validateNumber()) {
          setCurrentStep('checkout');
          scrollToStep('checkout');
        } else {
          toast.error('Please enter a valid number or disable custom number');
        }
        break;
    }
  };

  const goToStep = (step: string) => {
    if (step === 'zone') {
      setCurrentStep(step as any);
      scrollToStep(step);
    } else if (step === 'skin' && validateZone()) {
      setCurrentStep(step as any);
      scrollToStep(step);
    } else if (step === 'content' && validateZone() && validateSkin()) {
      setCurrentStep(step as any);
      scrollToStep(step);
    } else if (step === 'number' && validateZone() && validateSkin() && validateContent()) {
      setCurrentStep(step as any);
      scrollToStep(step);
    } else if (step === 'checkout' && validateZone() && validateSkin() && validateContent() && validateNumber()) {
      setCurrentStep(step as any);
      scrollToStep(step);
    } else {
      toast.error('Please complete previous steps first');
    }
  };

  // --- CALCUL DU PRIX TOTAL (LIVE) ---
  const currentPrice =
    selectedZone && selectedSkin
      ? calculateLockPrice(selectedZone, selectedSkin, mediaType, customNumber, visibility === 'Private') + (goldenAssetPrice || 0)
      : 0;

  // ✅ ✅ ✅ PAIEMENT : autoriser sans login
  const handlePurchase = async () => {
    // Guest email si pas connecté
    let guestEmail = '';
    if (!user) {
      guestEmail = (window.prompt('Enter your email to receive your Love Lock receipt and access:') || '').trim();
      if (!guestEmail) {
        toast.error('Email is required to continue');
        return;
      }
    }

    if (!validateZone() || !validateSkin() || !validateContent()) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsProcessing(true);
    toast.loading('Processing payment...');

    try {
      // Gestion Fichier Média
      let mediaFileData: string | null = null;
      let mediaFileName: string | null = null;
      let mediaFileType: string | null = null;

      if (mediaFile) {
        const toBase64 = (file: File) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
          });

        try {
          mediaFileData = await toBase64(mediaFile);
          mediaFileName = mediaFile.name;
          mediaFileType = mediaFile.type;
        } catch (e) {
          console.error('Erreur fichier', e);
        }
      }

      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          type: 'new_lock',
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
          userId: user?.id || null,
          userEmail: user?.email || guestEmail,
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

  // --- Liste des étapes pour la navigation ---
  const steps = [
    { id: 'zone', label: 'Location', icon: <MapPin className="h-5 w-5" />, completed: validateZone() },
    { id: 'skin', label: 'Design', icon: <Palette className="h-5 w-5" />, completed: validateSkin() },
    { id: 'content', label: 'Message', icon: <FileText className="h-5 w-5" />, completed: validateContent() },
    { id: 'number', label: 'Number', icon: <Hash className="h-5 w-5" />, completed: validateNumber() },
    { id: 'checkout', label: 'Checkout', icon: <CreditCard className="h-5 w-5" />, completed: false },
  ];

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
                <Button
                  onClick={() => router.push('/dashboard')}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold hidden sm:flex shadow-sm"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={signOut} className="text-slate-600 border-slate-300 hover:bg-slate-50">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => setShowAuthDialog(true)} className="bg-[#e11d48] text-white hover:bg-[#be123c] shadow-md">
                Login (optional)
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* ✅ Bandeau invité (sans bloquer) */}
        {!user && (
          <div className="max-w-6xl mx-auto mb-8 bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full text-[#e11d48] shadow-sm border border-rose-100">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">You can purchase without creating an account.</p>
                <p className="text-xs text-slate-600">We’ll ask your email only at payment to send your receipt and access.</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowAuthDialog(true)} className="bg-white border-rose-200 text-slate-800 hover:bg-rose-100 font-bold">
              Login / Register (optional)
            </Button>
          </div>
        )}

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

        {/* ✅ On affiche TOUJOURS le parcours (plus de blocage login) */}
        <div className="max-w-7xl mx-auto">
          {/* --- NAVIGATION SIMPLE --- */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    currentStep === step.id
                      ? 'bg-[#e11d48] text-white border-[#e11d48] shadow-md'
                      : step.completed
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {step.completed ? <Check className="h-4 w-4" /> : step.icon}
                  <span className="font-medium text-sm">{step.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              {/* ÉTAPE 1: ZONE */}
              <div ref={zoneRef}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#e11d48]" />
                    1. Choose Location
                  </h2>
                  {validateZone() && (
                    <div className="flex items-center gap-1 text-emerald-600 text-sm">
                      <Check className="h-4 w-4" />
                      <span>Selected</span>
                    </div>
                  )}
                </div>

                <ZoneSelector selectedZone={selectedZone} onSelectZone={handleSelectZone} />

                {currentStep === 'zone' && validateZone() && (
                  <div className="mt-4 text-center">
                    <Button onClick={goToNextStep} className="bg-[#e11d48] hover:bg-[#be123c] text-white">
                      Continue to Design <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* ÉTAPE 2: SKIN */}
              {validateZone() && (
                <div ref={skinRef} className={`transition-opacity ${currentStep === 'skin' ? 'opacity-100' : 'opacity-70'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Palette className="h-5 w-5 text-[#e11d48]" />
                      2. Choose Design
                    </h2>
                    {validateSkin() && (
                      <div className="flex items-center gap-1 text-emerald-600 text-sm">
                        <Check className="h-4 w-4" />
                        <span>Selected</span>
                      </div>
                    )}
                  </div>

                  <SkinSelector selectedSkin={selectedSkin} onSelectSkin={handleSelectSkin} />

                  {currentStep === 'skin' && validateSkin() && (
                    <div className="mt-4 text-center">
                      <Button onClick={goToNextStep} className="bg-[#e11d48] hover:bg-[#be123c] text-white">
                        Continue to Message <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* ÉTAPE 3: CONTENT */}
              {validateZone() && validateSkin() && (
                <div ref={contentRef} className={`transition-opacity ${currentStep === 'content' ? 'opacity-100' : 'opacity-70'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#e11d48]" />
                      3. Personalize Message
                    </h2>
                    {validateContent() && (
                      <div className="flex items-center gap-1 text-emerald-600 text-sm">
                        <Check className="h-4 w-4" />
                        <span>Complete</span>
                      </div>
                    )}
                  </div>

                  <ContentForm
                    contentText={contentText}
                    onContentTextChange={setContentText}
                    authorName={authorName}
                    onAuthorNameChange={setAuthorName}
                    visibility={visibility}
                    onVisibilityChange={(v) => setVisibility(v)}
                    termsAccepted={termsAccepted}
                    onTermsAcceptedChange={setTermsAccepted}
                    imageRightsGranted={imageRightsGranted}
                    onImageRightsGrantedChange={setImageRightsGranted}
                    mediaType={mediaType}
                    onMediaTypeChange={setMediaType}
                    mediaUrl={mediaUrl}
                    onMediaUrlChange={setMediaUrl}
                    mediaFile={mediaFile}
                    onMediaFileChange={setMediaFile}
                  />

                  {currentStep === 'content' && validateContent() && (
                    <div className="mt-4 text-center">
                      <Button onClick={goToNextStep} className="bg-[#e11d48] hover:bg-[#be123c] text-white">
                        Continue to Number <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* ÉTAPE 4: NUMBER */}
              {validateZone() && validateSkin() && validateContent() && (
                <div ref={numberRef} className={`transition-opacity ${currentStep === 'number' ? 'opacity-100' : 'opacity-70'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Hash className="h-5 w-5 text-[#e11d48]" />
                      4. Choose Number (Optional)
                    </h2>
                    {validateNumber() && (
                      <div className="flex items-center gap-1 text-emerald-600 text-sm">
                        <Check className="h-4 w-4" />
                        <span>Complete</span>
                      </div>
                    )}
                  </div>

                  <NumberSelector
                    customNumber={customNumber}
                    onCustomNumberChange={setCustomNumber}
                    selectedNumber={selectedNumber}
                    onSelectedNumberChange={setSelectedNumber}
                    onCheckAvailability={async () => true}
                    onGoldenAssetPriceChange={setGoldenAssetPrice}
                  />

                  {currentStep === 'number' && validateNumber() && (
                    <div className="mt-4 text-center">
                      <Button onClick={goToNextStep} className="bg-[#e11d48] hover:bg-[#be123c] text-white">
                        Continue to Checkout <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* ÉTAPE 5: CHECKOUT */}
              {validateZone() && validateSkin() && validateContent() && validateNumber() && (
                <div ref={checkoutRef} className={`transition-opacity ${currentStep === 'checkout' ? 'opacity-100' : 'opacity-70'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-[#e11d48]" />
                      5. Review & Checkout
                    </h2>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4">Ready to Complete</h3>
                    <p className="text-slate-600 mb-6">
                      Review your selection below and proceed to payment.
                      {!user && (
                        <span className="block mt-2 text-xs text-slate-500">
                          (No account needed — we’ll ask your email at payment.)
                        </span>
                      )}
                    </p>

                    <Button
                      onClick={handlePurchase}
                      disabled={isProcessing}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 text-lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        'Complete Purchase'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* SIDEBAR RÉSUMÉ */}
            <div className="lg:col-span-1 lg:sticky lg:top-24">
              {validateZone() || validateSkin() || validateContent() ? (
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
                  <p className="text-sm font-medium">Select a Zone & Skin to see summary.</p>
                </div>
              )}

              {/* INDICATEUR DE PROGRESSION */}
              <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-700 mb-3">Progress</p>
                <div className="space-y-2">
                  {steps.slice(0, -1).map((step) => (
                    <div key={step.id} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{step.label}</span>
                      {step.completed ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {!user && (
                <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-600">
                  <p className="font-bold mb-1">Tip</p>
                  <p>
                    If you want to manage your locks later, you can create an account anytime with the same email you use for payment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
}

export default function PurchasePage() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-rose-600" />
          </div>
        }
      >
        <PurchasePageContent />
      </Suspense>
    </AuthProvider>
  );
}
