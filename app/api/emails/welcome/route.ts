import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getErrorMessage(error: any) {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  try { return JSON.stringify(error); } catch { return 'Unknown error'; }
}

export async function POST(req: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  let email = '';
  let firstName: string | null = null;

  try {
    const body = await req.json();
    email = body.email;
    firstName = body.firstName || null;

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    await supabase.from('email_events').insert({
      email,
      event_type: 'welcome',
      status: 'pending',
      metadata: { firstName }
    });

    if (!process.env.RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY in Vercel environment variables');
    }

    const result: any = await resend.emails.send({
      from: 'LoveLockParis <support@lovelockparis.com>',
      to: email,
      subject: 'Welcome to LoveLockParis',
      react: WelcomeEmail({ firstName, email }),
    });

    if (result?.error) {
      throw new Error(getErrorMessage(result.error));
    }

    await supabase.from('email_events').insert({
      email,
      event_type: 'welcome',
      status: 'sent',
      provider: 'resend',
      provider_id: result?.data?.id || result?.id || null,
      metadata: { firstName, result }
    });

    console.log('Welcome email sent', result);
    return NextResponse.json({ ok: true, id: result?.data?.id || result?.id || null });
  } catch (error: any) {
    const message = getErrorMessage(error);
    console.error('Welcome email failed', message, error);

    if (email) {
      await supabase.from('email_events').insert({
        email,
        event_type: 'welcome',
        status: 'failed',
        provider: 'resend',
        error_message: message,
        metadata: { firstName }
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
