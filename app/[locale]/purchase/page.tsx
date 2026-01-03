'use client';

import { useState } from 'react';
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
import { ArrowLeft, LogOut, Lock, ShieldCheck } from 'lucide-react';
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
    // 1. Validation
    if (!user) { setShowAuthDialog(true); return; }
    if (!selectedZone || !selectedSkin) { toast.error('Please select a Zone and Material'); return; }
    if (!contentText.trim()) { toast.error('Please enter a message'); return; }
    if (!termsAccepted) { toast.error('Please accept Terms'); return; }
    
    setIsProcessing(true);
    toast.loading("Processing payment...");

    try {
      // 2. Gestion du Fichier (Conversion Base64 pour envoi API)
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

      // 3. Récupération Session
      const { data: { session } } = await supabase.auth.getSession();
      
      // 4. APPEL API VERS '/api/checkout'
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
          totalPrice: currentPrice, // Prix calculé
          customNumber,
          selectedNumber,
          authorName,
          goldenAssetPrice,
          isPrivate: visibility === 'Private',
          // Données fichier
          mediaFileData,
          mediaFileName,
          mediaFileType
        }),
      });

      const data = await response.json();

      if (data.url) {
        // SUCCÈS -> Redirection Stripe
        window.location.href = data.url; 
      } else {
        console.error("Backend Error:", data);
        toast.error('Payment Error: ' + (data.error || 'Unknown error'));
        setIsProcessing(false);
      }

    } catch (error) {
      console.error("Fetch Error:", error);
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
                 <Button variant="outline" size="sm" onClick={signOut} className="text-slate-600 border-slate-300">
                   <LogOut className="h-4 w-4 mr-2"/>Logout
                 </Button>
              ) : (
                 <Button size="sm" onClick={() => setShowAuthDialog(true)} className="bg-[#e11d48] text-white hover:bg-[#be123c]">
                   Login
                 </Button>
              )}
            </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!user ? (
          // ECRAN LOGIN
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-50 mb-6 text-[#e11d48] shadow-sm border border-rose-100">
              <Lock size={40} />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4 text-slate-900">Login to Continue</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              You must be logged in to secure your spot on the Official Registry of Paris.
            </p>
            <Button size="lg" onClick={() => setShowAuthDialog(true)} className="bg-[#e11d48] text-white font-bold px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              Login / Register
            </Button>
          </div>
        ) : (
          // GRILLE DE COMMANDE
          <div className="grid lg:grid-cols-3 gap-8 items-start">
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
                    // Le check se fait dans le composant NumberSelector
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
                  onPurchase={handlePurchase} // LE CLICK MAGIQUE
                  isProcessing={isProcessing}
                />
              ) : (
                <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-400">
                  <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">Complete steps to see summary.</p>
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

// EXPORT PRINCIPAL AVEC AUTH PROVIDER
export default function PurchasePage() {
  return (
    <AuthProvider>
      <PurchasePageContent />
    </AuthProvider>
  );
}