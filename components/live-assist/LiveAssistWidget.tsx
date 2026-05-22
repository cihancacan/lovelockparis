'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, StopCircle, XCircle } from 'lucide-react';

export function LiveAssistWidget() {
  const pathname = usePathname();
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [pendingRequest, setPendingRequest] = useState<any | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const visitorIdRef = useRef<string | null>(null);
  const captureTimerRef = useRef<number | null>(null);
  const isCapturingRef = useRef(false);

  useEffect(() => {
    if (pathname?.includes('/admin') || pathname?.includes('/ar-view')) return;

    let id = window.localStorage.getItem('llp_live_assist_visitor');
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem('llp_live_assist_visitor', id);
    }
    visitorIdRef.current = id;
    setVisitorId(id);
  }, [pathname]);

  const sendPresence = async () => {
    if (!visitorId || pathname?.includes('/admin') || pathname?.includes('/ar-view')) return;
    await fetch('/api/live-assist/presence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId, currentPath: window.location.pathname }),
    }).catch(() => null);
  };

  const checkRequest = async () => {
    if (!visitorId || isActive || pathname?.includes('/admin') || pathname?.includes('/ar-view')) return;
    const res = await fetch(`/api/live-assist/request?visitorId=${visitorId}`).catch(() => null);
    if (!res) return;
    const data = await res.json().catch(() => null);
    if (data?.request?.status === 'pending') setPendingRequest(data.request);
  };

  useEffect(() => {
    if (!visitorId) return;
    sendPresence();
    const t = window.setInterval(() => {
      sendPresence();
      checkRequest();
    }, 2500);
    return () => window.clearInterval(t);
  }, [visitorId, pathname, isActive]);

  const sendFrame = async () => {
    const currentSessionId = sessionIdRef.current;
    const currentVisitorId = visitorIdRef.current;
    if (!currentSessionId || !currentVisitorId || isCapturingRef.current) return;

    isCapturingRef.current = true;
    try {
      const html2canvasModule: any = await import('html2canvas');
      const html2canvas = html2canvasModule.default || html2canvasModule;
      const root = document.body;
      const canvas = await html2canvas(root, {
        backgroundColor: '#ffffff',
        scale: 0.55,
        useCORS: true,
        allowTaint: false,
        logging: false,
        ignoreElements: (element: Element) => {
          const el = element as HTMLElement;
          return Boolean(
            el.closest('[data-live-assist-hidden="true"]') ||
            el.closest('.llp-no-record') ||
            el.tagName === 'INPUT' ||
            el.tagName === 'TEXTAREA' ||
            el.tagName === 'SELECT'
          );
        },
      });
      const imageData = canvas.toDataURL('image/jpeg', 0.45);
      await fetch('/api/live-assist/frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSessionId,
          visitorId: currentVisitorId,
          imageData,
          currentPath: window.location.pathname,
        }),
      }).catch(() => null);
    } finally {
      isCapturingRef.current = false;
    }
  };

  const startLiveFrames = () => {
    sendFrame();
    captureTimerRef.current = window.setInterval(sendFrame, 1200);
  };

  const respond = async (accepted: boolean) => {
    if (!pendingRequest || !visitorId) return;

    const res = await fetch('/api/live-assist/request', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: pendingRequest.id, visitorId, accepted, currentPath: window.location.pathname }),
    });

    const data = await res.json().catch(() => null);
    setPendingRequest(null);

    if (!accepted || !data?.request?.session_id) return;

    const newSessionId = data.request.session_id;
    sessionIdRef.current = newSessionId;
    setSessionId(newSessionId);
    setIsActive(true);
    startLiveFrames();
  };

  const stop = async () => {
    if (captureTimerRef.current) window.clearInterval(captureTimerRef.current);
    captureTimerRef.current = null;
    setIsActive(false);
    setSessionId(null);
    sessionIdRef.current = null;
  };

  if (pathname?.includes('/admin') || pathname?.includes('/ar-view')) return null;

  return (
    <>
      {pendingRequest && (
        <div data-live-assist-hidden="true" className="fixed bottom-6 right-4 z-[80] w-[320px] rounded-2xl border border-rose-100 bg-white p-4 shadow-2xl">
          <div className="mb-2 text-xs font-black uppercase tracking-wide text-[#e11d48]">LoveLockParis Support</div>
          <h3 className="text-base font-bold text-slate-900">Allow live assistance?</h3>
          <p className="mt-2 text-xs leading-5 text-slate-600">
            Support would like to help you on this website. If you accept, they can view this website screen in real time. Sensitive inputs are hidden. Chat stays in Crisp.
          </p>
          <div className="mt-3 flex gap-2">
            <Button onClick={() => respond(true)} className="flex-1 bg-[#e11d48] text-white hover:bg-[#be123c]"><CheckCircle className="mr-2 h-4 w-4" /> Accept</Button>
            <Button onClick={() => respond(false)} variant="outline" className="flex-1"><XCircle className="mr-2 h-4 w-4" /> Decline</Button>
          </div>
        </div>
      )}

      {isActive && (
        <div data-live-assist-hidden="true" className="fixed bottom-4 right-4 z-[80] rounded-full bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-xl">
          <button onClick={stop} className="flex items-center gap-2"><StopCircle className="h-4 w-4" /> Assistance active — Stop</button>
        </div>
      )}
    </>
  );
}
