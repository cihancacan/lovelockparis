'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { CheckCircle2, Smartphone, Map, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const session = searchParams.get('session_id');
    const userId = searchParams.get('user_id');
    
    setSessionId(session);
    
    if (session && userId) {
      // Simulation de vérification pour l'UX
      setTimeout(() => setIsProcessing(false), 2000);
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
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin text-[#e11d48]" /></div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
