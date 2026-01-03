import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const fakeProfiles = [
  { initials: 'M.L.' },
  { initials: 'J.D.' },
  { initials: 'S.B.' },
  { initials: 'A.M.' },
  { initials: 'C.R.' },
  { initials: 'E.T.' },
  { initials: 'L.P.' },
  { initials: 'N.K.' },
  { initials: 'R.W.' },
  { initials: 'T.G.' },
  { initials: 'V.H.' },
  { initials: 'D.F.' },
  { initials: 'K.S.' },
  { initials: 'P.M.' },
  { initials: 'O.C.' },
  { initials: 'B.N.' },
  { initials: 'H.L.' },
  { initials: 'Y.Z.' },
  { initials: 'I.X.' },
  { initials: 'Q.V.' },
];

const zones = ['Standard', 'Premium', 'Vue Tour Eiffel'];
const skins = ['Gold', 'Silver', 'Rose_Gold', 'Bronze', 'Black'];

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const randomProfile = fakeProfiles[Math.floor(Math.random() * fakeProfiles.length)];
    const randomZone = zones[Math.floor(Math.random() * zones.length)];
    const randomSkin = skins[Math.floor(Math.random() * skins.length)];
    const randomIp = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    const { data, error } = await supabase
      .from('purchase_notifications')
      .insert({
        initials: randomProfile.initials,
        zone: randomZone,
        skin: randomSkin,
        buyer_ip: randomIp,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, notification: data }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error generating fake notification:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
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
