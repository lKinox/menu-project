// dashboard/product/page.tsx
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Asterisk } from "lucide-react"
import { useState } from 'react';


const ProductForm: React.FC = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Nuevo estado para manejar el envío
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<number | string>('');
  const [price_discount, setPriceDiscount] = useState<number | string>('');
  const [img, setImg] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true); // Comienza el proceso de envío

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', String(price));
    formData.append('price_discount', String(price_discount));
    if (img) formData.append('img', img);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Producto añadido con éxito');

        router.push('/dashboard');
        // Limpiar el formulario
        setName('');
        setDescription('');
        setPrice('');
        setPriceDiscount('');
        setImg(null);
        setImagePreview(null); // Limpiar la vista previa
      } else {
        const errorData = await response.json();
        console.error('Error al enviar el formulario:', errorData.error);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsSubmitting(false); // Termina el proceso de envío
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Obtener el primer archivo o null
  
    if (file) {
      setImg(file); // Guardar el archivo en el estado
  
      const reader = new FileReader(); // Crear un objeto FileReader
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Establecer la vista previa de la imagen
      };
  
      reader.readAsDataURL(file); // Leer la imagen como una URL de datos
    }
  };

  return (
    <div className="flex min-h-screen flex-col text-gray-950">
        {/* Header */}
        <header className="bg-white py-8 md:py-12">
            <div className="container mx-auto px-4">
            <h1 className="text-center text-3xl font-bold md:text-5xl">Añadir Nuevo Producto</h1>
            <p className="mt-4 text-center text-muted-foreground">
                Complete el formulario para añadir un nuevo producto al catálogo
            </p>
            </div>
        </header>

        <main className="flex-1 bg-slate-50 py-12">
            <div className="container mx-auto max-w-2xl px-4">
            <Link
              href="/dashboard"
              className="mb-6 inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Link>

                <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">
                              Nombre del producto: 
                              <Asterisk className="mr-1 h-3 w-4" color="#ff0000"/>
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Ingrese el nombre del producto"
                              required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="descripcion">
                              Descripción:
                              <Asterisk className="mr-1 h-3 w-4" color="#ff0000"/>
                            </Label>
                            <Textarea
                              id="description"
                              name="description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Ingrese una descripción del producto"
                              rows={4}
                              required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">
                              Precio:
                              <Asterisk className="mr-1 h-3 w-4" color="#ff0000"/>
                            </Label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">$</span>
                              <Input
                                id="price"
                                name="price"
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                className="pl-8"
                                required
                              />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">
                              Precio en descuento:
                            </Label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">$</span>
                              <Input
                                id="price_discount"
                                name="price_discount"
                                type="text"
                                value={price_discount}
                                onChange={(e) => setPriceDiscount(e.target.value)}
                                placeholder="0.00"
                                className="pl-8"
                              />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imagen">
                              Imagen del producto:
                              <Asterisk className="mr-1 h-3 w-4" color="#ff0000"/>
                            </Label>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100">
                              
                                <Input
                                  id="img"
                                  name="img"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange} // Manejo del cambio en el input
                                  className="hidden"
                                />
                                <label
                                  htmlFor="img"
                                  className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-4"
                                >
                                  <Upload className="mb-2 h-6 w-6 text-slate-400" />
                                  <span className="text-sm font-medium text-slate-600">Haga clic para subir</span>
                                  <span className="mt-1 text-xs text-slate-500">PNG, JPG, GIF hasta 5MB</span>
                                </label>
                              </div>

                              {imagePreview && (
                                <div className="relative h-32 overflow-hidden rounded-lg border border-slate-200">
                                  <img
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Vista previa"
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                          <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                            Cancelar
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : "Guardar producto"}
                          </Button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
  );
};

export default ProductForm;
