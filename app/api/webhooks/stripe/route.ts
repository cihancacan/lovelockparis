import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-11-17.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const lockId = parseInt(session.metadata?.lock_id || '0');
      const userId = session.metadata?.user_id;

      if (!lockId || !userId) {
        console.error('Missing metadata in session');
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
      }

      const { error: updateError } = await supabase
        .from('locks')
        .update({
          status: 'Active',
          pending_until: null,
        })
        .eq('id', lockId)
        .eq('owner_id', userId);

      if (updateError) {
        console.error('Error updating lock status:', updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      const { data: lock } = await supabase
        .from('locks')
        .select('price')
        .eq('id', lockId)
        .single();

      if (lock) {
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            lock_id: lockId,
            buyer_id: userId,
            transaction_type: 'purchase',
            amount: lock.price,
            platform_commission: 0,
          });

        if (transactionError) {
          console.error('Error creating transaction:', transactionError);
        }
      }

      console.log(`lock #${lockId} activated for user ${userId}`);
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      const lockId = parseInt(session.metadata?.lock_id || '0');

      if (lockId) {
        const { error: deleteError } = await supabase
          .from('locks')
          .delete()
          .eq('id', lockId)
          .eq('status', 'Pending');

        if (deleteError) {
          console.error('Error deleting expired lock:', deleteError);
        } else {
          console.log(`Expired lock #${lockId} deleted`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
