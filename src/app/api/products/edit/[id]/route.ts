import { NextResponse, NextRequest } from 'next/server'
import { getIdProduct, putIdProduct, deleteProductById } from '@/app/lib/db';
import { put } from '@vercel/blob';

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const formData = await req.formData();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const file = formData.get('img') as File;
  const id = params.id; // Asegúrate de obtener el ID de los parámetros de la ruta

  try {
    const filename = `${name.replace(/\s+/g, '-')}-${Date.now()}.jpg`; // genera un nombre de archivo único

      // Usar el método put para subir la imagen al almacenamiento de blobs de Vercel
      const blob = await put(filename, file.stream(), {
        access: 'public',
        addRandomSuffix: true,
      });

      const img = blob.url

    await putIdProduct(name, description, price, img, id);

    

    return NextResponse.json({ message: 'Producto actualizado con éxito' }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 });
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
