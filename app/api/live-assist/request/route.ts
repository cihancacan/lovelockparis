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

  await supabase
    .from('live_assist_requests')
    .update({ status: 'expired' })
    .eq('visitor_id', visitorId)
    .eq('status', 'pending');

  const { data, error } = await supabase
    .from('live_assist_requests')
    .insert({ visitor_id: visitorId, status: 'pending', metadata: body.metadata || {} })
    .select('id, visitor_id, status')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ request: data });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const visitorId = url.searchParams.get('visitorId');
  const requestId = url.searchParams.get('requestId');

  if (!visitorId && !requestId) return NextResponse.json({ error: 'Missing visitorId or requestId' }, { status: 400 });

  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  let query = supabase
    .from('live_assist_requests')
    .select('id, visitor_id, status, session_id, created_at, responded_at')
    .order('created_at', { ascending: false })
    .limit(1);

  if (requestId) query = query.eq('id', requestId);
  else query = query.eq('visitor_id', visitorId).eq('status', 'pending');

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ request: data?.[0] || null });
}

export async function PATCH(req: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  const body = await req.json();
  const requestId = body.requestId;
  const accepted = body.accepted === true;

  if (!requestId) return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });

  if (!accepted) {
    const { data, error } = await supabase
      .from('live_assist_requests')
      .update({ status: 'declined', responded_at: new Date().toISOString() })
      .eq('id', requestId)
      .select('id, status')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ request: data });
  }

  const visitorId = body.visitorId || crypto.randomUUID();
  const { data: session, error: sessionError } = await supabase
    .from('cobrowse_sessions')
    .insert({ visitor_id: visitorId, current_path: body.currentPath || '/', status: 'active', metadata: { consent: true, liveOnly: true } })
    .select('id')
    .single();

  if (sessionError) return NextResponse.json({ error: sessionError.message }, { status: 500 });

  const { data, error } = await supabase
    .from('live_assist_requests')
    .update({ status: 'accepted', session_id: session.id, responded_at: new Date().toISOString() })
    .eq('id', requestId)
    .select('id, status, session_id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ request: data });
}
