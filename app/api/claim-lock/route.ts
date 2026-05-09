import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { lockId } = await req.json();
    if (!lockId) return NextResponse.json({ error: 'Missing lockId' }, { status: 400 });

    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) return NextResponse.json({ error: 'Invalid user' }, { status: 401 });

    const { data: lock } = await supabase
      .from('locks')
      .select('id, owner_id, status')
      .eq('id', lockId)
      .maybeSingle();

    if (!lock) return NextResponse.json({ error: 'Lock not found' }, { status: 404 });
    if (lock.owner_id && lock.owner_id !== userData.user.id) return NextResponse.json({ error: 'Lock already claimed' }, { status: 409 });

    const { error } = await supabase
      .from('locks')
      .update({ owner_id: userData.user.id })
      .eq('id', lockId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
