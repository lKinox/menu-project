"use client"

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Mail, MapPin, Phone, ShoppingCart, X } from "lucide-react"

// Define la interfaz para los productos
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  price_discount: number;
  img: string; // Suponemos que img almacena el ID del producto
  avaible: number;
}

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]); // Estado para almacenar los productos
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


  // Función para obtener productos de la API
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products'); // Llama a tu API
      if (response.ok) {
        const data: Product[] = await response.json();
  
        // Filtrar los productos para incluir solo los que están disponibles
        const availableProducts = data.filter(product => product.avaible);
  
        setProducts(availableProducts); // Actualiza el estado con los productos disponibles
      } else {
        console.error('Error al obtener productos:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  // Usa useEffect para obtener productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  useEffect(() => {
    const checkAuthentication = async () => {
      const response = await fetch('/api/cookie/get', {
        method: 'GET',
        credentials: 'include', // Asegúrate de enviar las cookies con la solicitud
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication(); // Llama a la función para verificar la autenticación
  }, []);

  const handleDetailsProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsDialogOpen(true);
  };

  const handleRedirect = (productName: string) => {
    const phone = '+584122532702';
    const message = encodeURIComponent(`¡Hola! Estoy revisando tu página y quiero más detalle de tu producto: ${productName}`);
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
    window.open(url, '_blank'); // Abre la URL en una nueva pestaña
  };

  return (
    <div className="flex min-h-screen flex-col text-gray-950">
      {/* Header */}
      <header className="bg-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-center text-3xl font-bold md:text-5xl">Nuestro Catálogo</h1>
          <p className="mt-4 text-center text-muted-foreground">
            Descubre nuestra selección de productos de alta calidad
          </p>
        </div>
      </header>

      {/* Catalog */}
      <main className="flex-1 bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="mb-6 inline-flex items-center text-lg font-medium text-slate-600 hover:text-slate-900"
            >
              Ver el Panel de administración
            </Link>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-md"
              >
                <div className="relative h-85 w-full">
                  <Image src={product.img} alt={product.name} fill className="object-cover transition-all hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <div className="relative mt-1">
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    {/* <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-t from-white to-transparent to-50%"></div> */}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {product.price_discount != 0.00 ? (
                      <>
                        <div>
                          <span className="font-semibold">${product.price_discount}</span> {/* Precio en descuento, opaco si no está */}
                          <span className="font-semibold text-sm line-through text-red-600">${product.price}</span> {/* Precio normal */}
                        </div>
                      </>
                    ) : (
                      <span className="font-semibold">${product.price}</span> // Solo muestra el precio original si no hay descuento
                    )}
                    <Link
                      href="#"
                      className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
                      onClick={(e) => {
                        e.preventDefault(); // Evita que el link haga navegación.
                        handleDetailsProduct(product); // Llama a la función pasando el producto actual.
                      }}
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h2 className="text-xl text-center font-bold">Nuestra Empresa</h2>
              <p className="mt-4 text-slate-400 text-center">
                Ofrecemos productos de la más alta calidad desde 2010. Nuestra misión es brindar la mejor experiencia a
                nuestros clientes.
              </p>
            </div>

            <div>
              <h2 className="text-xl text-center font-bold">Horario</h2>
              <ul className="mt-4 space-y-2 text-slate-400 text-center">
                <li>Lunes - Viernes: 9:00 - 18:00</li>
                <li>Sábado: 10:00 - 14:00</li>
                <li>Domingo: Cerrado</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-center">Contacto</h2>
              <ul className="mt-4 space-y-4 text-center">
                <li className="flex items-center flex justify-center gap-3 text-slate-400 text-center">
                  <span>Calle Principal 123, Ciudad</span>
                </li>
                <li className="flex items-center flex justify-center gap-3 text-slate-400">
                  <span>+34 123 456 789</span>
                </li>
                <li className="flex items-center flex justify-center gap-3 text-slate-400">
                  <span>info@ejemplo.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>© {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
      
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          {selectedProduct && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Columna de la imagen */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg w-full h-[200px] md:h-auto"> {/* Ajusta la altura para móviles */}
                <Image
                  src={selectedProduct.img || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover md:max-w-full max-w-[200px] mx-auto transition-all hover:scale-105" // Tamaño de imagen más pequeño en móviles
                />
              </div>

              {/* Columna de los detalles */}
              <div className="flex flex-col">
                <DialogHeader className="mb-2">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
                  </div>
                  <DialogDescription className="mt-2 gap-2 flex items-center">
                    {selectedProduct.price_discount ? (
                      <>
                      {selectedProduct.price_discount != 0.00 ? (
                        <>
                          <span className="text-xl font-semibold text-slate-900">${selectedProduct.price_discount}</span>
                          <span className="text-sm font-medium text-red-500 line-through">${selectedProduct.price}</span>
                          <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                            {Math.round(
                              ((Number.parseFloat(selectedProduct.price.toString().replace("€", "")) -
                                Number.parseFloat(selectedProduct.price_discount.toString().replace("€", ""))) /
                                Number.parseFloat(selectedProduct.price.toString().replace("€", ""))) *
                                100,
                            )}
                            % OFF
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-semibold text-slate-900">${selectedProduct.price}</span> // Solo muestra el precio original si no hay descuento
                      )}
                      </>
                    ) : (
                      <span className="text-xl font-semibold text-slate-900">{selectedProduct.price}</span>
                    )}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-2 flex-1 overflow-auto max-h-40 md:max-h-100"> {/* Max height diferente para móvil y desktop */}
                  <p className="text-sm leading-relaxed text-slate-600">{selectedProduct.description}</p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button className="flex-1 gap-2 cursor-pointer" onClick={() => handleRedirect(selectedProduct.name)}> {/* Añadir flex-1 aquí */}
                    <ShoppingCart className="h-4 w-41" />
                    Escribir al whatsapp
                  </Button>
                  <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)} className="flex-1 cursor-pointer"> {/* Añadir flex-1 aquí */}
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>


    </div>
  );
}

// Sample product data
/*const products = [
  {
    id: 1,
    name: "Producto 1",
    description: "Descripción breve del producto 1",
    price: "€29.99",
    image: "images.jpg",
  },
  {
    id: 2,
    name: "Producto 2",
    description: "Descripción breve del producto 2",
    price: "€39.99",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 3,
    name: "Producto 3",
    description: "Descripción breve del producto 3",
    price: "€49.99",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 4,
    name: "Producto 4",
    description: "Descripción breve del producto 4",
    price: "€59.99",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 5,
    name: "Producto 5",
    description: "Descripción breve del producto 5",
    price: "€69.99",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 6,
    name: "Producto 6",
    description: "Descripción breve del producto 6",
    price: "€79.99",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 7,
    name: "Producto 7",
    description: "Descripción breve del producto 7",
    price: "€89.99",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 8,
    name: "Producto 8",
    description: "Descripción breve del producto 8",
    price: "€99.99",
    image: "/placeholder.svg?height=400&width=400",
  },
]
*/