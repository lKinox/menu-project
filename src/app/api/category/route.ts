import { NextResponse } from 'next/server';
import { getCategory, postCategory } from '@/app/lib/db';


export async function GET() {
    try {
      const categories = await getCategory();
      return NextResponse.json(categories, { status: 200 });
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      return NextResponse.json({ error: 'Error al obtener las categorías' }, { status: 500 });
    }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const category = formData.get('category') as string;

    const insertCategory = await postCategory(category);
    
    return NextResponse.json(insertCategory, { status: 200 });
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    return NextResponse.json({ error: 'Error al obtener las categorías' }, { status: 500 });
  }
}