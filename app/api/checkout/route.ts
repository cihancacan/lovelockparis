import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import {
  ZONE_PRICES,
  SKIN_PRICES,
  MEDIA_PRICES,
  CUSTOM_NUMBER_PRICE,
  type Zone,
  type Skin,
  type MediaType,
} from '@/lib/pricing';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const VALID_ZONES = new Set<Zone>(['Standard', 'Premium_Eiffel', 'Sky_Balloon']);
const VALID_SKINS = new Set<Skin>(['Iron', 'Gold', 'Diamond', 'Ruby']);
const VALID_MEDIA = new Set<MediaType>(['none', 'photo', 'video', 'audio']);

function generateLockId() {
  return Math.floor(100000 + Math.random() * 900000);
}

async function getAvailableRandomLockId(supabase: ReturnType<typeof createClient>) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const candidate = generateLockId();
    const { data, error } = await supabase.from('locks').select('id').eq('id', candidate).maybeSingle();
    if (error) throw error;
    if (!data) return candidate;
  }
  throw new Error('Unable to allocate a lock number. Please retry.');
}

function computeNewLockPrice(body: any) {
  const zone = body.zone?.id || body.zone;
  const skin = body.skin?.id || body.skin;
  const mediaType = (body.mediaType || 'none') as MediaType;
  const customNumber = Boolean(body.customNumber);
  const goldenAssetPrice = Number(body.goldenAssetPrice || 0);

  if (!VALID_ZONES.has(zone)) throw new Error('Invalid zone');
  if (!VALID_SKINS.has(skin)) throw new Error('Invalid skin');
  if (!VALID_MEDIA.has(mediaType)) throw new Error('Invalid media type');
  if (!Number.isFinite(goldenAssetPrice) || goldenAssetPrice < 0) throw new Error('Invalid asset price');

  const total = ZONE_PRICES[zone as Zone]
    + SKIN_PRICES[skin as Skin]
    + MEDIA_PRICES[mediaType]
    + (customNumber ? CUSTOM_NUMBER_PRICE : 0)
    + goldenAssetPrice;

  return {
    finalPrice: Number(total.toFixed(2)),
    zone: zone as Zone,
    skin: skin as Skin,
    mediaType,
  };
}

export async function POST(req: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  let body: any = null;
  let lockId: number | null = null;

  try {
    body = await req.json();
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://lovelockparis.com';
    const userId = body.userId || null;
    const userEmail = body.userEmail || null;
    const type = body.type || 'new_lock';

    let finalPrice = 0;
    let zone: Zone | string = body.zone?.id || body.zone || 'Standard';
    let skin: Skin | string = body.skin?.id || body.skin || 'Gold';
    let mediaType: MediaType = body.mediaType || body.media_type || 'none';

    if (type === 'new_lock') {
      const computed = computeNewLockPrice(body);
      finalPrice = computed.finalPrice;
      zone = computed.zone;
      skin = computed.skin;
      mediaType = computed.mediaType;

      if (body.selectedNumber) {
        const requested = Number(body.selectedNumber);
        if (!Number.isInteger(requested) || requested < 1 || requested > 1000000) {
          throw new Error('Invalid lock number');
        }
        const { data: existing, error: availabilityError } = await supabase
          .from('locks')
          .select('id, golden_asset_price')
          .eq('id', requested)
          .maybeSingle();
        if (availabilityError) throw availabilityError;

        if (existing && !(existing.golden_asset_price && Number(existing.golden_asset_price) > 0)) {
          throw new Error('This lock number is no longer available');
        }
        lockId = requested;
      } else {
        lockId = await getAvailableRandomLockId(supabase);
      }
    } else {
      lockId = Number(body.lockId || body.selectedNumber || 0) || null;
      if (!lockId) throw new Error('Missing lock number');

      if (type === 'media_unlock') finalPrice = 4.99;
      else if (type === 'media_upgrade') finalPrice = Number(body.price) || 9.99;
      else if (type === 'boost' || type === 'marketplace') finalPrice = Number(body.price);
      else throw new Error('Unsupported checkout type');

      if (!Number.isFinite(finalPrice) || finalPrice <= 0) throw new Error('Invalid price');
    }

    await supabase.from('checkout_events').insert({
      event_type: 'checkout_started',
      lock_id: lockId,
      user_id: userId,
      user_email: userEmail,
      amount: finalPrice,
      metadata: { type, zone, skin, mediaType, origin },
    });

    if (type === 'new_lock') {
      if (body.goldenAssetPrice && Number(body.goldenAssetPrice) > 0) {
        const { data: resaleLock, error: resaleError } = await supabase
          .from('locks')
          .select('id, golden_asset_price')
          .eq('id', lockId)
          .maybeSingle();
        if (resaleError) throw resaleError;
        if (!resaleLock || Number(resaleLock.golden_asset_price || 0) !== Number(body.goldenAssetPrice)) {
          throw new Error('This premium number is no longer available at that price');
        }
      } else {
        const { error: insertError } = await supabase.from('locks').insert({
          id: lockId,
          owner_id: userId,
          zone,
          skin,
          content_text: body.contentText || 'Love Lock',
          status: 'Pending',
          price: finalPrice,
          is_private: Boolean(body.isPrivate),
          golden_asset_price: null,
          media_type: mediaType !== 'none' ? mediaType : null,
          pending_until: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
        });
        if (insertError) throw insertError;
      }
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: type === 'media_upgrade' ? 'Add Media Feature' : (type === 'boost' ? 'Boost Visibility' : `Love Lock #${lockId}`),
            description: type === 'media_upgrade' ? `Activation for Lock #${lockId}` : 'Digital Service',
          },
          unit_amount: Math.round(finalPrice * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/purchase/success?payment_success=true&lock_id=${lockId}`,
      cancel_url: `${origin}/purchase?canceled=true`,
      metadata: {
        type,
        lock_id: lockId.toString(),
        user_id: userId || '',
        user_email: userEmail || '',
        boost_package: body.package || '',
        media_type: mediaType || '',
      }
    };

    if (userEmail) sessionParams.customer_email = userEmail;

    const session = await stripe.checkout.sessions.create(sessionParams);

    await supabase.from('checkout_events').insert({
      event_type: 'stripe_session_created',
      lock_id: lockId,
      session_id: session.id,
      user_id: userId,
      user_email: userEmail,
      amount: finalPrice,
      metadata: { type },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    const message = error?.message || 'Checkout failed';

    try {
      await supabase.from('checkout_events').insert({
        event_type: 'checkout_failed',
        lock_id: lockId,
        user_id: body?.userId || null,
        user_email: body?.userEmail || null,
        amount: body?.totalPrice ? Number(body.totalPrice) : null,
        error_message: message,
        metadata: { type: body?.type || 'new_lock' },
      });
    } catch {}

    if (lockId && body?.type !== 'marketplace' && !(body?.goldenAssetPrice && Number(body.goldenAssetPrice) > 0)) {
      try {
        await supabase.from('locks').delete().eq('id', lockId).eq('status', 'Pending');
      } catch {}
    }

    console.error('Checkout failed', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
