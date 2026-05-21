'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, LifeBuoy, Send, Clock } from 'lucide-react';

type VisitorItem = { visitor_id: string; current_path?: string | null; last_seen_at: string; metadata?: any };
type RequestState = { id: string; visitor_id: string; status: string; session_id?: string | null };

export function AssistancePanel() {
  const [visitors, setVisitors] = useState<VisitorItem[]>([]);
  const [selected, setSelected] = useState<VisitorItem | null>(null);
  const [activeRequest, setActiveRequest] = useState<RequestState | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [lastId, setLastId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewerError, setViewerError] = useState('');
  const replayRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  const loadVisitors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/live-assist/presence');
      const data = await res.json();
      setVisitors(data.visitors || []);
    } finally {
      setLoading(false);
    }
  };

  const requestAccess = async (visitor: VisitorItem) => {
    setSelected(visitor);
    setEvents([]);
    setLastId(0);
    setSessionId(null);
    setViewerError('');
    playerRef.current = null;
    if (replayRef.current) replayRef.current.innerHTML = '';

    const res = await fetch('/api/live-assist/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId: visitor.visitor_id, metadata: { requestedFrom: 'admin' } }),
    });
    const data = await res.json();
    if (data.request) setActiveRequest(data.request);
  };

  const checkRequest = async () => {
    if (!activeRequest?.id) return;
    const res = await fetch(`/api/live-assist/request?requestId=${activeRequest.id}`);
    const data = await res.json();
    if (!data.request) return;
    setActiveRequest(data.request);
    if (data.request.status === 'accepted' && data.request.session_id) setSessionId(data.request.session_id);
  };

  const loadEvents = async (id: string, after = 0) => {
    const res = await fetch(`/api/live-assist/events?sessionId=${id}&afterId=${after}`);
    const data = await res.json();
    const rows = data.events || [];
    if (rows.length) {
      setLastId(rows[rows.length - 1].id);
      setEvents((prev) => [...prev, ...rows.map((x: any) => x.event_data)]);
    }
  };

  useEffect(() => {
    loadVisitors();
    const t = window.setInterval(loadVisitors, 5000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!activeRequest?.id || sessionId) return;
    const t = window.setInterval(checkRequest, 1500);
    return () => window.clearInterval(t);
  }, [activeRequest?.id, sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    loadEvents(sessionId, lastId);
    const t = window.setInterval(() => loadEvents(sessionId, lastId), 900);
    return () => window.clearInterval(t);
  }, [sessionId, lastId]);

  useEffect(() => {
    const render = async () => {
      if (!replayRef.current || events.length < 2 || playerRef.current) return;
      try {
        setViewerError('');
        replayRef.current.innerHTML = '';
        const mod: any = await import('rrweb-player');
        const Player = mod.default || mod;
        playerRef.current = new Player({
          target: replayRef.current,
          props: {
            events,
            width: 980,
            height: 620,
            autoPlay: true,
            showController: false,
          },
        });
      } catch (e: any) {
        setViewerError(e?.message || 'Live viewer could not start');
      }
    };
    render();
  }, [events.length, sessionId]);

  const isOnline = (d: string) => Date.now() - new Date(d).getTime() < 15000;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold"><LifeBuoy className="h-6 w-6 text-rose-600" /> ASSISTANCE LIVE</h2>
            <p className="mt-2 text-sm text-slate-600">Demande l’accès au visiteur. Pour discuter, utilise Crisp.</p>
          </div>
          <Button onClick={loadVisitors} disabled={loading} className="bg-[#e11d48] text-white hover:bg-[#be123c]"><RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>Visiteurs</CardTitle></CardHeader>
          <CardContent className="space-y-3 max-h-[720px] overflow-y-auto">
            {visitors.length === 0 && <p className="text-sm text-slate-500">Aucun visiteur détecté.</p>}
            {visitors.map((v) => (
              <div key={v.visitor_id} className={`rounded-xl border p-3 ${selected?.visitor_id === v.visitor_id ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white'}`}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <strong className="truncate text-sm">Visitor {v.visitor_id.slice(0, 8)}</strong>
                  <Badge className={isOnline(v.last_seen_at) ? 'bg-emerald-600' : 'bg-slate-400'}>{isOnline(v.last_seen_at) ? 'ONLINE' : 'IDLE'}</Badge>
                </div>
                <p className="mb-3 truncate text-xs text-slate-500">{v.current_path || '/'}</p>
                <Button onClick={() => requestAccess(v)} size="sm" className="w-full bg-slate-900 text-white hover:bg-slate-800"><Send className="mr-2 h-4 w-4" /> Demander l’accès</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-3">
              <span>{selected ? `Visitor ${selected.visitor_id.slice(0, 8)}` : 'Sélectionner un visiteur'}</span>
              {activeRequest?.status === 'pending' && <Badge className="bg-amber-500"><Clock className="mr-1 h-3 w-3" /> En attente</Badge>}
              {activeRequest?.status === 'declined' && <Badge className="bg-red-600">Refusé</Badge>}
              {activeRequest?.status === 'accepted' && <Badge className="bg-emerald-600">Accepté</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selected && <div className="flex min-h-[620px] items-center justify-center rounded-xl border border-dashed text-slate-500">Choisis un visiteur.</div>}
            {selected && !sessionId && activeRequest?.status !== 'declined' && <div className="flex min-h-[620px] items-center justify-center rounded-xl border border-dashed text-slate-500">En attente de l’accord...</div>}
            {activeRequest?.status === 'declined' && <div className="flex min-h-[620px] items-center justify-center rounded-xl border border-dashed text-red-500">Accès refusé.</div>}
            {sessionId && events.length < 2 && <div className="flex min-h-[620px] items-center justify-center rounded-xl border border-dashed text-slate-500">Initialisation du live... ({events.length} event)</div>}
            {viewerError && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Erreur live : {viewerError}</div>}
            <div ref={replayRef} className={sessionId && events.length >= 2 ? 'min-h-[620px] overflow-hidden rounded-xl border bg-black' : 'hidden'} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
