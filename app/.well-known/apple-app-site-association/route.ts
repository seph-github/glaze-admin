export const runtime = 'edge'; // Crucial for Vercel

export async function GET() {
  return new Response(
    JSON.stringify({
      applinks: {
        apps: [],
        details: [
          {
            appID: 'TEAMID.com.your.app',
            paths: ['*'],
          },
        ],
      },
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400',
      },
    }
  );
}
