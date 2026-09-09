import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const ALLOWED_EVENTS = new Set([
  'purchase_view',
  'personalization_started',
  'finish_selected',
  'extras_opened',
  'checkout_click',
  'checkout_error',
  'home_cta_click',
]);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventType = String(body?.eventType || '');
    if (!ALLOWED_EVENTS.has(eventType)) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const metadata = body?.metadata && typeof body.metadata === 'object'
      ? body.metadata
      : {};

    const { error } = await supabase.from('conversion_events').insert({
      event_type: eventType,
      visitor_id: body?.visitorId ? String(body.visitorId).slice(0, 128) : null,
      locale: body?.locale ? String(body.locale).slice(0, 16) : null,
      path: body?.path ? String(body.path).slice(0, 300) : null,
      metadata,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to log event' }, { status: 500 });
  }
}
