import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { PurchaseEmail } from '@/components/emails/PurchaseEmail';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch {
      return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};
      const type = metadata.type || 'new_lock';
      const lockId = parseInt(metadata.lock_id || '0');
      const userId = metadata.user_id || null;
      const amount = session.amount_total ? session.amount_total / 100 : 0;

      if (lockId) {
        if (type === 'new_lock') {
          await supabase
            .from('locks')
            .update({ status: 'Active', pending_until: null, locked_at: new Date().toISOString() })
            .eq('id', lockId);
        } else if (type === 'boost') {
          const pkg = metadata.boost_package || 'basic';
          const daysToAdd = pkg === 'vip' ? 30 : pkg === 'premium' ? 14 : 7;
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + daysToAdd);
          await supabase
            .from('locks')
            .update({ boost_level: pkg, boost_expires_at: expiresAt.toISOString() })
            .eq('id', lockId);
        } else if (type === 'marketplace') {
          await supabase
            .from('locks')
            .update({ owner_id: userId, status: 'Active', resale_price: null, boost_level: 'none' })
            .eq('id', lockId);
        } else if (type === 'media_upgrade') {
          await supabase
            .from('locks')
            .update({ media_type: metadata.media_type || null, is_media_enabled_: true })
            .eq('id', lockId);
        } else if (type === 'media_unlock' && userId) {
          const { data: existing } = await supabase
            .from('media_unlocks')
            .select('id')
            .eq('lock_id', lockId)
            .eq('user_id', userId)
            .maybeSingle();

          if (!existing) {
            await supabase.from('media_unlocks').insert({ lock_id: lockId, user_id: userId });

            const { data: lock } = await supabase
              .from('locks')
              .select('media_views, media_earnings')
              .eq('id', lockId)
              .single();

            await supabase
              .from('locks')
              .update({
                media_views: (lock?.media_views || 0) + 1,
                media_earnings: (lock?.media_earnings || 0) + 2.99
              })
              .eq('id', lockId);
          }
        }

        await supabase.from('transactions').insert({
          lock_id: lockId,
          buyer_id: userId || null,
          transaction_type: type,
          amount
        });

        const email = session.customer_details?.email || session.customer_email || metadata.user_email;

        if (email && type !== 'media_unlock') {
          try {
            const result = await resend.emails.send({
              from: 'LoveLockParis <support@lovelockparis.com>',
              to: email,
              subject: `LoveLockParis order confirmed - Lock #${lockId}`,
              react: PurchaseEmail({
                lockId,
                price: amount,
                date: new Date().toLocaleDateString()
              })
            });
            console.log('Resend email sent', result);
          } catch (emailError) {
            console.error('Resend email failed', emailError);
          }
        } else {
          console.log('Resend email skipped', { email, type });
        }
      }
    }

    if (event.type === 'checkout.session.expired') {
      const lockId = parseInt(event.data.object.metadata?.lock_id || '0');
      if (lockId) {
        await supabase.from('locks').delete().eq('id', lockId).eq('status', 'Pending');
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook failed', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
