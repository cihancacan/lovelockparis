import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://lovelockparis.com';
    
    // Identification
    const userId = body.userId;
    const userEmail = body.userEmail;

    // Calcul du prix
    let finalPrice = Number(body.totalPrice);
    if (!finalPrice || finalPrice <= 0) finalPrice = 29.99;

    const lockId = body.selectedNumber || Math.floor(Math.random() * 900000) + 100000;
    const type = body.type || 'new_lock'; // 'new_lock', 'boost', 'marketplace'

    // --- SÉCURITÉ ABSOLUE : ZÉRO MODIF SI BOOST/VENTE ---
    
    if (type === 'new_lock') {
      const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
      
      // On crée un cadenas PENDING (invisible)
      const { error } = await supabase.from('locks').upsert({
          id: lockId,
          owner_id: userId,
          zone: body.zone?.id || body.zone || 'Standard',
          skin: body.skin?.id || body.skin || 'Gold',
          content_text: body.contentText || 'Love Lock',
          status: 'Pending', // <--- CRITIQUE
          price: finalPrice,
          is_private: body.isPrivate || false,
          golden_asset_price: null,
          pending_until: new Date(Date.now() + 1000 * 60 * 60).toISOString()
      });

      if (error) {
        console.error("Erreur Reservation:", error);
        return NextResponse.json({ error: "Impossible de réserver l'emplacement." }, { status: 500 });
      }
    }
    
    // Pour 'boost' et 'marketplace', on ne touche PAS à la DB.
    // C'est le Webhook qui le fera APRES paiement.

    // --- SESSION STRIPE ---
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: type === 'boost' ? `Boost Visibility (${body.packageName || 'Pack'})` : `Love Lock #${lockId}`,
            description: type === 'marketplace' ? 'Asset Transfer' : (type === 'boost' ? 'Marketing Service' : 'Digital Asset'),
          },
          unit_amount: Math.round(finalPrice * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/dashboard?payment_success=true`,
      cancel_url: `${origin}/purchase?canceled=true`,
      customer_email: userEmail,
      metadata: {
        type: type,
        lock_id: lockId.toString(),
        user_id: userId,
        boost_package: body.package || body.packageName || '',
      }
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Erreur API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
