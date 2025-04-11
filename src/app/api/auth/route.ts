import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/app/lib/db';
import bcrypt from 'bcryptjs';  // Para verificar contraseñas cifradas
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de seguridad - usa un paquete como 'bcrypt' para gestionar contraseñas
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const jwtSecret = process.env.JWT_SECRET

  try {
    const [rows]: any = await getUser(email);
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    if (!jwtSecret) {
      throw new Error("JWT_SECRET no está definido en las variables de entorno");
    }

    // Generar un JWT para la cookie de sesión
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '24h' });

    const response = NextResponse.json({ message: 'Inicio de sesión exitoso' });
    response.cookies.set('session', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      path: '/', 
      maxAge: 3600,
    });

    return response;
  } catch (error) {
    console.error('Error al autenticar:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}