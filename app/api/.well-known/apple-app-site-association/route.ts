// app/api/.well-known/apple-app-site-association/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const aasa = {
    applinks: {
      apps: [] as string[],
      details: [
        {
          appIDs: ["6YDV9VK972.com.glazemedia.glaze.development"],
          paths: ["/reset-password*", "/auth/*", "NOT /dashboard/*"],
        },
      ],
    },
    webcredentials: {
      apps: ["6YDV9VK972.com.glazemedia.glaze.development"],
    },
    appclips: {
      apps: [] as string[],
    },
  };

  return new NextResponse(JSON.stringify(aasa), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export const dynamic = "force-static";
