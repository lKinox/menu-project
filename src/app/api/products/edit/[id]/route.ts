

import { NextResponse, NextRequest } from 'next/server'
import { getIdProduct, putIdProduct, deleteProductById } from '@/app/lib/db';
import { put } from '@vercel/blob';

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  console.log('PUT request received');

  const params = await props.params;
  const formData = await req.formData();

  console.log('formData');

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const price_discount = parseFloat(formData.get('price_discount') as string);
  const imgData = formData.get('img');
  const avaible = formData.get('avaible') as string;
  const id = await params.id; // Asegúrate de obtener el ID correctamente (ya es una promesa resuelta aquí)

  let newImgUrl: string | null = null;
  let avaible_value: number;

  if (avaible === "true") {
    avaible_value = 1;
  } else {
    avaible_value = 0;
  }

  try {
    if (imgData instanceof File) {
      // Si imgData es un File, sube la nueva imagen
      const filename = `${name.replace(/\s+/g, '-')}-${Date.now()}.jpg`;
      const blob = await put(filename, imgData.stream(), {
        access: 'public',
        addRandomSuffix: true,
      });
      newImgUrl = blob.url;
      await putIdProduct(name, description, price, price_discount, newImgUrl, avaible_value, id);
    } else if (typeof imgData === 'string' && imgData) {
      // Si imgData es una cadena no vacía, usa la URL existente
      await putIdProduct(name, description, price, price_discount, imgData as string, avaible_value, id);
    }

    return NextResponse.json({ message: 'Producto actualizado con éxito' }, { status: 200 });
  } catch (error: any) { // <-- Añade el tipo 'any' para acceder a las propiedades del error
    console.error('Error al actualizar el producto:', error);
    return NextResponse.json({ error: error.message || 'Error desconocido al actualizar el producto' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params; // Obtener el ID de los parámetros de la ruta

  try {
    const products = await getIdProduct(id);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  try {
    // Llama a la función que eliminará el producto en la base de datos
    await deleteProductById(id);
    return NextResponse.json({ message: 'Producto eliminado con éxito' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 });
  }
}
