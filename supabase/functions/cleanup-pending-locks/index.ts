import { createClient } from 'npm:@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

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

    const now = new Date().toISOString();

    const { data: expiredLocks, error: fetchError } = await supabase
      .from('locks')
      .select('id')
      .eq('status', 'Pending')
      .lt('pending_until', now);

    if (fetchError) throw fetchError;

    if (!expiredLocks || expiredLocks.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No expired locks to clean up', count: 0 }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const lockIds = expiredLocks.map(lock => lock.id);

    const { error: deleteError } = await supabase
      .from('locks')
      .delete()
      .in('id', lockIds);

    if (deleteError) throw deleteError;

    return new Response(
      JSON.stringify({
        message: 'Expired locks cleaned up successfully',
        count: lockIds.length,
        lockIds,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error cleaning up pending locks:', error);
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