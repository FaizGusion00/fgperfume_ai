import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // Check cookie
    const cookieHeader = (req.headers.get('cookie') || '');
    const isAuth = cookieHeader.split(';').some(c => c.trim().startsWith('fg_admin='));
    return NextResponse.json({ authenticated: !!isAuth });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
