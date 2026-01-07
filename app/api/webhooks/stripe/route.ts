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
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // --- PAIEMENT VALIDÉ ---
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};
      
      const type = metadata.type || 'new_lock';
      const lockId = parseInt(metadata.lock_id || '0');
      const userId = metadata.user_id;
      const amount = session.amount_total ? session.amount_total / 100 : 0;

      console.log(`💰 Paiement validé [${type}] pour Lock #${lockId}`);

      if (lockId) {
        
        // 1. LIVRAISON SELON LE TYPE
        if (type === 'new_lock') {
          // Activation d'un nouveau cadenas
          await supabase.from('locks').update({ 
            status: 'Active', 
            pending_until: null,
            locked_at: new Date().toISOString()
          }).eq('id', lockId);
        } 
        else if (type === 'boost') {
          // Application du Boost
          const pkg = metadata.boost_package || 'basic';
          // Date d'expiration (7, 14 ou 30 jours)
          const daysToAdd = pkg === 'vip' ? 30 : pkg === 'premium' ? 14 : 7;
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + daysToAdd);

          await supabase.from('locks').update({
            boost_level: pkg,
            boost_expires_at: expiresAt.toISOString()
          }).eq('id', lockId);
        }
        else if (type === 'marketplace') {
          // Transfert de propriété
          await supabase.from('locks').update({
            owner_id: userId, // Nouveau proprio
            status: 'Active', // Retrait de la vente
            resale_price: null,
            sale_description: null,
            boost_level: 'none' // Reset du boost
          }).eq('id', lockId);
        }

        // 2. LOG TRANSACTION
        await supabase.from('transactions').insert({
          lock_id: lockId,
          buyer_id: userId,
          transaction_type: type,
          amount: amount,
          platform_commission: type === 'marketplace' ? amount * 0.20 : 0
        });

        // 3. EMAIL
        const email = session.customer_email || session.metadata?.user_email;
        if (email) {
           try {
              await resend.emails.send({
                from: 'Love Lock Paris <noreply@lovelockparis.com>',
                to: email,
                subject: `Order Confirmed: ${type === 'boost' ? 'Boost Activated' : `Lock #${lockId}`}`,
                react: PurchaseEmail({ lockId, price: amount, date: new Date().toLocaleDateString() })
              });
           } catch(e) { console.error("Mail error", e); }
        }
      }
    }

    // --- NETTOYAGE SI ABANDON ---
    if (event.type === 'checkout.session.expired') {
      const lockId = parseInt(event.data.object.metadata?.lock_id || '0');
      // On supprime seulement les "Pending" (les nouveaux achats ratés)
      // On ne touche pas aux cadenas existants (boost/vente ratés)
      if (lockId) {
        await supabase.from('locks').delete().eq('id', lockId).eq('status', 'Pending');
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
