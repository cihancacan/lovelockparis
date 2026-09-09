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
const VALID_LOCALES = new Set(['en', 'fr', 'zh-CN', 'ja', 'ko', 'es', 'pt', 'ar']);
const BOOST_PRICES: Record<string, number> = { basic: 14.99, premium: 29.99, vip: 59.99 };

function generateLockId() {
  return Math.floor(100000 + Math.random() * 900000);
}

async function getAvailableRandomLockId(supabase: ReturnType<typeof createClient>) {
  for (let attempt = 0; attempt < 40; attempt++) {
    const candidate = generateLockId();
    const { data, error } = await supabase.from('locks').select('id').eq('id', candidate).maybeSingle();
    if (error) throw error;
    if (!data) return candidate;
  }
  throw new Error('Unable to allocate a lock number. Please retry.');
}

function computeNewLockPrice(body: any) {
  const zone = (body.zone?.id || body.zone) as Zone;
  const skin = (body.skin?.id || body.skin) as Skin;
  const mediaType = (body.mediaType || 'none') as MediaType;
  const customNumber = Boolean(body.customNumber);

  if (!VALID_ZONES.has(zone)) throw new Error('Invalid zone');
  if (!VALID_SKINS.has(skin)) throw new Error('Invalid skin');
  if (!VALID_MEDIA.has(mediaType)) throw new Error('Invalid media type');

  const total =
    ZONE_PRICES[zone] +
    SKIN_PRICES[skin] +
    MEDIA_PRICES[mediaType] +
    (customNumber ? CUSTOM_NUMBER_PRICE : 0);

  return {
    finalPrice: Number(total.toFixed(2)),
    zone,
    skin,
    mediaType,
  };
}

function localePrefix(locale: string) {
  return locale === 'en' ? '' : `/${locale}`;
}

export async function POST(req: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
  let body: any = null;
  let lockId: number | null = null;
  let computedAmount: number | null = null;

  try {
    body = await req.json();

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://lovelockparis.com';
    const userId = body.userId || null;
    const userEmail = body.userEmail || null;
    const visitorId = body.visitorId ? String(body.visitorId).slice(0, 128) : null;
    const type = body.type || 'new_lock';
    const locale = VALID_LOCALES.has(body.locale) ? body.locale : 'en';
    const prefix = localePrefix(locale);

    let finalPrice = 0;
    let zone: Zone | string = body.zone?.id || body.zone || 'Standard';
    let skin: Skin | string = body.skin?.id || body.skin || 'Iron';
    let mediaType: MediaType = body.mediaType || body.media_type || 'none';

    if (type === 'new_lock') {
      const computed = computeNewLockPrice(body);
      finalPrice = computed.finalPrice;
      computedAmount = finalPrice;
      zone = computed.zone;
      skin = computed.skin;
      mediaType = computed.mediaType;

      if (body.customNumber) {
        const requested = Number(body.selectedNumber);
        if (!Number.isInteger(requested) || requested < 1 || requested > 1000000) {
          throw new Error('Please choose a valid special number');
        }

        const { data: existing, error: availabilityError } = await supabase
          .from('locks')
          .select('id')
          .eq('id', requested)
          .maybeSingle();

        if (availabilityError) throw availabilityError;
        if (existing) throw new Error('This special number is no longer available');
        lockId = requested;
      } else {
        lockId = await getAvailableRandomLockId(supabase);
      }
    } else {
      lockId = Number(body.lockId || body.selectedNumber || 0) || null;
      if (!lockId) throw new Error('Missing lock number');

      if (type === 'media_unlock') {
        if (!userId) throw new Error('Login required');
        finalPrice = 4.99;
      } else if (type === 'media_upgrade') {
        if (!userId) throw new Error('Login required');
        mediaType = (body.media_type || body.mediaType || '') as MediaType;
        if (!['photo', 'video', 'audio'].includes(mediaType)) throw new Error('Invalid media upgrade');
        finalPrice = MEDIA_PRICES[mediaType];

        const { data: ownedLock, error } = await supabase
          .from('locks')
          .select('id, owner_id, status')
          .eq('id', lockId)
          .maybeSingle();
        if (error) throw error;
        if (!ownedLock || ownedLock.owner_id !== userId || ownedLock.status !== 'Active') {
          throw new Error('Lock not available for this upgrade');
        }
      } else if (type === 'boost') {
        if (!userId) throw new Error('Login required');
        const pkg = String(body.package || body.packageName || '');
        finalPrice = BOOST_PRICES[pkg];
        if (!finalPrice) throw new Error('Invalid boost package');

        const { data: ownedLock, error } = await supabase
          .from('locks')
          .select('id, owner_id, status')
          .eq('id', lockId)
          .maybeSingle();
        if (error) throw error;
        if (!ownedLock || ownedLock.owner_id !== userId || ownedLock.status !== 'Active') {
          throw new Error('Lock not available for boost');
        }
      } else if (type === 'marketplace') {
        if (!userId) throw new Error('Login required');
        const { data: marketLock, error } = await supabase
          .from('locks')
          .select('id, owner_id, status, golden_asset_price, resale_price')
          .eq('id', lockId)
          .maybeSingle();
        if (error) throw error;
        if (!marketLock) throw new Error('Marketplace lock not found');
        if (marketLock.owner_id === userId) throw new Error('You already own this lock');

        const listedPrice = marketLock.status === 'Reserved_Admin'
          ? Number(marketLock.golden_asset_price || 0)
          : Number(marketLock.resale_price || 0);

        if (!Number.isFinite(listedPrice) || listedPrice <= 0) {
          throw new Error('This lock is no longer listed for sale');
        }
        finalPrice = listedPrice;
      } else {
        throw new Error('Unsupported checkout type');
      }

      if (!Number.isFinite(finalPrice) || finalPrice <= 0) throw new Error('Invalid price');
      computedAmount = finalPrice;
    }

    const authorName = String(body.authorName || '').trim().slice(0, 50);
    const contentText = String(body.contentText || 'Forever in Paris').trim().slice(0, 160) || 'Forever in Paris';

    if (type === 'new_lock' && !authorName) {
      throw new Error('Names are required');
    }

    await supabase.from('checkout_events').insert({
      event_type: 'checkout_started',
      lock_id: lockId,
      user_id: userId,
      user_email: userEmail,
      amount: finalPrice,
      metadata: { type, zone, skin, mediaType, locale, origin, visitor_id: visitorId },
    });

    if (type === 'new_lock') {
      const { error: insertError } = await supabase.from('locks').insert({
        id: lockId,
        owner_id: userId,
        author_name: authorName,
        zone,
        skin,
        content_text: contentText,
        status: 'Pending',
        price: finalPrice,
        is_private: true,
        golden_asset_price: null,
        media_type: mediaType !== 'none' ? mediaType : null,
        pending_until: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      });

      if (insertError) throw insertError;
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: type === 'media_upgrade'
              ? 'LoveLockParis · Add a digital memory'
              : type === 'boost'
                ? 'LoveLockParis · Visibility boost'
                : type === 'marketplace'
                  ? `LoveLockParis · Lock #${lockId}`
                  : `LoveLockParis · Personalized Love Lock #${lockId}`,
            description: type === 'new_lock'
              ? `${authorName} · Digital love lock for Paris`
              : 'LoveLockParis digital service',
          },
          unit_amount: Math.round(finalPrice * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      locale: 'auto',
      success_url: type === 'new_lock'
        ? `${origin}${prefix}/purchase/success?payment_success=true&lock_id=${lockId}`
        : `${origin}${prefix}/dashboard?payment_success=true&type=${encodeURIComponent(type)}&lock_id=${lockId}`,
      cancel_url: type === 'new_lock'
        ? `${origin}${prefix}/purchase?canceled=true`
        : `${origin}${prefix}/dashboard?payment_canceled=true`,
      metadata: {
        type,
        lock_id: lockId.toString(),
        user_id: userId || '',
        user_email: userEmail || '',
        boost_package: body.package || body.packageName || '',
        media_type: mediaType || '',
        locale,
        visitor_id: visitorId || '',
      },
    };

    // Omitting payment_method_types lets Stripe Checkout show the eligible
    // payment methods enabled for this account/device (cards and wallets when available).
    if (userEmail) sessionParams.customer_email = userEmail;

    const session = await stripe.checkout.sessions.create(sessionParams);

    await supabase.from('checkout_events').insert({
      event_type: 'stripe_session_created',
      lock_id: lockId,
      session_id: session.id,
      user_id: userId,
      user_email: userEmail,
      amount: finalPrice,
      metadata: { type, locale, livemode: session.livemode, visitor_id: visitorId },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id, livemode: session.livemode });
  } catch (error: any) {
    const message = error?.message || 'Checkout failed';

    try {
      await supabase.from('checkout_events').insert({
        event_type: 'checkout_failed',
        lock_id: lockId,
        user_id: body?.userId || null,
        user_email: body?.userEmail || null,
        amount: computedAmount,
        error_message: message,
        metadata: { type: body?.type || 'new_lock', locale: body?.locale || 'en' },
      });
    } catch {}

    if (lockId && body?.type !== 'marketplace') {
      try {
        await supabase.from('locks').delete().eq('id', lockId).eq('status', 'Pending');
      } catch {}
    }

    console.error('Checkout failed', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
