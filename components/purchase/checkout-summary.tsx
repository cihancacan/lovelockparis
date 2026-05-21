'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, Lock, Loader2 } from 'lucide-react';
import {
  Zone,
  Skin,
  MediaType,
  ZONE_PRICES,
  SKIN_PRICES,
  MEDIA_PRICES,
  CUSTOM_NUMBER_PRICE,
} from '@/lib/pricing';

interface CheckoutSummaryProps {
  zone: Zone | null;
  skin: Skin | null;
  mediaType: MediaType;
  contentText: string;
  customNumber: boolean;
  selectedNumber: number | null;
  goldenAssetPrice?: number | null;
  onPurchase: () => void;
  isProcessing: boolean;
}

export function CheckoutSummary({
  zone,
  skin,
  mediaType,
  contentText,
  customNumber,
  selectedNumber,
  goldenAssetPrice,
  isProcessing,
}: CheckoutSummaryProps) {
  const zonePrice = zone ? ZONE_PRICES[zone] : 0;
  const skinPrice = skin ? SKIN_PRICES[skin] : 0;
  const mediaPrice = MEDIA_PRICES[mediaType] || 0;
  const numberPrice = goldenAssetPrice || (customNumber ? CUSTOM_NUMBER_PRICE : 0);
  const total = zonePrice + skinPrice + mediaPrice + numberPrice;

  return (
    <Card className="lg:sticky lg:top-24 border border-slate-200 shadow-xl bg-white overflow-hidden">
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-serif font-bold text-slate-900">
          <Lock className="h-5 w-5 text-[#e11d48]" />
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 font-medium">Location (Base)</span>
            <span className="font-bold text-slate-900">
              {zone ? `$${zonePrice.toFixed(2)}` : '$0.00'}
            </span>
          </div>
          <div className="text-xs text-slate-400">
            {zone ? zone.replace('_', ' ') : 'Select a zone'}
          </div>
        </div>

        <Separator className="bg-slate-100" />

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Material</span>
            <span className="font-medium text-slate-900">
              {skinPrice > 0 ? `+$${skinPrice.toFixed(2)}` : 'Included'}
            </span>
          </div>
          <div className="text-xs text-slate-400">
            {skin || 'None'}
          </div>
        </div>

        {mediaType !== 'none' && (
          <>
            <Separator className="bg-slate-100" />
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Memory ({mediaType})</span>
              <span className="font-medium text-[#e11d48]">+${mediaPrice.toFixed(2)}</span>
            </div>
          </>
        )}

        {(customNumber || (goldenAssetPrice && goldenAssetPrice > 0)) && (
          <>
            <Separator className="bg-slate-100" />
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Special Number</span>
              <span className="font-medium text-purple-600">+${numberPrice.toFixed(2)}</span>
            </div>
          </>
        )}

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-500 italic mt-2 min-h-[40px] flex items-center break-words">
          {contentText ? `"${contentText}"` : 'No message set'}
        </div>

        <Separator className="bg-slate-200 my-4" />

        <div className="flex justify-between items-end">
          <span className="text-lg font-bold text-slate-900">Total</span>
          <span className="text-3xl font-bold text-[#e11d48]">${total.toFixed(2)}</span>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center text-sm text-emerald-800 min-h-[56px] flex items-center justify-center">
          {isProcessing ? (
            <span className="inline-flex items-center gap-2 font-semibold">
              <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to secure Stripe checkout...
            </span>
          ) : (
            <span>Use the main payment button below the form to continue securely.</span>
          )}
        </div>

        <div className="flex items-center gap-2 justify-center mt-4 text-xs text-slate-400">
          <ShieldCheck className="h-3 w-3 text-green-500" />
          <span>Secure SSL Payment</span>
        </div>
      </CardContent>
    </Card>
  );
}