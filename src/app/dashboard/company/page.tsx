"use client"

import { useEffect, useState } from 'react';
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogoUpload } from "./logo-upload"
import { Separator } from "@/components/ui/separator"
import { showToast } from "nextjs-toast-notify";


export default function CompanyPage() {
    const router = useRouter()
    const [companyName, setCompanyName] = useState<string>('');
    const [imgURL, setImgURL] =  useState<string>('');
    const [img, setImg] = useState<File | string | null>(imgURL || null);
    const [welcomeText, setWelcomeText] = useState<string>('');
    const [aboutText, setAboutText] = useState<string>('');
    const [scheduleText, setScheduleText] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [whatsapp, setWhatsapp] = useState<string>('');
    const [facebook, setFacebook] = useState<string>('');
    const [instagram, setInstagram] = useState<string>('');

    const handleLogout = async () => {
        try {
          const response = await fetch('/api/cookie/delete', { method: 'GET', credentials: 'include' });
          if (response.ok) {
            router.push('/'); // Redirige a la página principal después de cerrar sesión
          } else {
            console.error('Error al cerrar sesión:', response.statusText);
          }
        } catch (error) {
          console.error('Error en la solicitud de cierre de sesión:', error);
        }
    };

    const getCompany = async () => {
        try {
          const response = await fetch(`/api/company`); // Ajusta la API según tu configuración
          if (response.ok) {
              const companies = await response.json(); // Esto es un array de productos

              console.log(companies)

              if (companies.length > 0) {
                const company = companies[0]; // Accede al primer elemento

                setCompanyName(company.name !== undefined ? company.name : '');
                setImgURL(company.img || ''); // Aproximadamente igual a lo anterior
                setWelcomeText(company.welcome_text || '');
                setAboutText(company.about || '');
                setScheduleText(company.schedule || '');
                setPhone(company.phone || '');
                setEmail(company.email || '');
                setWhatsapp(company.whatsapp || '');
                setFacebook(company.facebook || '');
                setInstagram(company.instagram || '');

            }


            } else {
                console.error('No se encontraron productos.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    useEffect(() => {
      getCompany();
    }, []);
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      const formData = new FormData();
      formData.append('name', companyName);
      formData.append('welcome_text', welcomeText);
      formData.append('about', aboutText);
      formData.append('schedule', scheduleText);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('whatsapp', whatsapp);
      formData.append('facebook', facebook);
      formData.append('instagram', instagram);
      if (img) formData.append('img', img);
      if (imgURL) formData.append('imgURL', imgURL);

      try {
        const response = await fetch('/api/company', {
            method: 'PUT',
            body: formData,
        });

        if (response.ok) {
          getCompany();

          showToast.success('¡Guardado correctamente!', {
            duration: 4000,
            progress: false,
            position: "top-left",
            transition: "popUp",
            icon: '',
            sound: false,
          });
        
        } else {
            const errorData = await response.json();
            console.error('Error al enviar el formulario:', errorData.error);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
    }


    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <h1 className="text-xl font-bold md:text-2xl">Panel de Administración</h1>
                    <nav className="flex items-center gap-4">
                        <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
                            Ver Tienda
                        </Link>
                        <Button size="sm" variant="outline" onClick={handleLogout}>
                            Salir
                        </Button>
                    </nav>
                </div>
            </header>

            <div className="border-b bg-white px-3 py-3 w-full">
                <div className="flex justify-center gap-3">
                    <Button asChild>
                        <Link href="/dashboard">
                            Productos
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard/category">
                            Categorías
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard/company">
                             Empresa
                        </Link>
                    </Button>
                </div>
            </div>

            <main className="container mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-8 text-center">Configuración de su Catálogo</h1>
                <div className="container max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit}>
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid grid-cols-4 mb-8 w-full">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="about">Empresa</TabsTrigger>
                                <TabsTrigger value="hours">Horarios</TabsTrigger>
                                <TabsTrigger value="contact">Contacto</TabsTrigger>
                            </TabsList>

                            <TabsContent value="general">
                            <Card>
                                <CardHeader>
                                <CardTitle>Información General</CardTitle>
                                <CardDescription>Configure la información básica de su página web.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre de la Página</Label>
                                    <Input
                                    id="name"
                                    name="name"
                                    placeholder="Mi Empresa"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Logo de la Página</Label>
                                    <LogoUpload onLogoChange={(file) => setImg(file)} initialImage={imgURL} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="welcomeMessage">Mensaje de Bienvenida</Label>
                                    <Textarea
                                    id="welcomeMessage"
                                    name="welcomeMessage"
                                    placeholder="Bienvenidos a nuestra página web..."
                                    value={welcomeText}
                                    onChange={(e) => setWelcomeText(e.target.value)}
                                    className="min-h-[100px]"
                                    />
                                </div>
                                </CardContent>
                            </Card>
                            </TabsContent>

                            <TabsContent value="about">
                            <Card>
                                <CardHeader>
                                <CardTitle>Sobre la Empresa</CardTitle>
                                <CardDescription>Cuéntenos sobre su empresa y lo que ofrece.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="aboutText">Descripción de la Empresa</Label>
                                    <Textarea
                                    id="aboutText"
                                    name="aboutText"
                                    placeholder="Somos una empresa dedicada a..."
                                    value={aboutText}
                                    onChange={(e) => setAboutText(e.target.value)}
                                    className="min-h-[200px]"
                                    />
                                </div>
                                </CardContent>
                            </Card>
                            </TabsContent>

                            <TabsContent value="hours">
                            <Card>
                                <CardHeader>
                                <CardTitle>Horario de Trabajo</CardTitle>
                                <CardDescription>Coloque un horario por línea</CardDescription>
                                </CardHeader>
                                <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="aboutText">Horario de la Empresa</Label>
                                    <Textarea
                                    id="scheduleText"
                                    name="scheduleText"
                                    placeholder="Lunes a viernes de..."
                                    value={scheduleText}
                                    onChange={(e) => setScheduleText(e.target.value)}
                                    className="min-h-[200px]"
                                    />
                                </div>
                                </CardContent>
                            </Card>
                            </TabsContent>

                            <TabsContent value="contact">
                            <Card>
                                <CardHeader>
                                <CardTitle>Métodos de Contacto</CardTitle>
                                <CardDescription>Configure las formas en que sus clientes pueden contactarlo.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+34 123 456 789"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <Input
                                    id="email"
                                    type="email"
                                    placeholder="contacto@miempresa.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <Separator className="my-4" />
                                <h3 className="text-lg font-medium">Redes Sociales</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp">WhatsApp</Label>
                                    <Input
                                    id="whatsapp"
                                    placeholder="+34 123 456 789"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="facebook">Facebook</Label>
                                    <Input
                                    id="facebook"
                                    placeholder="https://facebook.com/miempresa"
                                    value={facebook}
                                    onChange={(e) => setFacebook(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <Input
                                    id="instagram"
                                    placeholder="https://instagram.com/miempresa"
                                    value={instagram}
                                    onChange={(e) => setInstagram(e.target.value)}
                                    />
                                </div>
                                </CardContent>
                            </Card>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-8 flex justify-end">
                            <Button type="submit" size="lg">
                            Guardar Cambios
                            </Button>
                        </div>
                        </form>
                    </div>
                </main>                 
        </div>
    )
} 