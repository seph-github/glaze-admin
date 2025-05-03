import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const supabase = await createClient();
  const { error } = await supabase.from('shop_products').insert([
    {
      name: body.name,
      description: body.description,
      type: body.type,
      price_cents: body.price_cents,
      discount_price_cents: body.discount_price_cents,
      quantity: body.quantity,
      is_featured: body.is_featured || false,
      donut_ids: body.donut_ids || [],
      start_at: body.start_at,
      end_at: body.end_at,
      color: body.color,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
