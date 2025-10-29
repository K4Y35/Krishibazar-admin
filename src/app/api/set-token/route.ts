// app/api/set-token/route.js
import { NextResponse } from 'next/server';

export async function POST(req: any) {
  const { token } = await req.json();
  console.log(req, 'set-token');
  if (!token) {
    return new NextResponse('Missing token', { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  response.headers.set(
    'Set-Cookie',
    `token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`
  );

  return response;
}
