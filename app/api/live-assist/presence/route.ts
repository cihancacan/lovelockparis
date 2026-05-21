import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  const body = await req.json();
  const visitorId = body.visitorId;

  if (!visitorId) return NextResponse.json({ error: 'Missing visitorId' }, { status: 400 });

  const { error } = await supabase.from('live_assist_visitors').upsert({
    visitor_id: visitorId,
    current_path: body.currentPath || '/',
    last_seen_at: new Date().toISOString(),
    metadata: body.metadata || {},
  }, { onConflict: 'visitor_id' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  const since = new Date(Date.now() - 1000 * 60 * 5).toISOString();

  const { data, error } = await supabase
    .from('live_assist_visitors')
    .select('visitor_id, current_path, last_seen_at, metadata')
    .gte('last_seen_at', since)
    .order('last_seen_at', { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ visitors: data || [] });
}
