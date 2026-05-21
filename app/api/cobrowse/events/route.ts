import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  const body = await req.json();
  const sessionId = body.sessionId;
  const events = Array.isArray(body.events) ? body.events : [];
  const currentPath = body.currentPath || null;

  if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

  if (events.length > 0) {
    const rows = events.slice(0, 100).map((event: any) => ({
      session_id: sessionId,
      event_data: event,
    }));

    const { error } = await supabase.from('cobrowse_events').insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase
    .from('cobrowse_sessions')
    .update({ current_path: currentPath, last_seen_at: new Date().toISOString(), status: 'active' })
    .eq('id', sessionId);

  return NextResponse.json({ ok: true });
}
