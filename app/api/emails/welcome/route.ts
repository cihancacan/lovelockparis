import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email;
    const firstName = body.firstName || null;

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const result = await resend.emails.send({
      from: 'LoveLockParis <support@lovelockparis.com>',
      to: email,
      subject: 'Welcome to LoveLockParis',
      react: WelcomeEmail({ firstName, email }),
    });

    console.log('Welcome email sent', result);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Welcome email failed', error);
    return NextResponse.json({ error: error.message || 'Email failed' }, { status: 500 });
  }
}
