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

// Utilisation de 'Request' standard pour éviter le bug de Next.js
export async function POST(req: Request) {
  console.log("⚡ API CHECKOUT (Mode Robust)");

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Clé Stripe manquante" }, { status: 500 });
    }

    const body = await req.json();
    
    // URL en dur pour éviter les erreurs serveur
    const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Récupération manuelle des infos utilisateur envoyées par le front
    const userId = body.userId || 'guest_user';
    const userEmail = body.userEmail || 'guest@lovelock.com';

    // Calcul du prix
    let finalPrice = Number(body.totalPrice);
    if (!finalPrice || finalPrice <= 0) finalPrice = 29.99;

    const lockId = body.selectedNumber || Math.floor(Math.random() * 900000) + 100000;
    const zoneValue = body.zone?.id || body.zone || 'Standard';
    const skinValue = body.skin?.id || body.skin || 'Gold';

    // Sauvegarde BDD "Silencieuse" (Ne bloque pas le paiement si erreur)
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
          auth: { persistSession: false } // CRUCIAL : Désactive la session
        });
        
        await supabase.from('locks').upsert({
            id: lockId,
            owner_id: userId !== 'guest_user' ? userId : null,
            zone: zoneValue,
            skin: skinValue,
            content_text: body.contentText || 'Love Lock',
            status: 'Pending',
            price: finalPrice,
            is_private: body.isPrivate || false,
            golden_asset_price: null,
            pending_until: new Date(Date.now() + 1000 * 60 * 60).toISOString()
        });
    } catch (dbError) {
        console.error("⚠️ BDD Ignorée:", dbError);
    }

    // Création Session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Love Lock Paris #${lockId}`,
              description: `${zoneValue} • ${skinValue}`,
            },
            unit_amount: Math.round(finalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/dashboard?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/purchase?canceled=true`,
      customer_email: userEmail !== 'guest@lovelock.com' ? userEmail : undefined,
      metadata: {
        lock_id: lockId.toString(),
        user_id: userId
      }
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("❌ ERREUR API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}