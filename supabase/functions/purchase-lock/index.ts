import { createClient } from 'npm:@supabase/supabase-js@2.58.0';

const GOLDEN_ASSET_IDS = [
  0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 21, 22, 23, 24, 25, 27, 28, 29, 33, 34, 39, 42, 45, 49, 50,
  51, 52, 55, 56, 63, 66, 67, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
  91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 111, 123, 131, 144, 168, 188, 198, 200, 222, 234, 246, 300, 333, 345,
  360, 365, 404, 444, 456, 500, 520, 555, 600, 666, 700, 777, 800, 888, 900, 999, 1000, 1010, 1024, 1080, 1111, 1234,
  1313, 1314, 1337, 1500, 1665, 1889, 1984, 2000, 2020, 2024, 2222, 2345, 2468, 3000, 3333, 3456, 3600, 3650, 4040,
  4444, 4567, 5000, 5050, 5200, 5555, 6000, 6666, 7000, 7070, 7777, 8000, 8080, 8888, 9000, 9090, 9999, 10000, 10101,
  10800, 11111, 12345, 13131, 13337, 15000, 18889, 20000, 20202, 22222, 23456, 24680, 30000, 33333, 34567, 36000,
  36500, 40404, 44444, 45678, 50000, 50505, 52013, 55555, 60000, 66666, 70000, 70707, 77777, 80000, 80808, 88888,
  90000, 90909, 99999, 100000, 101010, 108000, 111111, 123456, 131313, 133337, 150000, 188889, 200000, 202020, 222222,
  234567, 246801, 300000, 333333, 345678, 360000, 365000, 404040, 444444, 456789, 500000, 505050, 520131, 555555,
  600000, 666666, 700000, 707070, 777777, 800000, 808080, 888888, 900000, 909090, 999999, 1000000
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function getRandomAvailableLockId(existingIds: Set<number>): number | null {
  const MAX_ATTEMPTS = 100;
  const reservedSet = new Set(GOLDEN_ASSET_IDS);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const randomId = Math.floor(Math.random() * 1000000) + 1;

    if (!existingIds.has(randomId) && !reservedSet.has(randomId)) {
      return randomId;
    }
  }

  for (let id = 1; id <= 1000000; id++) {
    if (!existingIds.has(id) && !reservedSet.has(id)) {
      return id;
    }
  }

  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    const userToken = authHeader.replace('Bearer ', '');

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(userToken);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const body = await req.json();
    const { zone, skin, contentText, authorName, mediaUrl, mediaType, customNumber, selectedNumber, totalPrice } = body;

    if (!zone || !skin || !contentText || !authorName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const clientIp = req.headers.get('x-forwarded-for') ||
                     req.headers.get('x-real-ip') ||
                     'unknown';

    let lockId: number | null = null;

    if (customNumber && selectedNumber) {
      if (GOLDEN_ASSET_IDS.includes(selectedNumber)) {
        return new Response(
          JSON.stringify({ error: 'This lock ID is reserved and cannot be purchased' }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      const { data: existingLock } = await supabaseClient
        .from('locks')
        .select('id')
        .eq('id', selectedNumber)
        .maybeSingle();

      if (existingLock) {
        return new Response(
          JSON.stringify({ error: 'This lock number is already taken' }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      lockId = selectedNumber;
    } else {
      const { data: existingLocks } = await supabaseClient
        .from('locks')
        .select('id');

      const existingIds = new Set((existingLocks || []).map((lock: any) => lock.id));
      lockId = getRandomAvailableLockId(existingIds);

      if (!lockId) {
        return new Response(
          JSON.stringify({ error: 'No available lock IDs' }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }

    const { data: newLock, error: lockError } = await supabaseClient
      .from('locks')
      .insert({
        id: lockId,
        owner_id: user.id,
        zone,
        skin,
        content_text: contentText,
        content_media_url: mediaType !== 'none' ? mediaUrl : null,
        status: 'Active',
        price: totalPrice,
      })
      .select()
      .single();

    if (lockError) throw lockError;

    const { error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        lock_id: newLock.id,
        buyer_id: user.id,
        transaction_type: 'purchase',
        amount: totalPrice,
        platform_commission: 0,
      });

    if (transactionError) throw transactionError;

    await supabaseClient
      .from('purchase_notifications')
      .insert({
        lock_id: newLock.id,
        initials: authorName,
        zone,
        skin,
        buyer_ip: clientIp,
      });

    return new Response(
      JSON.stringify({ success: true, lock: newLock }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error processing purchase:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});