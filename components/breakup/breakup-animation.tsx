'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface BreakupAnimationProps {
  onComplete: () => void;
}

export function BreakupAnimation({ onComplete }: BreakupAnimationProps) {
  const [stage, setStage] = useState<'cutting' | 'falling' | 'splash' | 'complete'>('cutting');

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('falling'), 1500);
    const timer2 = setTimeout(() => setStage('splash'), 3000);
    const timer3 = setTimeout(() => {
      setStage('complete');
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md h-96">
        {stage === 'cutting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">
            <div className="relative">
              <div className="w-24 h-32 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg shadow-2xl animate-shake">
                <Heart className="absolute inset-0 m-auto h-12 w-12 text-white/80" />
              </div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-cut">
                <div className="w-full h-1 bg-red-500 blur-sm" />
              </div>
            </div>
            <p className="text-xl font-bold text-red-400 animate-pulse">Coupe-boulon...</p>
          </div>
        )}

        {stage === 'falling' && (
          <div className="absolute inset-0 flex items-start justify-center pt-8">
            <div className="w-24 h-32 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg shadow-2xl animate-fall">
              <Heart className="absolute inset-0 m-auto h-12 w-12 text-white/80" />
            </div>
          </div>
        )}

        {stage === 'splash' && (
          <div className="absolute inset-0 flex items-end justify-center pb-8">
            <div className="relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/30 rounded-full animate-splash" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-400/40 rounded-full animate-splash-delay" />
              <p className="absolute bottom-16 left-1/2 -translate-x-1/2 text-4xl animate-bounce">💔</p>
            </div>
          </div>
        )}

        {stage === 'complete' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <div className="text-6xl">🌊</div>
            <p className="text-xl font-bold text-blue-400">Emporté par la Seine...</p>
            <p className="text-sm text-muted-foreground italic">L'emplacement est maintenant libre</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes cut {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(150%); }
        }
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(180deg); opacity: 0.3; }
        }
        @keyframes splash {
          0% { transform: translate(-50%, 0) scale(0); opacity: 1; }
          100% { transform: translate(-50%, 0) scale(2); opacity: 0; }
        }
        @keyframes splash-delay {
          0% { transform: translate(-50%, 0) scale(0); opacity: 1; }
          50% { transform: translate(-50%, 0) scale(0); opacity: 1; }
          100% { transform: translate(-50%, 0) scale(1.8); opacity: 0; }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out infinite;
        }
        .animate-cut {
          animation: cut 1.5s ease-in-out;
        }
        .animate-fall {
          animation: fall 1.5s ease-in forwards;
        }
        .animate-splash {
          animation: splash 1s ease-out forwards;
        }
        .animate-splash-delay {
          animation: splash-delay 1.2s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
