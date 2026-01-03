import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Connexion à Supabase (Admin)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lockId = searchParams.get('lockId');

  if (!lockId) {
    return NextResponse.json({ error: 'Lock ID required' }, { status: 400 });
  }

  try {
    // On regarde si le numéro existe dans la table 'locks'
    const { data, error } = await supabase
      .from('locks')
      .select('id, status, golden_asset_price')
      .eq('id', lockId)
      .maybeSingle();

    if (error) throw error;

    // SCÉNARIO 1 : Le numéro n'existe pas -> IL EST LIBRE
    if (!data) {
      return NextResponse.json({ 
        available: true, 
        status: 'free',
        price: null 
      });
    }

    // SCÉNARIO 2 : Le numéro existe + Prix de revente défini -> A VENDRE (GOLDEN ASSET)
    if (data.golden_asset_price && data.golden_asset_price > 0) {
      return NextResponse.json({ 
        available: true, // On dit "True" pour permettre l'achat
        status: 'resale', 
        price: data.golden_asset_price 
      });
    }

    // SCÉNARIO 3 : Le numéro existe + Pas de prix -> INDISPONIBLE
    return NextResponse.json({ 
      available: false, 
      status: 'taken',
      price: null 
    });

  } catch (error: any) {
    console.error('Check Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}