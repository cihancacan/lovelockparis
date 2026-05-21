import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  const body = await req.json();
  const visitorId = body.visitorId || crypto.randomUUID();

  const { data, error } = await supabase
    .from('cobrowse_sessions')
    .insert({
      visitor_id: visitorId,
      current_path: body.currentPath || '/',
      email: body.email || null,
      status: 'active',
      metadata: body.metadata || {},
    })
    .select('id, visitor_id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, sessionId: data.id, visitorId: data.visitor_id });
}
