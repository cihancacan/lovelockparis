import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendSmtpMail } from '@/lib/smtp-mailer';
import { welcomeEmailHtml } from '@/lib/email-html';

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
  let firstName: string | null = null;

  try {
    const body = await req.json();
    email = body.email;
    firstName = body.firstName || null;

    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

    await supabase.from('email_events').insert({
      email,
      event_type: 'welcome',
      status: 'pending',
      provider: 'smtp',
      metadata: { firstName }
    });

    const result: any = await sendSmtpMail({
      to: email,
      subject: 'Welcome to LoveLockParis',
      html: welcomeEmailHtml(firstName, email),
      text: `Welcome to LoveLockParis. Your account ${email} has been created successfully.`,
    });

    await supabase.from('email_events').insert({
      email,
      event_type: 'welcome',
      status: 'sent',
      provider: 'smtp',
      provider_id: result?.messageId || null,
      metadata: { firstName, response: result?.response || null }
    });

    console.log('Welcome SMTP email sent', result?.messageId || result);
    return NextResponse.json({ ok: true, id: result?.messageId || null });
  } catch (error: any) {
    const message = getErrorMessage(error);
    console.error('Welcome SMTP email failed', message, error);

    if (email) {
      await supabase.from('email_events').insert({
        email,
        event_type: 'welcome',
        status: 'failed',
        provider: 'smtp',
        error_message: message,
        metadata: { firstName }
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
