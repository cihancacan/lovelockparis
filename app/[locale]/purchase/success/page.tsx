'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { CheckCircle2, Smartphone, Map, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

useEffect(() => {
  const session = searchParams.get('session_id');
  const userId = searchParams.get('user_id');
  const price = searchParams.get('price');
  const zone = searchParams.get('zone');
  const skin = searchParams.get('skin');
  
  setSessionId(session);
  
  console.log('🔄 Page de succès chargée avec:', {
    session,
    userId,
    price,
    zone,
    skin
  });
  
  if (session && userId) {
    // 1. Chercher le lock créé
    const checkLock = async () => {
      try {
        console.log('🔍 Recherche du lock pour session:', session);
        
        const { data: lock, error } = await supabase
          .from('locks')
          .select('*')
          .eq('stripe_session_id', session)
          .eq('owner_id', userId)
          .maybeSingle();
        
        if (error) {
          console.error('❌ Erreur recherche lock:', error);
        }
        
        if (lock) {
          console.log('✅ Lock trouvé!', lock.id);
          setLockId(lock.id);
          setIsProcessing(false);
          
          // Afficher les infos du lock
          console.log('📋 Détails du lock:', {
            id: lock.id,
            zone: lock.zone,
            skin: lock.skin,
            price: lock.price,
            status: lock.status
          });
        } else {
          console.log('⚠️ Lock non trouvé, nouvel essai dans 2s...');
          // Réessayer après 2 secondes
          setTimeout(checkLock, 2000);
        }
      } catch (err) {
        console.error('❌ Exception:', err);
        setIsProcessing(false);
      }
    };
    
    // Premier essai après 1 seconde
    const timer = setTimeout(checkLock, 1000);
    
    return () => clearTimeout(timer);
  } else {
    setIsProcessing(false);
  }
}, [searchParams]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white border border-slate-100 shadow-xl rounded-3xl overflow-hidden text-center p-8 md:p-12">
          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-4">
            Securing Your Love Lock...
          </h1>
          
          <p className="text-slate-600 mb-8 leading-relaxed">
            We're placing your digital lock on the Pont des Arts bridge.
            <br />
            <span className="text-sm text-slate-400 mt-2 block">
              This may take a few moments...
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col items-center justify-center p-4">
      
      <div className="max-w-lg w-full bg-white border border-slate-100 shadow-2xl rounded-3xl overflow-hidden text-center p-8 md:p-12 animate-in fade-in zoom-in duration-500">
        
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center relative">
             <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
             <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          Your <strong className="text-rose-600">Love Lock</strong> is now secured on the Virtual Pont des Arts.
        </p>

        {sessionId && (
          <div className="mb-6 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Transaction ID:</p>
            <p className="text-sm font-mono text-slate-700 break-all">
              {sessionId.substring(0, 20)}...
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link href="/bridge" className="block w-full">
            <Button className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white font-bold py-6 text-lg rounded-xl shadow-lg transition-transform hover:-translate-y-1">
              <Map className="mr-2 h-5 w-5" /> Visit 3D Bridge
            </Button>
          </Link>

          <Link href="/dashboard" className="block w-full">
            <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 py-6 text-lg rounded-xl font-bold">
              <Lock className="mr-2 h-5 w-5" /> View in Dashboard
            </Button>
          </Link>
          
          <div className="pt-4">
            <Link href="/purchase" className="text-sm text-rose-600 hover:text-rose-700 underline">
              Buy Another Lock →
            </Link>
          </div>
        </div>

      </div>
      
      <p className="mt-8 text-xs text-slate-400 text-center">
        LoveLockParis™ • Official Digital Registry of Pont des Arts
      </p>

    </div>
  );
}