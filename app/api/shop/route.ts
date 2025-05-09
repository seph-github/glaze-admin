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

    const { productBody, features } = body;

    if (!productBody.name || !productBody.price_cents) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const stripeProduct = await stripe.products.create({
      name: productBody.name,
      description: productBody.description,
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount_decimal: productBody.price_cents,
      currency: 'usd',
    });

    const { data: productData, error } = await supabase
      .from('shop_products')
      .insert([
        {
          name: body.productBody.name,
          description: body.productBody.description,
          type: body.productBody.type,
          price_cents: body.productBody.price_cents,
          discount_price_cents: body.productBody.discount_price_cents,
          quantity: body.productBody.quantity,
          is_featured: body.productBody.is_featured || false,
          donut_ids: body.productBody.donut_ids || [],
          start_at: body.productBody.start_at,
          end_at: body.productBody.end_at,
          color: body.productBody.color,
          stripe_product_id: stripeProduct.id,
          stripe_price_id: stripePrice.id,
          synced: true,
        },
      ])
      .select()
      .single();

    let matchedFeatures: { id: string; feature_key: string }[] = [];

    if (Array.isArray(features) && features.length > 0) {
      const { data, error: featureError } = await supabase
        .from('features')
        .select('id, feature_key')
        .in('feature_key', features);

      if (featureError) {
        console.error('Failed to fetch features:', featureError.message);
      }

      matchedFeatures = data ?? [];
    }

    if (matchedFeatures?.length && productData != null) {
      const inserts = matchedFeatures.map((f) => ({
        shop_product_id: productData.id as string,
        feature_id: f.id,
      }));

      await supabase.from('shop_product_features').insert(inserts);
    }

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
