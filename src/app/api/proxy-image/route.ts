import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    if (!path) {
      return new Response("Missing path", { status: 400 });
    }

    const base = process.env.NEXT_PUBLIC_ASSET_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
    if (!base) {
      return new Response("Base URL not configured", { status: 500 });
    }

    const target = `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

    const upstream = await fetch(target, {
      // Forward method and headers if needed
      headers: {
        Accept: "image/*",
      },
      // Revalidate frequently for images
      cache: "no-store",
    });

    if (!upstream.ok || !upstream.body) {
      return new Response("Failed to fetch image", { status: upstream.status || 502 });
    }

    // Pass through content-type if present
    const contentType = upstream.headers.get("content-type") || "image/*";
    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Optional: small cache on edge/browser
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err) {
    return new Response("Proxy error", { status: 500 });
  }
}


