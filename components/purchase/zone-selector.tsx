'use client';

import { Zone, ZONE_PRICES } from '@/lib/pricing';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ZoneSelectorProps {
  selectedZone: Zone | null;
  onSelectZone: (zone: Zone) => void;
}

export function ZoneSelector({ selectedZone, onSelectZone }: ZoneSelectorProps) {
  
  const zones = [
    {
      id: 'Standard',
      title: 'Pont des Arts Center',
      price: `$${ZONE_PRICES['Standard']}`, // Affiche 29.99
      desc: 'The historic spot on the Love Lock Bridge.',
      image: '/images/zone-standard.png',
      alt: 'Digital Love Lock placed on the center railing',
    },
    {
      id: 'Premium_Eiffel',
      title: 'Eiffel Tower View',
      price: `$${ZONE_PRICES['Premium_Eiffel']}`, // Affiche 79.99
      desc: 'Direct view of the Iron Lady.',
      image: '/images/zone-eiffel.png',
      alt: 'Virtual Lock with Eiffel Tower view',
    },
    {
      id: 'Sky_Balloon',
      title: 'Paris Sky Balloon',
      price: `$${ZONE_PRICES['Sky_Balloon']}`, // Affiche 149.99
      desc: 'Floating high above the Paris skyline.',
      image: '/images/zone-sky.png',
      alt: 'Red Love Lock Balloon floating over Paris',
    }
  ];

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <header className="mb-6">
        <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-sans text-slate-600">1</span>
          Choose your Location
        </h2>
      </header>
      
      <div className="grid md:grid-cols-3 gap-4">
        {zones.map((zone) => {
          const zoneId = zone.id as Zone;
          const isSelected = selectedZone === zoneId;

          return (
            <div
              key={zone.id}
              onClick={() => onSelectZone(zoneId)}
              className={cn(
                "group relative cursor-pointer rounded-xl border-2 transition-all duration-300 overflow-hidden hover:shadow-lg h-56 flex flex-col",
                isSelected 
                  ? "border-[#e11d48] ring-1 ring-[#e11d48]" 
                  : "border-slate-100 hover:border-slate-300"
              )}
            >
              <div className="relative h-32 w-full overflow-hidden bg-slate-100 shrink-0">
                <Image 
                  src={zone.image} 
                  alt={zone.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-[#e11d48] text-white rounded-full p-1.5 shadow-md z-10">
                    <Check size={16} />
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <h3 className={cn("font-bold text-sm mb-1", isSelected ? "text-[#e11d48]" : "text-slate-900")}>
                    {zone.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                    {zone.desc}
                  </p>
                </div>
                <div className="mt-2 text-right">
                  <span className={cn("text-sm font-bold", isSelected ? "text-[#e11d48]" : "text-slate-900")}>
                    {zone.price}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}