export function welcomeEmailHtml(firstName: string | null, email: string) {
  const name = firstName || 'there';
  return `
  <div style="background:#f8fafc;padding:32px 16px;font-family:Arial,sans-serif;color:#0f172a">
    <div style="max-width:560px;margin:0 auto;background:white;border-radius:24px;padding:36px 30px;text-align:center">
      <div style="color:#e11d48;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px">LoveLockParis</div>
      <h1 style="font-size:32px;line-height:38px;margin:0 0 18px">Welcome, ${name}</h1>
      <p style="font-size:16px;line-height:25px;color:#334155;margin:0 0 14px">Your LoveLockParis account has been created successfully.</p>
      <p style="font-size:16px;line-height:25px;color:#334155;margin:0 0 24px">You can now create a digital love lock, manage your locks, add memories, and access your dashboard anytime.</p>
      <a href="https://lovelockparis.com/dashboard" style="display:inline-block;background:#e11d48;color:white;text-decoration:none;font-weight:700;border-radius:999px;padding:14px 22px;margin:8px 0 24px">Open My Dashboard</a>
      <p style="font-size:13px;color:#64748b;margin:0 0 20px">Account email: ${email}</p>
      <p style="font-size:13px;line-height:20px;color:#64748b;margin:24px 0 0">Need help? Reply to this email or contact support@lovelockparis.com.</p>
    </div>
  </div>`;
}

export function purchaseEmailHtml(lockId: number, price: number, date: string) {
  return `
  <div style="background:#f8fafc;padding:32px 16px;font-family:Arial,sans-serif;color:#0f172a">
    <div style="max-width:560px;margin:0 auto;background:white;border-radius:24px;overflow:hidden">
      <div style="text-align:center;padding:32px 28px 20px">
        <div style="color:#e11d48;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px">LoveLockParis</div>
        <h1 style="font-size:30px;line-height:36px;margin:0">Your love lock is confirmed</h1>
        <p style="color:#64748b;font-size:16px;line-height:24px;margin:16px 0 0">Thank you for creating a digital love lock in Paris.</p>
      </div>
      <div style="padding:24px 28px;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0">
        <p style="color:#64748b;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0">Lock number</p>
        <p style="color:#e11d48;font-size:34px;font-weight:800;margin:8px 0 0">#${lockId}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:22px 0" />
        <p style="color:#334155;font-size:15px;line-height:22px;margin:8px 0">Order date: <strong>${date}</strong></p>
        <p style="color:#334155;font-size:15px;line-height:22px;margin:8px 0">Amount paid: <strong>$${price.toFixed(2)}</strong></p>
      </div>
      <div style="padding:24px 28px;text-align:center">
        <p style="color:#334155;font-size:16px;line-height:25px;margin:0 0 22px">Your digital lock is being secured on the LoveLockParis registry. You can create or log into your account to manage your lock, add media, and access your dashboard.</p>
        <a href="https://lovelockparis.com/dashboard" style="display:inline-block;background:#e11d48;color:white;text-decoration:none;font-weight:700;border-radius:999px;padding:14px 22px">Open Dashboard</a>
      </div>
      <p style="color:#64748b;font-size:13px;line-height:20px;text-align:center;margin:0;padding:0 28px 28px">Need help? Reply to this email or contact support@lovelockparis.com.</p>
    </div>
  </div>`;
}
