import { NextResponse } from 'next/server';

export async function GET() {
  // Eliminar la cookie de sesión
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('session', '', {
    httpOnly: true,
    maxAge: -1, // Esto eliminará la cookie
    path: '/',  // Asegúrate de que coincida con el path donde la estableciste
  });

  return response;
}