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

    const origin =
      req.headers.get('origin') ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'https://lovelockparis.com';

    const userId = body.userId || null;
    const userEmail = (body.userEmail || '').trim();

    if (!userEmail) {
      return NextResponse.json({ error: 'Missing userEmail' }, { status: 400 });
    }

    const type = body.type || 'new_lock';

    // ✅ Supabase Admin (service role)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // ✅ IMPORTANT : si invité (userId null) -> on récupère/crée un user Supabase par email
    let finalUserId: string | null = userId;

    if (!finalUserId) {
      const { data: existingUserData, error: getErr } =
        await supabase.auth.admin.getUserByEmail(userEmail);

      if (getErr) {
        console.log('getUserByEmail error:', getErr.message);
      }

      if (existingUserData?.user?.id) {
        finalUserId = existingUserData.user.id;
      } else {
        const { data: created, error: createErr } =
          await supabase.auth.admin.createUser({
            email: userEmail,
            email_confirm: true,
          });

        if (createErr) {
          return NextResponse.json({ error: createErr.message }, { status: 500 });
        }

        finalUserId = created.user?.id || null;
      }
    }

    if (!finalUserId) {
      return NextResponse.json({ error: 'Unable to create/find user' }, { status: 500 });
    }

    // ✅ FIX: lockId doit exister (sinon upsert plante)
    // 1) on tente de le lire depuis body
    let lockIdRaw = body.selectedNumber ?? body.lockId;
    let lockId: number | null = null;

    if (typeof lockIdRaw === 'number') lockId = lockIdRaw;
    if (typeof lockIdRaw === 'string' && lockIdRaw.trim() !== '') lockId = parseInt(lockIdRaw, 10);

    // 2) si absent, on génère un id (max+1)
    if (!lockId || Number.isNaN(lockId)) {
      const { data: maxRow, error: maxErr } = await supabase
        .from('locks')
        .select('id')
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (maxErr) {
        return NextResponse.json({ error: `Cannot generate lockId: ${maxErr.message}` }, { status: 500 });
      }

      const maxId = maxRow?.id ? Number(maxRow.id) : 0;
      lockId = maxId + 1;
    }

    // CALCUL DU PRIX (GESTION MEDIA UPGRADE)
    let finalPrice = 29.99;

    if (type === 'new_lock') finalPrice = Number(body.totalPrice) || 29.99;
    else if (type === 'boost') finalPrice = Number(body.price);
    else if (type === 'marketplace') finalPrice = Number(body.price);
    else if (type === 'media_upgrade') finalPrice = Number(body.price) || 9.99;
    else if (type === 'media_unlock') finalPrice = 4.99;

    // CAS 1 : NOUVEAU CADENAS
    if (type === 'new_lock') {
      const { error: upsertErr } = await supabase.from('locks').upsert({
        id: lockId,
        owner_id: finalUserId,
        zone: body.zone?.id || body.zone || 'Standard',
        skin: body.skin?.id || body.skin || 'Gold',
        content_text: body.contentText || 'Love Lock',
        status: 'Pending',
        price: finalPrice,
        is_private: body.isPrivate || false,
        golden_asset_price: body.goldenAssetPrice ?? null,
        media_type: body.mediaType && body.mediaType !== 'none' ? body.mediaType : null,
        pending_until: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      });

      if (upsertErr) {
        return NextResponse.json({ error: `DB error: ${upsertErr.message}` }, { status: 500 });
      }
    }

    // Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name:
                type === 'media_upgrade'
                  ? `Add Media Feature`
                  : type === 'boost'
                  ? `Boost Visibility`
                  : `Love Lock #${lockId}`,
              description:
                type === 'media_upgrade'
                  ? `Activation for Lock #${lockId}`
                  : 'Digital Service',
            },
            unit_amount: Math.round(finalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/dashboard?payment_success=true`,
      cancel_url: `${origin}/purchase?canceled=true`,
      customer_email: userEmail,
      metadata: {
        type: type,
        lock_id: String(lockId),
        user_id: finalUserId,
        boost_package: body.package || '',
        media_type: body.media_type || body.mediaType || '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
