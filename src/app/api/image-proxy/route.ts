// app/api/image-proxy/route.js
import { NextResponse } from 'next/server';

export async function GET(req: any) {
  const { searchParams } = new URL(req.url);
  const image = searchParams.get('image');

  if (!image) {
    return new NextResponse('Image name is required', { status: 400 });
  }
  console.log(req.headers.get('cookie'), 'cookie');

  try {

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/image-proxy?image=${encodeURIComponent(image)}`, {
      method: 'GET',
      headers: {
        cookie: req.headers.get('cookie') || '', // Pass the cookie (JWT)
      },
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      return new NextResponse(errorText, { status: backendRes.status });
    }

    const contentType = backendRes.headers.get('content-type');
    const buffer = await backendRes.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type': contentType || 'image/jpeg',
      },
    });
  } catch (error) {
    return new NextResponse('Error fetching image', { status: 500 });
  }
}
