"use client"

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Mail, MapPin, Phone, ShoppingCart, X } from "lucide-react"

// Define la interfaz para los productos
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  price_discount: number;
  img: string; // Suponemos que img almacena el ID del producto
  avaible: number;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

interface Company {
  id: number;
  name: string;
  img: string;
  welcome_text: string;
  about: string;
  schedule: string;
  phone: string;
  email: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
}

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]); // Estado para almacenar los productos
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | string | number>('Todas');
  const [categoryName, setCategoryName] = useState<string>('');
  const [company, setCompany] = useState<Company[]>([]);
  const [companyName, setCompanyName] = useState<string>('');
  const [imgURL, setImgURL] =  useState<string>('');
  const [welcomeText, setWelcomeText] = useState<string>('');
  const [aboutText, setAboutText] = useState<string>('');
  const [scheduleText, setScheduleText] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [facebook, setFacebook] = useState<string>('');
  const [instagram, setInstagram] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  // const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);


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
    } finally {
      // Independientemente del resultado, marcamos la carga como completa
      setIsLoaded(true);
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
  }, []);

  const handleRedirect = (productName: string) => {
    const phone = '+584122532702';
    const message = encodeURIComponent(`¡Hola! Estoy revisando tu página y quiero más detalle de tu producto: ${productName}`);
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
    window.open(url, '_blank'); // Abre la URL en una nueva pestaña
  };

  useEffect(() => {
    if (selectedCategory !== 'Todas') {
      const foundCategory = categories.find((cat) => cat.id === selectedCategory);
      setCategoryName(foundCategory ? foundCategory.name : '');
    } else {
      setCategoryName('');
    }
  }, [selectedCategory, categories]);

  const filteredProducts =
    selectedCategory === 'Todas'
      ? products
      : products.filter((product) => product.category_id === selectedCategory);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value === 'Todas' ? 'Todas' : parseInt(event.target.value);
    setSelectedCategory(selectedId);
  };

  const getCompany = async () => {
        try {
          const response = await fetch(`/api/company`); // Ajusta la API según tu configuración
          if (response.ok) {
              const companies = await response.json(); // Esto es un array de productos

              if (companies.length > 0) {
                const company = companies[0]; // Accede al primer elemento
                
                setCompany([company]);
                setCompanyName(company.name !== undefined ? company.name : '');
                setImgURL(company.img || "/placeholder-logo.png"); // Aproximadamente igual a lo anterior
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

    if (!isLoaded) {
      // Aquí puedes renderizar tu vista previa (skeleton, spinner, texto, etc.)
      return (
          <div className="flex min-h-screen items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
              <p className="ml-4 text-lg text-gray-600">Cargando la página...</p>
          </div>
      );
  }

  return (
    <div className="flex min-h-screen flex-col text-gray-950">
      {/* Header */}
      <header className="bg-white py-8 md:py-12">
        <div className="container flex items-center flex-col mx-auto px-4">
          <div className="relative w-[250px] h-[250px] rounded-full overflow-hidden">
            <Image
              src={imgURL || "/placeholder-logo.png"}
              alt={companyName}
              fill
              className="object-cover transition-all hover:scale-105"
              style={{ objectPosition: 'center' }} // Opcional: Centra la imagen dentro del círculo
            />
          </div>
          <h1 className="text-center text-3xl font-bold md:text-5xl">{companyName}</h1>
          <p className="mt-4 text-center text-muted-foreground">
            {welcomeText}
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
          <div className="px-3 py-3 w-full">
            <div
              className="flex justify-start md:justify-center overflow-x-auto md:overflow-x-visible gap-3 scroll-smooth scrollbar-hide"
            >
              <Button
                variant={selectedCategory === 'Todas' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('Todas')}
                className="capitalize shrink-0"
              >
                Todas
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className="capitalize shrink-0"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="mb-6 text-center">
            <p className="text-sm text-slate-600">
              Mostrando {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
              {selectedCategory !== 'Todas' ? ` en ${categoryName}` : ''}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              // Busca la categoría correspondiente al category_id del producto
              const category = categories.find((cat) => cat.id === product.category_id);
              // Obtiene el nombre de la categoría o un texto alternativo si no se encuentra
              const categoryName = category ? category.name : 'Categoría Desconocida';

              return (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-md"
                >
                  <div className="relative h-85 w-full">
                    <Image src={product.img} alt={product.name} fill className="object-cover transition-all hover:scale-105" />
                    <Badge className="absolute right-2 top-2 capitalize">{categoryName}</Badge>
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
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h2 className="text-xl text-center font-bold">Nuestra Empresa</h2>
              <p className="mt-4 text-slate-400">
                {aboutText}
              </p>
            </div>

            <div>
              <h2 className="text-xl text-center font-bold">Horario</h2>
              <ul className="mt-4 space-y-2 text-slate-400 text-center">
                {scheduleText.split('\n').map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-center">Contacto</h2>
              <ul className="mt-4 space-y-4 text-center">
                <li className="flex items-center flex-row justify-center gap-3 text-slate-400 text-center cursor-pointer">
                  <Phone size={18} />
                  <Link href={`tel:${phone}`} target="_blank">
                    {phone}
                  </Link>
                </li>
                <li className="flex items-center flex-row justify-center gap-3 text-slate-400">
                  <Mail size={18} />
                  <Link href={`mailto:${email}`} target="_blank">
                    {email}
                  </Link>
                </li>
                <li className="flex items-center flex-row justify-center gap-3 text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-facebook"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <Link href={facebook} target="_blank">
                    Facebook
                  </Link>
                </li>
                <li className="flex items-center flex-row justify-center gap-3 text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <Link href={instagram} target="_blank">
                    Instagram
                  </Link>
                </li>
                <li className="flex items-center flex-row justify-center gap-3 text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-message-circle"
                  >
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  </svg>
                  <Link href={`https://wa.me/${whatsapp}`} target="_blank">
                    Whastapp
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>© {new Date().getFullYear()} {companyName}. Todos los derechos reservados.</p>
            <p className="mt-6">Desarrollado por 
                <Link href="https://reyanj.netlify.app/" target="_blank" className="text-white pl-[5]">
                  Reyan J.
                </Link>
            </p>
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