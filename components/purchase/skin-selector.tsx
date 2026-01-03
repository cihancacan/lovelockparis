'use client';

import { Skin, SKIN_PRICES } from '@/lib/pricing';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SkinSelectorProps {
  selectedSkin: Skin | null;
  onSelectSkin: (skin: Skin) => void;
}

export function SkinSelector({ selectedSkin, onSelectSkin }: SkinSelectorProps) {
  const skins: Skin[] = ['Iron', 'Gold', 'Diamond', 'Ruby'];

  const skinDetails: Record<Skin, { image: string; label: string }> = {
    'Iron': { image: '/images/skin-iron.png', label: 'Classic Iron' },
    'Gold': { image: '/images/skin-gold.png', label: '24K Gold' },
    'Diamond': { image: '/images/skin-diamond.png', label: 'Diamond' },
    'Ruby': { image: '/images/skin-ruby.png', label: 'Royal Ruby' }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <header className="mb-6">
        <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-sans text-slate-600">2</span>
          Choose Digital Finish
        </h2>
      </header>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {skins.map((skin) => {
          const isSelected = selectedSkin === skin;
          const price = SKIN_PRICES[skin]; // Utilise les prix de pricing.ts
          const details = skinDetails[skin];

          return (
            <div
              key={skin}
              onClick={() => onSelectSkin(skin)}
              className={cn(
                "group cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-between transition-all duration-300 bg-white hover:shadow-lg relative",
                isSelected 
                  ? "border-[#e11d48] ring-1 ring-[#e11d48] bg-rose-50/10" 
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 bg-[#e11d48] text-white rounded-full p-1 shadow-sm z-10">
                  <Check size={12} />
                </div>
              )}

              <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                <Image 
                  src={details.image}
                  alt={details.label}
                  fill
                  className="object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <div className="text-center w-full">
                <h3 className={cn("font-bold text-sm mb-1", isSelected ? "text-[#e11d48]" : "text-slate-900")}>
                  {details.label}
                </h3>
                
                <div className={cn(
                  "text-xs font-bold py-1 px-3 rounded-full border inline-block mt-1",
                  price === 0 
                    ? "bg-slate-100 text-slate-600 border-slate-200" 
                    : "bg-amber-50 text-amber-700 border-amber-100"
                )}>
                  {price === 0 ? 'Included' : `+$${price.toFixed(2)}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}