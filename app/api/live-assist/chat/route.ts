import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const requestId = url.searchParams.get('requestId');
  const afterId = Number(url.searchParams.get('afterId') || '0');

  if (!requestId) return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });

  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('live_assist_messages')
    .select('id, request_id, visitor_id, sender, message, created_at')
    .eq('request_id', requestId)
    .gt('id', afterId)
    .order('id', { ascending: true })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data || [] });
}

export async function POST(req: Request) {
  const body = await req.json();
  const requestId = body.requestId;
  const visitorId = body.visitorId;
  const sender = body.sender === 'visitor' ? 'visitor' : 'admin';
  const message = String(body.message || '').trim().slice(0, 1000);

  if (!requestId || !visitorId || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('live_assist_messages')
    .insert({ request_id: requestId, visitor_id: visitorId, sender, message })
    .select('id, request_id, visitor_id, sender, message, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: data });
}
