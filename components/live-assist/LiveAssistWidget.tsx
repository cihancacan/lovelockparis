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
  const stopRef = useRef<null | (() => void)>(null);
  const queueRef = useRef<any[]>([]);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (pathname?.includes('/admin') || pathname?.includes('/ar-view')) return;

    let id = window.localStorage.getItem('llp_live_assist_visitor');
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem('llp_live_assist_visitor', id);
    }
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

  const flushEvents = async () => {
    const currentSessionId = sessionIdRef.current || sessionId;
    if (!currentSessionId || queueRef.current.length === 0) return;
    const batch = queueRef.current.splice(0, 80);
    try {
      await fetch('/api/cobrowse/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSessionId, currentPath: window.location.pathname, events: batch }),
      });
    } catch {
      queueRef.current.unshift(...batch);
    }
  };

  useEffect(() => {
    if (!isActive || !sessionId) return;
    const t = window.setInterval(flushEvents, 700);
    return () => window.clearInterval(t);
  }, [isActive, sessionId]);

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

    window.setTimeout(flushEvents, 300);
  };

  const stop = async () => {
    stopRef.current?.();
    stopRef.current = null;
    await flushEvents();
    setIsActive(false);
    setSessionId(null);
    sessionIdRef.current = null;
    queueRef.current = [];
  };

  if (pathname?.includes('/admin') || pathname?.includes('/ar-view')) return null;

  return (
    <>
      {pendingRequest && (
        <div className="fixed bottom-6 right-4 z-[80] w-[340px] rounded-2xl border border-rose-100 bg-white p-5 shadow-2xl">
          <div className="mb-3 text-sm font-black uppercase tracking-wide text-[#e11d48]">LoveLockParis Support</div>
          <h3 className="text-lg font-bold text-slate-900">Allow live assistance?</h3>
          <p className="mt-2 text-sm leading-5 text-slate-600">
            Our support team would like to help you on this website. If you accept, they can view your navigation in real time. Passwords, payment fields and sensitive inputs are masked. You can keep chatting with us through the Crisp chat.
          </p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => respond(true)} className="flex-1 bg-[#e11d48] text-white hover:bg-[#be123c]"><CheckCircle className="mr-2 h-4 w-4" /> Accept</Button>
            <Button onClick={() => respond(false)} variant="outline" className="flex-1"><XCircle className="mr-2 h-4 w-4" /> Decline</Button>
          </div>
        </div>
      )}

      {isActive && (
        <div className="fixed bottom-6 right-4 z-[80] rounded-full bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-2xl">
          <button onClick={stop} className="flex items-center gap-2"><StopCircle className="h-4 w-4" /> Live assistance active — Stop</button>
        </div>
      )}
    </>
  );
}
