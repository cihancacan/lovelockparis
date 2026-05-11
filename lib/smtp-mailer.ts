import nodemailer from 'nodemailer';

type SendMailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} in Vercel environment variables`);
  return value;
}

export async function sendSmtpMail({ to, subject, html, text }: SendMailInput) {
  const host = requireEnv('SMTP_HOST');
  const port = Number(process.env.SMTP_PORT || '465');
  const user = requireEnv('SMTP_USER');
  const pass = requireEnv('SMTP_PASS');
  const secure = (process.env.SMTP_SECURE || 'true') === 'true';
  const from = process.env.SMTP_FROM || 'LoveLockParis <support@lovelockparis.com>';

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
    replyTo: process.env.SMTP_REPLY_TO || 'support@lovelockparis.com',
  });
}
