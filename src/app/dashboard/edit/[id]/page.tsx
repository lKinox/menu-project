// dashboard/product/page.tsx
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Asterisk } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { showToast } from "nextjs-toast-notify";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}


const ProductForm: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Nuevo estado para manejar el envío
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<number | string>('');
  const [price_discount, setPriceDiscount] = useState<number | string>('');
  const [img, setImg] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return; // Asegúrate de que el ID esté definido

      try {
        const response = await fetch(`/api/products/edit/${id}`); // Ajusta la API según tu configuración
        if (response.ok) {
          const products = await response.json(); // Esto es un array de productos
        
          if (products.length > 0) { // Verifica que hay al menos un producto en el array
            const product = products[0]; // Obtén el primer producto del array

            console.log(product)
        
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setPriceDiscount(product.price_discount);
            setImg(product.img);
            setImagePreview(product.img); // Ruta de la imagen, ajusta según tu lógica
            setIsAvailable(Boolean(product.available)); // Ruta de la imagen, ajusta según tu lógica
            setSelectedCategory(product.category_id); // Ruta de la imagen, ajusta según tu lógica
      
          } else {
            console.error('No se encontraron productos.');
          }
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      alert("Por favor, seleccione una categoría.");
      return;
    }

    setIsSubmitting(true); // Comienza el proceso de envío

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', String(price));
    formData.append('price_discount', String(price_discount));
    formData.append('available', String(isAvailable));
    formData.append('category_id', String(selectedCategory));

    console.log(isAvailable)

    if (img) {
      formData.append('img', img);
    } else {
      formData.append('img', imagePreview || '');
    }

    try {
      const response = await fetch(`/api/products/edit/${id}`, { // Asegúrate de incluir el id en la URL
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        console.log('Producto actualizado con éxito');

        router.push('/dashboard');
        // Limpiar el formulario
        setName('');
        setDescription('');
        setPrice('');
        setPriceDiscount('');
        setImg(null);
        setImagePreview(''); // Limpiar la vista previa

        showToast.success('¡Producto editado correctamente!', {
          duration: 4000,
          progress: false,
          position: "top-left",
          transition: "popUp",
          icon: '',
          sound: false,
        });
      } else {
        const errorData = await response.json();
        console.log(errorData)
        console.error('Error al enviar el formulario:', errorData.error);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsSubmitting(false); // Termina el proceso de envío
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      setImg(file); // Mantener el archivo para el envío
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Establecer la vista previa a partir de la lectura del archivo
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvailableChange = (checked: boolean) => {
    setIsAvailable(checked);
  };

  const fetchCategory = async () => {
    try {
      const response = await fetch('/api/category'); // Llama a tu API
      if (response.ok) {
        const data: Category[] = await response.json();
        setCategories(data); // Actualiza el estado con los datos obtenidos
      } else {
        console.error('Error al obtener categorías:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  return (
    <div className="flex min-h-screen flex-col text-gray-950">
        {/* Header */}
        <header className="bg-white py-8 md:py-12">
            <div className="container mx-auto px-4">
            <h1 className="text-center text-3xl font-bold md:text-5xl">Editar {name}</h1>
            <p className="mt-4 text-center text-muted-foreground">
                Complete el formulario para editar el producto del catálogo
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
                            <Label htmlFor="nombre">
                              Categoría: 
                              <Asterisk className="mr-1 h-3 w-4" color="#ff0000"/>
                            </Label>
                            <Select value={selectedCategory !== null ? String(selectedCategory) : undefined} onValueChange={(value) => setSelectedCategory(String(value))}> 
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccione una categoría" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Categorías</SelectLabel>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                                ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
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
                            <Label htmlFor="price_discount">
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
                        <div className="space-y-2">
                            <Label htmlFor="available">
                              Disponible:  
                            </Label>
                            <Switch
                              id="available"
                              checked={isAvailable}
                              onCheckedChange={handleAvailableChange}
                            />
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