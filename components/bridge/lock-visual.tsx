'use client';

import { Skin } from '@/lib/pricing';
import { Lock as LockIcon } from 'lucide-react';

interface LockVisualProps {
  id: number;
  skin: Skin;
  zone: string;
  status: 'Active' | 'For_Sale' | 'Broken_Heart' | 'Available';
  onClick?: () => void;
}

export function LockVisual({ id, skin, zone, status, onClick }: LockVisualProps) {
  const skinStyles: Record<Skin, { gradient: string; shadow: string; glow: string }> = {
    Iron: {
      gradient: 'from-gray-400 via-gray-500 to-gray-600',
      shadow: 'shadow-gray-500/50',
      glow: 'hover:shadow-gray-400/70',
    },
    Gold: {
      gradient: 'from-yellow-300 via-yellow-500 to-yellow-600',
      shadow: 'shadow-yellow-500/50',
      glow: 'hover:shadow-yellow-400/70',
    },
    Diamond: {
      gradient: 'from-cyan-300 via-blue-400 to-blue-600',
      shadow: 'shadow-blue-500/50',
      glow: 'hover:shadow-blue-400/70',
    },
    Ruby: {
      gradient: 'from-red-400 via-red-500 to-red-600',
      shadow: 'shadow-red-500/50',
      glow: 'hover:shadow-red-400/70',
    },
  };

  const style = skinStyles[skin];
  const isAvailable = status === 'Available';
  const isBroken = status === 'Broken_Heart';

  if (isBroken) {
    return (
      <div className="relative group flex flex-col items-center gap-1">
        <div className="w-12 h-16 opacity-30 grayscale">
          <div className={`w-full h-full rounded-lg bg-gradient-to-br ${style.gradient} shadow-lg flex items-center justify-center`}>
            <LockIcon className="h-6 w-6 text-white/80" />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">💔</span>
        </div>
        <div className="text-xs font-mono text-muted-foreground bg-black/20 px-2 py-0.5 rounded opacity-30">
          #{id}
        </div>
      </div>
    );
  }

  if (isAvailable) {
    return (
      <div className="relative group flex flex-col items-center gap-1">
        <div className="w-12 h-16 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer">
          <LockIcon className="h-4 w-4 text-muted-foreground/50" />
        </div>
        <div className="text-xs font-mono text-muted-foreground bg-black/20 px-2 py-0.5 rounded">
          #{id}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="relative group w-full flex flex-col items-center gap-1"
      aria-label={`Lock ${id}`}
    >
      <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${style.gradient} shadow-lg ${style.shadow} ${style.glow} transition-all duration-300 hover:scale-110 cursor-pointer flex items-center justify-center`}>
        <LockIcon className="h-6 w-6 text-white/80" />
      </div>

      {status === 'For_Sale' && (
        <div className="absolute top-0 right-0 w-5 h-5 bg-yellow-500 text-black text-xs rounded-full font-bold flex items-center justify-center">
          $
        </div>
      )}

      <div className="text-xs font-mono text-muted-foreground bg-black/20 px-2 py-0.5 rounded">
        #{id}
      </div>
    </button>
  );
}
