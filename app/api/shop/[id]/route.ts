import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types/interfaces/Product';
import { PostgrestError } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const env = process.env;

const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { productBody, features, shouldUpdateStripe } = body;

  const id = req.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: productData, error } = (await supabase
    .from('shop_products')
    .update(productBody)
    .eq('id', id)
    .select()
    .single()) as { data: Product | null; error: PostgrestError | null };

  if (error || !productData) {
    return NextResponse.json(
      { error: error?.message ?? 'Failed to update product' },
      { status: 500 }
    );
  }

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
    // Clear existing
    await supabase
      .from('shop_product_features')
      .delete()
      .eq('shop_product_id', productData.id);

    // Re-insert new ones
    const inserts = matchedFeatures.map((f) => ({
      shop_product_id: productData.id,
      feature_id: f.id,
    }));
    await supabase.from('shop_product_features').insert(inserts);
  }

  if (shouldUpdateStripe && productData?.stripe_product_id) {
    await stripe.products.update(productData?.stripe_product_id as string, {
      name: productBody.name,
      description: productBody.description,
    });

    const response = await stripe.prices.update(
      productData.stripe_price_id as string,
      {
        active: false,
      }
    );

    console.log('stripe response ', response);

    const newPrice = await stripe.prices.create({
      product: productData?.stripe_product_id as string,
      unit_amount: productBody.price_cents,
      currency: 'usd',
    });

    await supabase
      .from('shop_products')
      .update({ stripe_price_id: newPrice.id })
      .eq('id', productData?.id);
  }

  if (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from('shop_products').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
