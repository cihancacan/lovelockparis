import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendSmtpMail } from '@/lib/smtp-mailer';
import { passwordResetEmailHtml } from '@/lib/password-reset-html';

export const dynamic = 'force-dynamic';

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

  try {
    const body = await req.json();
    email = String(body.email || '').trim().toLowerCase();

    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: 'https://lovelockparis.com/login',
      },
    });

    if (error) throw error;

    const actionUrl = data?.properties?.action_link;
    if (!actionUrl) throw new Error('Could not generate password reset link');

    await supabase.from('email_events').insert({
      email,
      event_type: 'password_reset',
      status: 'pending',
      provider: 'smtp',
    });

    const result: any = await sendSmtpMail({
      to: email,
      subject: 'Reset your LoveLockParis password',
      html: passwordResetEmailHtml(actionUrl, email),
      text: `Reset your LoveLockParis password: ${actionUrl}`,
    });

    await supabase.from('email_events').insert({
      email,
      event_type: 'password_reset',
      status: 'sent',
      provider: 'smtp',
      provider_id: result?.messageId || null,
      metadata: { response: result?.response || null },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const message = getErrorMessage(error);

    if (email) {
      await supabase.from('email_events').insert({
        email,
        event_type: 'password_reset',
        status: 'failed',
        provider: 'smtp',
        error_message: message,
      });
    }

    console.error('Password reset email failed', message, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
