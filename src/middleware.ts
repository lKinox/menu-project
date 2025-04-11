import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest, ev: NextFetchEvent) {
  console.log('Middleware ejecutado'); // Esto debe imprimirse en la consola del servidor
  const cookie = request.cookies.get('session');

  // Verifica si el token existe
  if (!cookie || !cookie.value) {
    // Si no hay token, redirige al usuario a la página de login
    console.log('No hay cookie, redirigiendo a login'); // Agrega este log
    return NextResponse.redirect(new URL('/login', request.url));
  }

  /*const token = cookie.value;

  try {
    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET; // Cambiado a NEXT_PUBLIC_
    if (!jwtSecret) throw new Error("JWT_SECRET no está definido");

    jwt.verify(token, jwtSecret);
    
  } catch (error) {
    console.error('Token no válido:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }*/

  // Si todo está bien, permite el acceso a la ruta
  return NextResponse.next();
}

// Proteger rutas específicas
export const config = {
  matcher: ['/dashboard/:path*'], // Esta ruta será protegida
};