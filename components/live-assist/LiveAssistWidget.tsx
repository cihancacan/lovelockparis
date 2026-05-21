'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, MessageCircle, Send, StopCircle, XCircle } from 'lucide-react';

type ChatMessage = {
  id: number;
  sender: 'admin' | 'visitor';
  message: string;
  created_at: string;
};

export function LiveAssistWidget() {
  const pathname = usePathname();
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [pendingRequest, setPendingRequest] = useState<any | null>(null);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastMessageId, setLastMessageId] = useState(0);
  const [draft, setDraft] = useState('');
  const stopRef = useRef<null | (() => void)>(null);
  const queueRef = useRef<any[]>([]);

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
    const t = window.setInterval(flushEvents, 700);
    return () => window.clearInterval(t);
  }, [isActive, sessionId]);

  const loadMessages = async () => {
    if (!activeRequestId) return;
    const res = await fetch(`/api/live-assist/chat?requestId=${activeRequestId}&afterId=${lastMessageId}`).catch(() => null);
    if (!res) return;
    const data = await res.json().catch(() => null);
    const rows = data?.messages || [];
    if (rows.length) {
      setLastMessageId(rows[rows.length - 1].id);
      setMessages((prev) => [...prev, ...rows]);
    }
  };

  useEffect(() => {
    if (!activeRequestId) return;
    const t = window.setInterval(loadMessages, 1500);
    return () => window.clearInterval(t);
  }, [activeRequestId, lastMessageId]);

  const sendMessage = async () => {
    if (!activeRequestId || !visitorId || !draft.trim()) return;
    const text = draft.trim();
    setDraft('');
    await fetch('/api/live-assist/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: activeRequestId, visitorId, sender: 'visitor', message: text }),
    }).catch(() => null);
    loadMessages();
  };

  const respond = async (accepted: boolean) => {
    if (!pendingRequest || !visitorId) return;

    const res = await fetch('/api/live-assist/request', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: pendingRequest.id, visitorId, accepted, currentPath: window.location.pathname }),
    });

    const data = await res.json().catch(() => null);
    const requestId = pendingRequest.id;
    setPendingRequest(null);

    if (!accepted || !data?.request?.session_id) return;

    setActiveRequestId(requestId);
    setSessionId(data.request.session_id);
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
    setActiveRequestId(null);
    setMessages([]);
    setLastMessageId(0);
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
            Our support team would like to help you on this website. If you accept, they can view your navigation in real time and chat with you here. Passwords, payment fields and sensitive inputs are masked.
          </p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => respond(true)} className="flex-1 bg-[#e11d48] text-white hover:bg-[#be123c]"><CheckCircle className="mr-2 h-4 w-4" /> Accept</Button>
            <Button onClick={() => respond(false)} variant="outline" className="flex-1"><XCircle className="mr-2 h-4 w-4" /> Decline</Button>
          </div>
        </div>
      )}

      {isActive && activeRequestId && (
        <div className="fixed bottom-6 right-4 z-[80] w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2 text-sm font-bold"><MessageCircle className="h-4 w-4" /> Live support</div>
            <button onClick={stop} className="text-xs opacity-90 hover:opacity-100"><StopCircle className="inline h-4 w-4" /> Stop</button>
          </div>
          <div className="max-h-[260px] min-h-[160px] space-y-2 overflow-y-auto bg-slate-50 p-3">
            {messages.length === 0 && <p className="text-center text-xs text-slate-500">Support is connected. You can chat here.</p>}
            {messages.map((m) => (
              <div key={m.id} className={`rounded-xl px-3 py-2 text-sm ${m.sender === 'visitor' ? 'ml-8 bg-[#e11d48] text-white' : 'mr-8 bg-white text-slate-800 shadow-sm'}`}>
                {m.message}
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t bg-white p-3">
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }} placeholder="Type your message..." />
            <Button onClick={sendMessage} className="bg-[#e11d48] text-white hover:bg-[#be123c]"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </>
  );
}
