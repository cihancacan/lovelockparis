import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { PurchaseEmail } from '@/components/emails/PurchaseEmail';

// Force le mode dynamique
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
      return NextResponse.json({ error: 'Missing signature/secret' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Initialisation Supabase Admin
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // --- CAS 1 : PAIEMENT RÉUSSI ---
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Récupération des infos
      const lockId = parseInt(session.metadata?.lock_id || '0');
      const userId = session.metadata?.user_id;
      const userEmail = session.customer_email || session.metadata?.user_email; // Email client

      console.log(`💰 Paiement reçu pour Cadenas #${lockId} (User: ${userId})`);

      if (lockId && userId) {
        // 1. Activer le cadenas en BDD
        const { error: updateError } = await supabase
          .from('locks')
          .update({ 
            status: 'Active', 
            pending_until: null,
            stripe_session_id: session.id,
            locked_at: new Date().toISOString()
          })
          .eq('id', lockId)
          .eq('owner_id', userId);

        if (updateError) console.error("Erreur Update DB:", updateError);

        // 2. Créer la transaction financière
        await supabase.from('transactions').insert({
          lock_id: lockId,
          buyer_id: userId,
          transaction_type: 'purchase',
          amount: session.amount_total ? session.amount_total / 100 : 0,
        });

        // 3. Envoyer l'email de confirmation
        if (userEmail) {
          try {
            await resend.emails.send({
              from: 'Love Lock Paris <noreply@lovelockparis.com>',
              to: userEmail,
              subject: `Love Lock #${lockId} Secured! 🔒`,
              react: PurchaseEmail({
                lockId: lockId,
                price: session.amount_total ? session.amount_total / 100 : 0,
                date: new Date().toLocaleDateString()
              })
            });
            console.log(`📧 Email envoyé à ${userEmail}`);
          } catch (emailError) {
            console.error("❌ Erreur envoi email:", emailError);
          }
        }
      }
    }

    // --- CAS 2 : PAIEMENT EXPIRÉ (Nettoyage) ---
    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      const lockId = parseInt(session.metadata?.lock_id || '0');
      
      if (lockId) {
        await supabase.from('locks').delete().eq('id', lockId).eq('status', 'Pending');
        console.log(`🧹 Cadenas #${lockId} libéré (Session expirée)`);
      }
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error("Erreur Serveur:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
