import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('session');

  if (!cookie || !cookie.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const token = cookie.value;
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) throw new Error("JWT_SECRET no está definido");

    jwt.verify(token, jwtSecret);
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Token no válido:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}