'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LifeBuoy, Loader2, StopCircle } from 'lucide-react';

export function LiveAssistWidget() {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const stopRef = useRef<null | (() => void)>(null);
  const queueRef = useRef<any[]>([]);
  const timerRef = useRef<any>(null);

  const flushEvents = async () => {
    if (!sessionId || queueRef.current.length === 0) return;
    const batch = queueRef.current.splice(0, 80);
    try {
      await fetch('/api/cobrowse/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, currentPath: window.location.pathname, events: batch }),
      });
    } catch {
      queueRef.current.unshift(...batch);
    }
  };

  useEffect(() => {
    if (!isActive || !sessionId) return;
    flushEvents();
  }, [pathname, isActive, sessionId]);

  useEffect(() => {
    if (!isActive || !sessionId) return;
    timerRef.current = window.setInterval(flushEvents, 1800);
    return () => window.clearInterval(timerRef.current);
  }, [isActive, sessionId]);

  const startAssistance = async () => {
    const accepted = window.confirm(
      'Start live assistance? LoveLockParis support will be able to see your navigation on this website only. Passwords, payment fields and sensitive inputs are masked.'
    );
    if (!accepted) return;

    setIsStarting(true);
    try {
      let visitorId = window.localStorage.getItem('llp_live_assist_visitor');
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        window.localStorage.setItem('llp_live_assist_visitor', visitorId);
      }

      const startResponse = await fetch('/api/cobrowse/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, currentPath: window.location.pathname, metadata: { consent: true } }),
      });
      const startData = await startResponse.json();
      if (!startResponse.ok || !startData.sessionId) throw new Error(startData.error || 'Could not start assistance');

      setSessionId(startData.sessionId);
      setIsActive(true);

      const rrweb = await import('rrweb');
      stopRef.current = rrweb.record({
        emit(event: any) {
          queueRef.current.push(event);
        },
        maskAllInputs: true,
        blockClass: 'llp-no-record',
        maskTextClass: 'llp-mask-record',
        recordCanvas: false,
        collectFonts: false,
      });
    } catch (e: any) {
      alert(e?.message || 'Could not start live assistance');
    } finally {
      setIsStarting(false);
    }
  };

  const stopAssistance = async () => {
    try {
      stopRef.current?.();
      stopRef.current = null;
      await flushEvents();
    } finally {
      setIsActive(false);
      setSessionId(null);
      queueRef.current = [];
    }
  };

  if (pathname?.includes('/admin') || pathname?.includes('/ar-view')) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[70]">
      {isActive ? (
        <Button onClick={stopAssistance} className="rounded-full bg-slate-900 px-4 py-6 text-white shadow-2xl hover:bg-slate-800">
          <StopCircle className="mr-2 h-5 w-5" /> Stop assistance
        </Button>
      ) : (
        <Button onClick={startAssistance} disabled={isStarting} className="rounded-full bg-[#e11d48] px-4 py-6 text-white shadow-2xl hover:bg-[#be123c]">
          {isStarting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LifeBuoy className="mr-2 h-5 w-5" />} Live assistance
        </Button>
      )}
    </div>
  );
}
