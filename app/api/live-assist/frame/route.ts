import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  const body = await req.json();
  const sessionId = body.sessionId;
  const visitorId = body.visitorId;
  const imageData = body.imageData;

  if (!sessionId || !visitorId || !imageData) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  const { error } = await supabase.from('live_assist_latest_frames').upsert({
    session_id: sessionId,
    visitor_id: visitorId,
    image_data: imageData,
    current_path: body.currentPath || '/',
    updated_at: new Date().toISOString(),
  }, { onConflict: 'session_id' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('sessionId');

  if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('live_assist_latest_frames')
    .select('session_id, visitor_id, image_data, current_path, updated_at')
    .eq('session_id', sessionId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ frame: data || null });
}
