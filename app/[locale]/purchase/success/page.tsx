'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Mail, Lock, Loader2, UserPlus, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const lockId = searchParams.get('lock_id');
  const [showAuth, setShowAuth] = useState(false);
  const [claiming, setClaiming] = useState(false);

  async function claimLock() {
    if (!lockId) return toast.error('Missing lock number');
    if (!user) {
      setShowAuth(true);
      return;
    }

    setClaiming(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/claim-lock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ lockId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Claim failed');
      toast.success('Lock linked to your account');
      router.push('/dashboard?payment_success=true');
    } catch (e: any) {
      toast.error(e.message || 'Unable to claim lock');
      setClaiming(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white border border-slate-100 shadow-2xl rounded-3xl overflow-hidden text-center p-8 md:p-12 animate-in fade-in zoom-in duration-500">
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e11d48]">LoveLockParis</p>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mt-4 mb-4">
          Payment Successful
        </h1>

        {lockId && (
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-[#e11d48] mb-5">
            <Lock className="h-4 w-4" /> Lock #{lockId}
          </div>
        )}

        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          Your digital love lock is confirmed. Stripe collected the payment email. Create or log into your account now to link this lock to your dashboard.
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-8 text-left">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <Mail className="h-6 w-6 text-[#e11d48]" />
            <p className="font-bold mt-3">Email confirmation</p>
            <p className="text-sm text-slate-600 mt-1">The order confirmation is sent to the payment email.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <UserPlus className="h-6 w-6 text-[#e11d48]" />
            <p className="font-bold mt-3">Account after payment</p>
            <p className="text-sm text-slate-600 mt-1">Login or register only now to manage the lock.</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={claimLock} disabled={claiming} className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white font-bold py-6 text-lg rounded-xl shadow-lg">
            {claiming ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Linking...</> : <><UserPlus className="mr-2 h-5 w-5" /> Link Lock to My Account</>}
          </Button>

          <Link href="/bridge" className="block w-full">
            <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 py-6 text-lg rounded-xl font-bold">
              <Map className="mr-2 h-5 w-5" /> Visit 3D Bridge
            </Button>
          </Link>
        </div>
      </div>

      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin text-[#e11d48]" /></div>}>
        <SuccessPageContent />
      </Suspense>
    </AuthProvider>
  );
}
