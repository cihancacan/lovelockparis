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

    if (!signature || !webhookSecret) return NextResponse.json({ error: 'No signature' }, { status: 400 });

    let event: Stripe.Event;
    try { event = stripe.webhooks.constructEvent(body, signature, webhookSecret); } 
    catch (err: any) { return NextResponse.json({ error: `Webhook Error` }, { status: 400 }); }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};
      const type = metadata.type || 'new_lock';
      const lockId = parseInt(metadata.lock_id || '0');
      const userId = metadata.user_id;
      const amount = session.amount_total ? session.amount_total / 100 : 0;

      if (lockId) {
        
        // NOUVEAU LOCK
        if (type === 'new_lock') {
          await supabase.from('locks').update({ status: 'Active', pending_until: null, locked_at: new Date().toISOString() }).eq('id', lockId);
        } 
        // BOOST
        else if (type === 'boost') {
          const pkg = metadata.boost_package || 'basic';
          const daysToAdd = pkg === 'vip' ? 30 : pkg === 'premium' ? 14 : 7;
          const expiresAt = new Date(); expiresAt.setDate(expiresAt.getDate() + daysToAdd);
          await supabase.from('locks').update({ boost_level: pkg, boost_expires_at: expiresAt.toISOString() }).eq('id', lockId);
        }
        // MARKETPLACE
        else if (type === 'marketplace') {
          await supabase.from('locks').update({ owner_id: userId, status: 'Active', resale_price: null, boost_level: 'none' }).eq('id', lockId);
        }
        
        // --- NOUVEAU : MEDIA UPGRADE ---
        else if (type === 'media_upgrade') {
          // On active le type de média spécifique (photo, video, audio)
          await supabase.from('locks').update({ media_type: metadata.media_type }).eq('id', lockId);
        }

        // UNLOCK (Visiteur)
        else if (type === 'media_unlock') {
           const { data: lock } = await supabase.from('locks').select('owner_id, media_views, media_earnings').eq('id', lockId).single();
           if (lock && lock.owner_id) {
               // On crédite le solde du user (il faudra une fonction RPC ou update direct si RLS admin le permet)
               // Ici on update juste les stats du cadenas pour l'exemple
               await supabase.from('locks').update({ 
                   media_views: (lock.media_views || 0) + 1,
                   media_earnings: (lock.media_earnings || 0) + 2.99
               }).eq('id', lockId);
           }
        }

        // LOG
        await supabase.from('transactions').insert({
          lock_id: lockId,
          buyer_id: userId,
          transaction_type: type,
          amount: amount
        });

        // MAIL
        const email = session.customer_email || session.metadata?.user_email;
        if (email && type !== 'media_unlock') {
           try {
              await resend.emails.send({
                from: 'Love Lock Paris <noreply@lovelockparis.com>',
                to: email,
                subject: `Order Confirmed: ${type}`,
                react: PurchaseEmail({ lockId, price: amount, date: new Date().toLocaleDateString() })
              });
           } catch(e) {}
        }
      }
    }

    if (event.type === 'checkout.session.expired') {
      const lockId = parseInt(event.data.object.metadata?.lock_id || '0');
      if (lockId) await supabase.from('locks').delete().eq('id', lockId).eq('status', 'Pending');
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
