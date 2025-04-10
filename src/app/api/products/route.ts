// pages/api/products/route.ts
import { NextResponse } from 'next/server';
import { insertProduct, getAllProducts } from '@/app/lib/db';
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
  
export async function POST(req: Request) {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
  
    try {
      // Primero, inserta el producto para obtener el ID
      const insertId = await insertProduct(name, description, price);
      
      // Luego, actualiza el producto con la imagen
      const file = formData.get('img') as File;
      
      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(process.cwd(), 'public/products', `${insertId}.jpg`);
        fs.writeFileSync(filePath, buffer); // Guarda la imagen en la carpeta
      }
  
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