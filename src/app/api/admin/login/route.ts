import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = body?.password;
    if (password === 'fgperfumeuniversalempire00@') {
      const res = NextResponse.json({ success: true });
      // set HttpOnly cookie for admin session (valid for 8 hours)
      res.cookies.set('fg_admin', '1', { httpOnly: true, path: '/', maxAge: 60 * 60 * 8 });
      return res;
    }
    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: String(err?.message || err) }, { status: 500 });
  }
}
