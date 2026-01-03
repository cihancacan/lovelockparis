'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, CheckCircle2, XCircle, Crown, ShoppingCart, Sparkles } from 'lucide-react';
import { CUSTOM_NUMBER_PRICE } from '@/lib/pricing';

interface NumberSelectorProps {
  customNumber: boolean;
  onCustomNumberChange: (custom: boolean) => void;
  selectedNumber: number | null;
  onSelectedNumberChange: (number: number | null) => void;
  onCheckAvailability?: (number: number) => Promise<boolean>; // Optionnel car géré ici
  onGoldenAssetPriceChange?: (price: number | null) => void;
}

export function NumberSelector({
  customNumber,
  onCustomNumberChange,
  selectedNumber,
  onSelectedNumberChange,
  onGoldenAssetPriceChange,
}: NumberSelectorProps) {
  
  const [numberInput, setNumberInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'available' | 'unavailable' | 'forsale'>('idle');
  const [goldenAssetPrice, setGoldenAssetPrice] = useState<number | null>(null);

  // Reset si on désactive l'option
  useEffect(() => {
    if (!customNumber) {
      setNumberInput('');
      setAvailabilityStatus('idle');
      onSelectedNumberChange(null);
      setGoldenAssetPrice(null);
      onGoldenAssetPriceChange?.(null);
    }
  }, [customNumber, onSelectedNumberChange, onGoldenAssetPriceChange]);

  const handleCheck = async () => {
    const num = parseInt(numberInput, 10);

    // Validation basique
    if (isNaN(num) || num < 1 || num > 1000000) {
      setAvailabilityStatus('unavailable');
      return;
    }

    setIsChecking(true);
    
    try {
      // APPEL À NOTRE NOUVELLE API
      const response = await fetch(`/api/check-availability?lockId=${num}`);
      const data = await response.json();

      if (data.available) {
        
        if (data.status === 'resale') {
          // CAS : GOLDEN ASSET (A VENDRE)
          setAvailabilityStatus('forsale');
          setGoldenAssetPrice(data.price);
          onGoldenAssetPriceChange?.(data.price);
          onSelectedNumberChange(num);
        } else {
          // CAS : LIBRE (STANDARD)
          setAvailabilityStatus('available');
          setGoldenAssetPrice(null);
          onGoldenAssetPriceChange?.(null);
          onSelectedNumberChange(num);
        }
        
      } else {
        // CAS : PRIS
        setAvailabilityStatus('unavailable');
        onSelectedNumberChange(null);
        setGoldenAssetPrice(null);
        onGoldenAssetPriceChange?.(null);
      }

    } catch (error) {
      console.error("Erreur de vérification", error);
      setAvailabilityStatus('unavailable');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      
      {/* Header du bloc */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-sans text-slate-600">4</span>
            Lock Number
          </h2>
          <p className="text-slate-500 text-sm ml-10">Choose a specific ID or let fate decide.</p>
        </div>
        
        {/* Switch */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-full border border-slate-100">
          <span className={`text-xs font-bold ${customNumber ? 'text-[#e11d48]' : 'text-slate-500'}`}>
            Custom (+${CUSTOM_NUMBER_PRICE})
          </span>
          <Switch
            checked={customNumber}
            onCheckedChange={onCustomNumberChange}
            className="data-[state=checked]:bg-[#e11d48]"
          />
        </div>
      </div>

      {!customNumber ? (
        // MODE ALÉATOIRE
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-slate-400" />
          <p className="text-slate-600 font-medium text-sm">
            A unique number will be assigned <strong>randomly</strong>.
          </p>
          <div className="mt-1 text-3xl font-mono text-slate-300 tracking-widest font-bold">
            #??????
          </div>
        </div>
      ) : (
        // MODE PERSONNALISÉ
        <div className="space-y-5 animate-in fade-in slide-in-from-top-2">
          
          <div className="space-y-2">
            <Label htmlFor="number-input" className="text-slate-700 font-semibold">
              Enter desired number (1 - 1,000,000)
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-lg">#</span>
                <Input
                  id="number-input"
                  type="number"
                  placeholder="e.g. 777, 2025..."
                  value={numberInput}
                  onChange={(e) => {
                    setNumberInput(e.target.value);
                    setAvailabilityStatus('idle');
                  }}
                  className="pl-8 bg-white border-slate-300 focus:border-[#e11d48] focus:ring-[#e11d48] text-lg font-mono"
                  min={1}
                  max={1000000}
                />
              </div>
              <Button 
                onClick={handleCheck} 
                disabled={isChecking || !numberInput}
                className="bg-slate-900 text-white hover:bg-slate-800 font-bold px-6"
              >
                {isChecking ? <Loader2 className="animate-spin" /> : 'Check'}
              </Button>
            </div>
          </div>

          {/* RÉSULTAT : DISPONIBLE */}
          {availabilityStatus === 'available' && (
            <div className="flex items-start gap-3 text-green-700 bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm animate-in zoom-in-95">
              <CheckCircle2 className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-bold">Number #{numberInput} is available!</p>
                <p className="text-xs text-green-600 mt-1">
                  Secure this spot for +${CUSTOM_NUMBER_PRICE}.
                </p>
              </div>
            </div>
          )}

          {/* RÉSULTAT : GOLDEN ASSET (A VENDRE) */}
          {availabilityStatus === 'forsale' && goldenAssetPrice && (
            <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 shadow-sm relative overflow-hidden animate-in zoom-in-95">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Crown size={64} className="text-amber-900" />
              </div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Crown className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-amber-900 text-lg">Premium Asset Available</h4>
                  <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                    This exclusive number is listed for resale by its owner.
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between bg-white/60 p-3 rounded-lg border border-amber-200">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Resale Price</span>
                    <span className="text-xl font-bold text-amber-900 font-mono">${goldenAssetPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="mt-2 text-xs text-amber-700 flex items-center gap-1.5 font-medium">
                    <ShoppingCart size={14} />
                    Added to total automatically.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RÉSULTAT : INDISPONIBLE */}
          {availabilityStatus === 'unavailable' && (
            <div className="flex items-start gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-in zoom-in-95">
              <XCircle className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-bold">Number #{numberInput} is taken.</p>
                <p className="text-xs text-red-500 mt-1">
                  Not listed for sale. Please try another number.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}