import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const env = process.env;

const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    if (!body.name || !body.price_cents) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const stripeProduct = await stripe.products.create({
      name: body.name,
      description: body.description,
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: body.price_cents,
      currency: 'usd',
    });

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
        stripe_product_id: stripeProduct.id,
        stripe_price_id: stripePrice.id,
        synced: true,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Stripe error:', err);
      return NextResponse.json(
        { error: 'Stripe error', details: err.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unexpected error occurred' },
      { status: 500 }
    );
  }
}
