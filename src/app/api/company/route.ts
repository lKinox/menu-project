import { NextResponse } from 'next/server';
import { getCompany, updateCompany } from '@/app/lib/db';
import { put } from '@vercel/blob';


export async function PUT(req: Request) {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const welcome_text = formData.get('welcome_text') as string;
    const about = formData.get('about') as string;
    const schedule= formData.get('schedule') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const whatsapp = formData.get('whatsapp') as string;
    const facebook = formData.get('facebook') as string;
    const instagram = formData.get('instagram') as string;
    const imgData = formData.get('img') as File
    const imgURL = formData.get('imgURL') as string;

    try {

        if (imgData) {
            const filename = `${name.replace(/\s+/g, '-')}-${Date.now()}.jpg`;
            const blob = await put(filename, imgData.stream(), {
                access: 'public',
                addRandomSuffix: true,
            });
            const img = blob.url; // Reemplazar con la nueva imagen si se carga una
            const updatedCompany = await updateCompany(name, img, welcome_text, about, schedule, phone, email, whatsapp, facebook, instagram);
            return NextResponse.json(updatedCompany, { status: 200 });
        } else {
            const updatedCompany = await updateCompany(name, imgURL, welcome_text, about, schedule, phone, email, whatsapp, facebook, instagram);
            return NextResponse.json(updatedCompany, { status: 200 });
        }
        
    } catch (error) {
        console.error('Error al actualizar la empresa:', error);
        return NextResponse.json({ error: 'Error al obtener la empresa' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const company = await getCompany();
        return NextResponse.json(company, { status: 200 });
    } catch (error) {
        console.error('Error al obtener la empresa:', error);
        return NextResponse.json({ error: 'Error al obtener la empresa' }, { status: 500 });
    }
}