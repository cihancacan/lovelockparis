'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, LifeBuoy, Send, Clock } from 'lucide-react';

type VisitorItem = { visitor_id: string; current_path?: string | null; last_seen_at: string; metadata?: any };
type RequestState = { id: string; visitor_id: string; status: string; session_id?: string | null };
type LiveFrame = { session_id: string; visitor_id: string; image_data: string; current_path?: string | null; updated_at: string };

export function AssistancePanel() {
  const [visitors, setVisitors] = useState<VisitorItem[]>([]);
  const [selected, setSelected] = useState<VisitorItem | null>(null);
  const [activeRequest, setActiveRequest] = useState<RequestState | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [frame, setFrame] = useState<LiveFrame | null>(null);
  const [loading, setLoading] = useState(false);

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
    setSessionId(null);
    setFrame(null);

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

  const loadFrame = async () => {
    if (!sessionId) return;
    const res = await fetch(`/api/live-assist/frame?sessionId=${sessionId}`).catch(() => null);
    if (!res) return;
    const data = await res.json().catch(() => null);
    if (data?.frame) setFrame(data.frame);
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
    loadFrame();
    const t = window.setInterval(loadFrame, 1000);
    return () => window.clearInterval(t);
  }, [sessionId]);

  const isOnline = (d: string) => Date.now() - new Date(d).getTime() < 15000;
  const frameFresh = frame ? Date.now() - new Date(frame.updated_at).getTime() < 5000 : false;

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
              {frame && <Badge className={frameFresh ? 'bg-emerald-600' : 'bg-slate-500'}>{frameFresh ? 'LIVE' : 'FRAME OLD'}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selected && <div className="flex min-h-[620px] items-center justify-center rounded-xl border border-dashed text-slate-500">Choisis un visiteur.</div>}
            {selected && !sessionId && activeRequest?.status !== 'declined' && <div className="flex min-h-[620px] items-center justify-center rounded-xl border border-dashed text-slate-500">En attente de l’accord...</div>}
            {activeRequest?.status === 'declined' && <div className="flex min-h-[620px] items-center justify-center rounded-xl border border-dashed text-red-500">Accès refusé.</div>}
            {sessionId && !frame && <div className="flex min-h-[620px] items-center justify-center rounded-xl border border-dashed text-slate-500">Accès accepté. En attente de la première image live...</div>}
            {frame && (
              <div className="overflow-auto rounded-xl border bg-slate-950 p-3">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
                  <span>{frame.current_path || '/'}</span>
                  <span>{new Date(frame.updated_at).toLocaleTimeString()}</span>
                </div>
                <img src={frame.image_data} alt="Live assistance view" className="mx-auto max-h-[720px] max-w-full rounded-lg bg-white object-contain" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
