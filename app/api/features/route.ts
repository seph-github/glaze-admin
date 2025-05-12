import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('features')
      .select('id, name, feature_key, type')
      .eq('is_active', true)
      .in('type', ['purchase', 'subscription']);

    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Unexpected error:', err);
      return NextResponse.json(
        { error: 'Unexpected error occurred', details: err.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown server error' },
      { status: 500 }
    );
  }
}
