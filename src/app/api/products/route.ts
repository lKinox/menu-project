// pages/api/products/route.ts
import { NextResponse } from 'next/server';
import { insertProduct, getAllProducts } from '@/app/lib/db';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const price_discount = parseFloat(formData.get('price_discount') as string);
    const category_id = parseFloat(formData.get('category_id') as string);
    const file = formData.get('img') as File;
  
    try {
      const filename = `${name.replace(/\s+/g, '-')}-${Date.now()}.jpg`; // genera un nombre de archivo único

      // Usar el método put para subir la imagen al almacenamiento de blobs de Vercel
      const blob = await put(filename, file.stream(), {
        access: 'public',
        addRandomSuffix: true,
      });

      const img = blob.url

      // Primero, inserta el producto para obtener el ID
      const insertId = await insertProduct(name, description, price, price_discount, img, category_id);
  
      return NextResponse.json({ id: insertId }, { status: 201 });
    } catch (error) {
      console.error('Error al insertar el producto:', error);
      return NextResponse.json({ error: 'Error en la base de datos' }, { status: 500 });
    }
}
  
export async function GET() {
    try {
      const products = await getAllProducts();
      return NextResponse.json(products, { status: 200 });
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
    }
}