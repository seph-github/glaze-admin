// app/.well-known/apple-app-site-association/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    'public',
    '.well-known',
    'apple-app-site-association'
  );
  const fileContents = fs.readFileSync(filePath, 'utf8');

  return new NextResponse(fileContents, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
