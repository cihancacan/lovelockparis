'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, LifeBuoy } from 'lucide-react';

type SessionItem = {
  id: string;
  visitor_id: string;
  email?: string | null;
  current_path?: string | null;
  status: string;
  last_seen_at: string;
};

export function AssistancePanel() {
  const [items, setItems] = useState<SessionItem[]>([]);
  const [selected, setSelected] = useState<SessionItem | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [lastId, setLastId] = useState(0);
  const [loading, setLoading] = useState(false);
  const replayRef = useRef<HTMLDivElement | null>(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/live-assist/list');
      const data = await res.json();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
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
    loadItems();
    const t = window.setInterval(loadItems, 5000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    setEvents([]);
    setLastId(0);
    if (replayRef.current) replayRef.current.innerHTML = '';
    if (selected?.id) loadEvents(selected.id, 0);
  }, [selected?.id]);

  useEffect(() => {
    if (!selected?.id) return;
    const t = window.setInterval(() => loadEvents(selected.id, lastId), 2500);
    return () => window.clearInterval(t);
  }, [selected?.id, lastId]);

  useEffect(() => {
    const render = async () => {
      if (!replayRef.current || events.length < 2) return;
      replayRef.current.innerHTML = '';
      const mod: any = await import('rrweb-player');
      await import('rrweb-player/dist/style.css');
      const Player = mod.default || mod;
      new Player({ target: replayRef.current, props: { events, width: 900, height: 560, autoPlay: true, showController: true } });
    };
    render();
  }, [events.length, selected?.id]);

  const live = (d: string) => Date.now() - new Date(d).getTime() < 15000;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900"><LifeBuoy className="h-6 w-6 text-rose-600" /> ASSISTANCE</h2>
            <p className="mt-2 text-sm text-slate-600">Sessions démarrées volontairement par le visiteur. Les champs sensibles sont masqués.</p>
          </div>
          <Button onClick={loadItems} disabled={loading} className="bg-[#e11d48] text-white hover:bg-[#be123c]"><RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Visiteurs</CardTitle></CardHeader>
          <CardContent className="space-y-3 max-h-[620px] overflow-y-auto">
            {items.length === 0 && <p className="text-sm text-slate-500">Aucune session active.</p>}
            {items.map((item) => (
              <button key={item.id} onClick={() => setSelected(item)} className={`w-full rounded-xl border p-3 text-left ${selected?.id === item.id ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center justify-between gap-2"><strong className="truncate text-sm">{item.email || `Visitor ${item.visitor_id.slice(0, 8)}`}</strong><Badge className={live(item.last_seen_at) ? 'bg-emerald-600' : 'bg-slate-400'}>{live(item.last_seen_at) ? 'LIVE' : 'IDLE'}</Badge></div>
                <p className="mt-1 truncate text-xs text-slate-500">{item.current_path || '/'}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>{selected ? (selected.email || `Visitor ${selected.visitor_id.slice(0, 8)}`) : 'Sélectionner une session'}</CardTitle></CardHeader>
          <CardContent>
            {!selected && <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-dashed text-slate-500">Sélectionne un visiteur à gauche.</div>}
            {selected && events.length < 2 && <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-dashed text-slate-500">En attente des données...</div>}
            <div ref={replayRef} className={selected && events.length >= 2 ? 'overflow-hidden rounded-xl border bg-black' : 'hidden'} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
