import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('sessionId');
  const afterId = Number(url.searchParams.get('afterId') || '0');

  if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  const result = await supabase
    .from('cobrowse_events')
    .select('id, event_data, created_at')
    .eq('session_id', sessionId)
    .gt('id', afterId)
    .order('id', { ascending: true })
    .limit(500);

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json({ events: result.data || [] });
}
