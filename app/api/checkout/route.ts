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
    const userId = body.userId;
    const userEmail = body.userEmail;
    
    const type = body.type || 'new_lock'; 
    const lockId = body.selectedNumber || body.lockId;
    
    // CALCUL DU PRIX (GESTION MEDIA UPGRADE)
    let finalPrice = 29.99;
    
    if (type === 'new_lock') finalPrice = Number(body.totalPrice) || 29.99;
    else if (type === 'boost') finalPrice = Number(body.price);
    else if (type === 'marketplace') finalPrice = Number(body.price);
    else if (type === 'media_upgrade') {
        // Prix défini par le type de média demandé
        finalPrice = Number(body.price) || 9.99; 
    }
    else if (type === 'media_unlock') finalPrice = 4.99;

    // CAS 1 : NOUVEAU CADENAS
    if (type === 'new_lock') {
      const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
      await supabase.from('locks').upsert({
          id: lockId,
          owner_id: userId,
          zone: body.zone?.id || body.zone || 'Standard',
          skin: body.skin?.id || body.skin || 'Gold',
          content_text: body.contentText || 'Love Lock',
          status: 'Pending',
          price: finalPrice,
          is_private: body.isPrivate || false,
          golden_asset_price: null,
          media_type: body.mediaType !== 'none' ? body.mediaType : null, // Sauvegarde du type média dès l'achat
          pending_until: new Date(Date.now() + 1000 * 60 * 60).toISOString()
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: type === 'media_upgrade' ? `Add Media Feature` : (type === 'boost' ? `Boost Visibility` : `Love Lock #${lockId}`),
            description: type === 'media_upgrade' ? `Activation for Lock #${lockId}` : 'Digital Service',
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
        lock_id: lockId?.toString(),
        user_id: userId,
        boost_package: body.package || '',
        media_type: body.media_type || '', // Pour le webhook (savoir quel type activer)
      }
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
