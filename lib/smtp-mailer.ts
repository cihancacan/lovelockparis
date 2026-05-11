import nodemailer from 'nodemailer';

type SendMailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

function requireValue(name: string, value?: string) {
  if (!value) throw new Error(`Missing ${name} in Vercel environment variables`);
  return value;
}

export async function sendSmtpMail({ to, subject, html, text }: SendMailInput) {
  const host = process.env.SMTP_HOST || 'ssl0.ovh.net';
  const port = Number(process.env.SMTP_PORT || '465');
  const secure = (process.env.SMTP_SECURE || 'true') === 'true';
  const user = process.env.SMTP_USER || 'support@lovelockparis.com';
  const pass = requireValue('SMTP_PASS', process.env.SMTP_PASS);
  const from = process.env.SMTP_FROM || 'LoveLockParis <support@lovelockparis.com>';
  const replyTo = process.env.SMTP_REPLY_TO || 'support@lovelockparis.com';

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
    replyTo,
  });
}
