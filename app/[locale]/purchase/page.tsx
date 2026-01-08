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
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  LogOut, 
  Lock, 
  LayoutDashboard, 
  CheckCircle, 
  Loader2, 
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  Palette,
  FileText,
  Hash,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Énumération des étapes
enum PurchaseStep {
  ZONE = 'zone',
  SKIN = 'skin',
  CONTENT = 'content',
  NUMBER = 'number',
  CHECKOUT = 'checkout'
}

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
  
  // --- ÉTAT DE NAVIGATION ---
  const [currentStep, setCurrentStep] = useState<PurchaseStep>(PurchaseStep.ZONE);
  const [completedSteps, setCompletedSteps] = useState<PurchaseStep[]>([]);

  // --- ETAT DES DONNÉES ---
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

  // --- VALIDATION DES ÉTAPES ---
  const validateStep = (step: PurchaseStep): boolean => {
    switch (step) {
      case PurchaseStep.ZONE:
        return selectedZone !== null;
      case PurchaseStep.SKIN:
        return selectedSkin !== null;
      case PurchaseStep.CONTENT:
        return contentText.trim().length > 0 && termsAccepted;
      case PurchaseStep.NUMBER:
        if (customNumber) {
          return selectedNumber !== null && selectedNumber >= 1 && selectedNumber <= 1000000;
        }
        return true; // Le numéro n'est pas obligatoire si customNumber est false
      case PurchaseStep.CHECKOUT:
        return selectedZone !== null && 
               selectedSkin !== null && 
               contentText.trim().length > 0 && 
               termsAccepted;
      default:
        return false;
    }
  };

  // --- GESTION DE LA NAVIGATION ---
  const goToNextStep = () => {
    const currentStepIndex = Object.values(PurchaseStep).indexOf(currentStep);
    const nextStep = Object.values(PurchaseStep)[currentStepIndex + 1];
    
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(nextStep);
      // Scroll vers l'étape suivante
      scrollToStep(nextStep);
    } else {
      toast.error('Please complete this step before continuing');
      highlightInvalidFields(currentStep);
    }
  };

  const goToPrevStep = () => {
    const currentStepIndex = Object.values(PurchaseStep).indexOf(currentStep);
    const prevStep = Object.values(PurchaseStep)[currentStepIndex - 1];
    if (prevStep) {
      setCurrentStep(prevStep);
      scrollToStep(prevStep);
    }
  };

  const goToStep = (step: PurchaseStep) => {
    // On ne peut aller qu'à une étape déjà complétée ou à la suivante
    const stepIndex = Object.values(PurchaseStep).indexOf(step);
    const currentIndex = Object.values(PurchaseStep).indexOf(currentStep);
    
    if (completedSteps.includes(step) || stepIndex <= currentIndex) {
      setCurrentStep(step);
      scrollToStep(step);
    }
  };

  const scrollToStep = (step: PurchaseStep) => {
    setTimeout(() => {
      let ref = null;
      switch (step) {
        case PurchaseStep.ZONE: ref = zoneRef; break;
        case PurchaseStep.SKIN: ref = skinRef; break;
        case PurchaseStep.CONTENT: ref = contentRef; break;
        case PurchaseStep.NUMBER: ref = numberRef; break;
        case PurchaseStep.CHECKOUT: ref = checkoutRef; break;
      }
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const highlightInvalidFields = (step: PurchaseStep) => {
    switch (step) {
      case PurchaseStep.ZONE:
        toast.error('Please select a location');
        break;
      case PurchaseStep.SKIN:
        toast.error('Please select a design');
        break;
      case PurchaseStep.CONTENT:
        if (!contentText.trim()) {
          toast.error('Please enter a message');
        } else if (!termsAccepted) {
          toast.error('Please accept the terms and conditions');
        }
        break;
      case PurchaseStep.NUMBER:
        if (customNumber && (!selectedNumber || selectedNumber < 1 || selectedNumber > 1000000)) {
          toast.error('Please enter a valid number between 1 and 1,000,000');
        }
        break;
    }
  };

  // --- Gestion des sélections avec auto-avancement ---
  const handleSelectZone = (zone: Zone) => {
    setSelectedZone(zone);
    // Auto-avancer après un délai
    setTimeout(() => {
      if (validateStep(PurchaseStep.ZONE)) {
        if (!completedSteps.includes(PurchaseStep.ZONE)) {
          setCompletedSteps([...completedSteps, PurchaseStep.ZONE]);
        }
        setCurrentStep(PurchaseStep.SKIN);
        scrollToStep(PurchaseStep.SKIN);
      }
    }, 500);
  };

  const handleSelectSkin = (skin: Skin) => {
    setSelectedSkin(skin);
    // Auto-avancer après un délai
    setTimeout(() => {
      if (validateStep(PurchaseStep.SKIN)) {
        if (!completedSteps.includes(PurchaseStep.SKIN)) {
          setCompletedSteps([...completedSteps, PurchaseStep.SKIN]);
        }
        setCurrentStep(PurchaseStep.CONTENT);
        scrollToStep(PurchaseStep.CONTENT);
      }
    }, 500);
  };

  const handleContentChange = (text: string) => {
    setContentText(text);
  };

  const handleTermsAccept = (accepted: boolean) => {
    setTermsAccepted(accepted);
  };

  // --- CALCUL DU PRIX TOTAL (LIVE) ---
  const currentPrice = (selectedZone && selectedSkin)
    ? calculateLockPrice(selectedZone, selectedSkin, mediaType, customNumber, visibility === 'Private') + (goldenAssetPrice || 0)
    : 0;

  // --- FONCTION DE PAIEMENT COMPLETE ---
  const handlePurchase = async () => {
    if (!user) { setShowAuthDialog(true); return; }
    if (!validateStep(PurchaseStep.CHECKOUT)) { 
      toast.error('Please complete all required fields'); 
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

  // --- BARRE DE PROGRESSION ---
  const steps = [
    { id: PurchaseStep.ZONE, label: 'Location', icon: <MapPin className="h-5 w-5" /> },
    { id: PurchaseStep.SKIN, label: 'Design', icon: <Palette className="h-5 w-5" /> },
    { id: PurchaseStep.CONTENT, label: 'Message', icon: <FileText className="h-5 w-5" /> },
    { id: PurchaseStep.NUMBER, label: 'Number', icon: <Hash className="h-5 w-5" /> },
    { id: PurchaseStep.CHECKOUT, label: 'Checkout', icon: <CreditCard className="h-5 w-5" /> },
  ];

  // --- EFFETS ---
  useEffect(() => {
    // Mettre à jour les étapes complétées
    const newCompletedSteps: PurchaseStep[] = [];
    if (validateStep(PurchaseStep.ZONE)) newCompletedSteps.push(PurchaseStep.ZONE);
    if (validateStep(PurchaseStep.SKIN)) newCompletedSteps.push(PurchaseStep.SKIN);
    if (validateStep(PurchaseStep.CONTENT)) newCompletedSteps.push(PurchaseStep.CONTENT);
    if (validateStep(PurchaseStep.NUMBER)) newCompletedSteps.push(PurchaseStep.NUMBER);
    
    setCompletedSteps(newCompletedSteps);
  }, [selectedZone, selectedSkin, contentText, termsAccepted, customNumber, selectedNumber]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
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
          <div className="max-w-7xl mx-auto">
            {/* --- BARRE DE PROGRESSION --- */}
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                {steps.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = completedSteps.includes(step.id);
                  const isClickable = completedSteps.includes(step.id) || 
                    Object.values(PurchaseStep).indexOf(step.id) <= 
                    Object.values(PurchaseStep).indexOf(currentStep);
                  
                  return (
                    <div key={step.id} className="flex-1 flex flex-col items-center relative z-10">
                      <button
                        type="button"
                        onClick={() => isClickable && goToStep(step.id)}
                        disabled={!isClickable}
                        className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-all duration-300 ${
                          isActive 
                            ? 'bg-[#e11d48] text-white border-2 border-[#e11d48] shadow-lg scale-110' 
                            : isCompleted 
                            ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300' 
                            : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                        } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}`}
                      >
                        {isCompleted ? <Check className="h-6 w-6" /> : step.icon}
                      </button>
                      <span className={`text-sm font-medium ${
                        isActive ? 'text-[#e11d48] font-bold' : 
                        isCompleted ? 'text-emerald-700' : 'text-slate-500'
                      }`}>
                        {step.label}
                      </span>
                      
                      {/* Ligne entre les étapes */}
                      {index < steps.length - 1 && (
                        <div className={`absolute top-6 left-1/2 w-full h-0.5 -z-10 ${
                          isCompleted ? 'bg-emerald-300' : 'bg-slate-200'
                        }`} style={{ transform: 'translateX(50%)' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* --- CONTENU DES ÉTAPES --- */}
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-8">
                {/* ÉTAPE 1: ZONE */}
                <div ref={zoneRef} className={`transition-all duration-300 ${currentStep === PurchaseStep.ZONE ? 'opacity-100' : 'opacity-70'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="h-6 w-6 text-[#e11d48]" />
                      Step 1: Choose Location
                    </h2>
                    {validateStep(PurchaseStep.ZONE) && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        <Check className="h-3 w-3 mr-1" /> Complete
                      </Badge>
                    )}
                  </div>
                  <ZoneSelector 
                    selectedZone={selectedZone} 
                    onSelectZone={handleSelectZone}
                  />
                  {!validateStep(PurchaseStep.ZONE) && currentStep === PurchaseStep.ZONE && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Please select a location to continue</span>
                    </div>
                  )}
                </div>

                {/* ÉTAPE 2: SKIN */}
                <div ref={skinRef} className={`transition-all duration-300 ${currentStep === PurchaseStep.SKIN ? 'opacity-100' : 'opacity-70'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <Palette className="h-6 w-6 text-[#e11d48]" />
                      Step 2: Choose Design
                    </h2>
                    {validateStep(PurchaseStep.SKIN) && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        <Check className="h-3 w-3 mr-1" /> Complete
                      </Badge>
                    )}
                  </div>
                  <SkinSelector 
                    selectedSkin={selectedSkin} 
                    onSelectSkin={handleSelectSkin}
                  />
                  {!validateStep(PurchaseStep.SKIN) && currentStep === PurchaseStep.SKIN && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Please select a design to continue</span>
                    </div>
                  )}
                </div>

                {/* ÉTAPE 3: CONTENT */}
                <div ref={contentRef} className={`transition-all duration-300 ${currentStep === PurchaseStep.CONTENT ? 'opacity-100' : 'opacity-70'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="h-6 w-6 text-[#e11d48]" />
                      Step 3: Personalize Message
                    </h2>
                    {validateStep(PurchaseStep.CONTENT) && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        <Check className="h-3 w-3 mr-1" /> Complete
                      </Badge>
                    )}
                  </div>
                  <ContentForm 
                    contentText={contentText} 
                    onContentTextChange={handleContentChange}
                    authorName={authorName} 
                    onAuthorNameChange={setAuthorName}
                    visibility={visibility} 
                    onVisibilityChange={(v) => setVisibility(v)}
                    termsAccepted={termsAccepted} 
                    onTermsAcceptedChange={handleTermsAccept}
                    imageRightsGranted={imageRightsGranted} 
                    onImageRightsGrantedChange={setImageRightsGranted}
                    mediaType={mediaType} 
                    onMediaTypeChange={setMediaType}
                    mediaUrl={mediaUrl} 
                    onMediaUrlChange={setMediaUrl} 
                    mediaFile={mediaFile} 
                    onMediaFileChange={setMediaFile}
                  />
                  {!validateStep(PurchaseStep.CONTENT) && currentStep === PurchaseStep.CONTENT && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">
                        {!contentText.trim() ? 'Please enter a message' : 'Please accept the terms and conditions'}
                      </span>
                    </div>
                  )}
                </div>

                {/* ÉTAPE 4: NUMBER */}
                <div ref={numberRef} className={`transition-all duration-300 ${currentStep === PurchaseStep.NUMBER ? 'opacity-100' : 'opacity-70'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <Hash className="h-6 w-6 text-[#e11d48]" />
                      Step 4: Choose Number (Optional)
                    </h2>
                    {validateStep(PurchaseStep.NUMBER) && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        <Check className="h-3 w-3 mr-1" /> Complete
                      </Badge>
                    )}
                  </div>
                  <NumberSelector 
                    customNumber={customNumber} 
                    onCustomNumberChange={setCustomNumber}
                    selectedNumber={selectedNumber} 
                    onSelectedNumberChange={setSelectedNumber}
                    onCheckAvailability={async (n) => true} 
                    onGoldenAssetPriceChange={setGoldenAssetPrice}
                  />
                  {!validateStep(PurchaseStep.NUMBER) && currentStep === PurchaseStep.NUMBER && customNumber && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">
                        Please select a valid number or disable custom number
                      </span>
                    </div>
                  )}
                </div>

                {/* ÉTAPE 5: CHECKOUT */}
                <div ref={checkoutRef} className={`transition-all duration-300 ${currentStep === PurchaseStep.CHECKOUT ? 'opacity-100' : 'opacity-70'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard className="h-6 w-6 text-[#e11d48]" />
                      Step 5: Review & Checkout
                    </h2>
                    {validateStep(PurchaseStep.CHECKOUT) && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        <Check className="h-3 w-3 mr-1" /> Ready
                      </Badge>
                    )}
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4">Final Review</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-600">Location</p>
                          <p className="font-bold">{selectedZone || 'Not selected'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Design</p>
                          <p className="font-bold">{selectedSkin || 'Not selected'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Message</p>
                        <p className="font-bold truncate">{contentText || 'Not entered'}</p>
                      </div>
                      {customNumber && selectedNumber && (
                        <div>
                          <p className="text-sm text-slate-600">Selected Number</p>
                          <p className="font-bold">#{selectedNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* BOUTONS DE NAVIGATION */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                  <Button
                    variant="outline"
                    onClick={goToPrevStep}
                    disabled={currentStep === PurchaseStep.ZONE}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  {currentStep !== PurchaseStep.CHECKOUT ? (
                    <Button
                      onClick={goToNextStep}
                      disabled={!validateStep(currentStep)}
                      className="bg-[#e11d48] hover:bg-[#be123c] text-white font-bold flex items-center gap-2 px-6"
                    >
                      Continue to {steps[Object.values(PurchaseStep).indexOf(currentStep) + 1]?.label}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePurchase}
                      disabled={!validateStep(PurchaseStep.CHECKOUT) || isProcessing}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 text-lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Complete Purchase'
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* SIDEBAR RÉSUMÉ */}
              <div className="lg:col-span-1 lg:sticky lg:top-24">
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
                
                {/* INDICATEUR D'ÉTAPE ACTUELLE */}
                <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">Current Step:</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${validateStep(currentStep) ? 'bg-emerald-500' : 'bg-[#e11d48] animate-pulse'}`}></div>
                    <p className="font-bold">
                      {steps.find(s => s.id === currentStep)?.label}
                    </p>
                  </div>
                  <p className={`text-xs mt-2 ${validateStep(currentStep) ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {validateStep(currentStep) 
                      ? '✓ This step is complete' 
                      : 'Please complete all required fields'}
                  </p>
                </div>

                {/* PROGRÈS GLOBAL */}
                <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-slate-700 mb-3">Progress</p>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(completedSteps.length / steps.length) * 100}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    {completedSteps.length} of {steps.length - 1} steps completed
                  </p>
                </div>
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
