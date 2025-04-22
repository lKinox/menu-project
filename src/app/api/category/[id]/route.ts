import { NextResponse, NextRequest } from 'next/server'
import { deleteCategoryById } from '@/app/lib/db';

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
  
    try {
      // Llama a la función que eliminará el producto en la base de datos
      await deleteCategoryById(id);
      return NextResponse.json({ message: 'Producto eliminado con éxito' }, { status: 200 });
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      return NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 });
    }
}