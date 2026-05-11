export function passwordResetEmailHtml(actionUrl: string, email: string) {
  return `
  <div style="background:#f8fafc;padding:32px 16px;font-family:Arial,sans-serif;color:#0f172a">
    <div style="max-width:560px;margin:0 auto;background:white;border-radius:24px;padding:36px 30px;text-align:center">
      <div style="color:#e11d48;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px">LoveLockParis</div>
      <h1 style="font-size:30px;line-height:36px;margin:0 0 18px">Reset your password</h1>
      <p style="font-size:16px;line-height:25px;color:#334155;margin:0 0 14px">We received a request to reset the password for your LoveLockParis account.</p>
      <p style="font-size:16px;line-height:25px;color:#334155;margin:0 0 24px">Click the button below to choose a new password.</p>
      <a href="${actionUrl}" style="display:inline-block;background:#e11d48;color:white;text-decoration:none;font-weight:700;border-radius:999px;padding:14px 24px;margin:8px 0 24px">Reset My Password</a>
      <p style="font-size:13px;color:#64748b;margin:0 0 12px">Account email: ${email}</p>
      <p style="font-size:13px;line-height:20px;color:#64748b;margin:0 0 20px">If you did not request this, you can safely ignore this email.</p>
      <p style="font-size:13px;line-height:20px;color:#64748b;margin:24px 0 0">Need help? Reply to this email or contact support@lovelockparis.com.</p>
    </div>
  </div>`;
}
