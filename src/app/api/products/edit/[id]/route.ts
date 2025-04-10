import { NextResponse, NextRequest } from 'next/server'
import { getIdProduct, putIdProduct, deleteProductById } from '@/app/lib/db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configurar multer para guardar archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'public/products');
    
    // Asegúrate de que la carpeta exista
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Usa el ID del producto como nombre de archivo
    cb(null, `${req.body.id}.jpg`); // Cambiar .jpg según el tipo de imagen
  },
});

const upload = multer({ storage });

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const formData = await req.formData();
    
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const img = formData.get('img') as File; // Obtén la imagen del FormData
  const id = params.id; // Asegúrate de obtener el ID de los parámetros de la ruta

  try {
    await putIdProduct(name, description, price, id);

    if (img) {
      const buffer = Buffer.from(await img.arrayBuffer());
      const filePath = path.join(process.cwd(), 'public/products', `${id}.jpg`); // Modifica la extensión si es necesario
      fs.writeFileSync(filePath, buffer); // Guarda la imagen en la carpeta
    }

    return NextResponse.json({ message: 'Producto actualizado con éxito' }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params; // Obtener el ID de los parámetros de la ruta

  try {
    const products = await getIdProduct(id);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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
