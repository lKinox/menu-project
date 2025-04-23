"use client"

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Trash, Mail, Phone, ShoppingCart, ShoppingBag, Minus, Plus, X } from "lucide-react"
import { showToast } from "nextjs-toast-notify";
import Cookies from 'js-cookie';


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

type CartItem = {
  product: Product
  quantity: number
}

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]); // Estado para almacenar los productos
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | string | number>('Todas');
  const [categoryNameDialog, setCategoryNameDialog] = useState<string>('');
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
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false);


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
    const message = encodeURIComponent(`¡Hola! Estoy revisando tu página y quiero más detalle de tu producto: ${productName}`);
    const url = `https://api.whatsapp.com/send?phone=${whatsapp}&text=${message}`;
    window.open(url, '_blank'); // Abre la URL en una nueva pestaña
  };

  useEffect(() => {
    // Cargar el carrito desde la cookie al montar el componente
    const storedCart = Cookies.get('cartItems');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart) as CartItem[];
        setCartItems(parsedCart);
      } catch (error) {
        Cookies.remove('cartItems');
      }
    }
  }, []);

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

    useEffect(() => {
      if (selectedProduct) {
        const category = categories.find(cat => cat.id === selectedProduct.category_id);
        setCategoryNameDialog(category ? category.name : 'Categoría Desconocida');
      }
    }, [selectedProduct, categories]); // Ejecuta cuando selectedProduct o categories cambien

    const addToCart = (product: Product, quantity: number = 1) => {
      if (isAdding) return; // Evitar operaciones si ya se está añadiendo
      setIsAdding(true);
      
      setCartItems(prevCartItems => {
        const existingItemIndex = prevCartItems.findIndex(item => item.product.id === product.id);
    
        console.log(existingItemIndex);
    
        let updatedItems = [...prevCartItems]; // Crear una copia del carrito anterior
    
        if (existingItemIndex >= 0) {
          // Si el producto ya existe en el carrito, incrementa la cantidad
          updatedItems[existingItemIndex].quantity += quantity;
        } else {
          // Si el producto no existe en el carrito, agrégalo como un nuevo item
          updatedItems = [...prevCartItems, { product, quantity }];
        }
    
        saveCartToCookie(updatedItems); // Guardar en la cookie después de actualizar el estado
        setIsAdding(false);
        return updatedItems;
      });
    
      showToast.success(`${product.name} añadido al carrito`, {
        duration: 4000,
        progress: false,
        position: "top-left",
        transition: "popUp",
        icon: '',
        sound: false,
      });
    
      setIsAdding(false); // Volver a permitir la acción después de la operación
    }

    const removeFromCart = (productId: number) => {
      setCartItems(prevItems => {
        const updatedItems = prevItems.filter(item => item.product.id !== productId);
        saveCartToCookie(updatedItems); // Guardar en la cookie después de eliminar
        return updatedItems;
      });
    };

    const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0)

    const updateQuantity = (productId: number, newQuantity: number) => {
      if (newQuantity < 1) return;
  
      setCartItems(prevItems => {
        const updatedItems = prevItems.map(item =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
        saveCartToCookie(updatedItems); // Guardar en la cookie después de actualizar la cantidad
        return updatedItems;
      });
    };

    const cartTotal = cartItems.reduce((total, item) => {
      const price =
        item.product.price_discount > 0
          ? item.product.price_discount
          : item.product.price; // Usa price_discount si es mayor que 0, sino usa price
    
      return total + price * item.quantity;
    }, 0);

    const sentMessage = (products: CartItem[]) => {
      let messageDetails = "¡Hola! Estoy interesado en estos productos de tu catálogo:\n";

      products.forEach((item) => {
        const price =
          item.product.price_discount > 0
            ? item.product.price_discount
            : item.product.price;

        messageDetails += `${item.product.name} - $${price} x ${item.quantity}\n`;
      });

      messageDetails += `\nTotal del carrito: $${cartTotal}`;
      messageDetails += "\n\nGracias.";

      const message = encodeURIComponent(messageDetails);
      
      const url = `https://api.whatsapp.com/send?phone=${whatsapp}&text=${message}`;
      window.open(url, '_blank'); // Abre la URL en una nueva pestaña
    }

    const saveCartToCookie = (cartItems: CartItem[]) => {
      try {
        const cartItemsString = JSON.stringify(cartItems);
        console.log(cartItems, cartItemsString)
        Cookies.set('cartItems', cartItemsString, { expires: 1 }); // Guarda la cookie por 7 días
        console.log('Carrito guardado en la cookie:', cartItems);
      } catch (error) {
        console.error('Error al guardar el carrito en la cookie:', error);
      }
    };

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
      <header className="bg-white py-8 md:py-12 static">
        <div className="container flex items-center flex-col mx-auto px-4">
          <div className="relative w-[250px] h-[250px] rounded-full overflow-hidden border">
            <Image
              src={imgURL || "/placeholder-logo.png"}
              alt={companyName}
              fill
              className="object-cover transition-all hover:scale-105"
              style={{ objectPosition: 'center' }}
            />
          </div>
          <h1 className="text-center text-3xl font-bold md:text-5xl">{companyName}</h1>
          <p className="mt-4 text-center text-muted-foreground">
            {welcomeText}
          </p>
        </div>

        {/* Botón del carrito */}
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
              <Button
                size="icon"
                className="fixed bottom-5 right-5 z-50 px-10 py-5 text-lg border bg-amber-600" // Aumentar padding y texto
              >
                <ShoppingBag /> {/* Aumentar el tamaño del icono */}
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-lime-700 text-xs text-white">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              </SheetTrigger>
              <SheetContent className="w-full p-[20] sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Tu Carrito
                  </SheetTitle>
                </SheetHeader>
                
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[70vh]">
                    <div className="rounded-full bg-slate-100 p-6 mb-4">
                      <ShoppingBag className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Tu carrito está vacío</h3>
                    <p className="text-sm text-slate-500 text-center mb-6">
                      Parece que aún no has añadido ningún producto a tu carrito
                    </p>
                    <Button onClick={() => setIsCartOpen(false)}>
                      Continuar comprando
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-auto py-6">
                      <ul className="space-y-5">
                        {cartItems.map((item) => (
                          <li key={item.product.id} className="flex gap-4">
                            <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                              <Image 
                                src={item.product.img || "/placeholder.svg"} 
                                alt={item.product.name} 
                                fill 
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-1 flex-col">
                              <div className="flex justify-between">
                                <h4 className="text-sm font-medium">{item.product.name}</h4>
                                <button 
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="text-slate-400 hover:text-red-500"
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="mt-1 text-sm text-slate-500 line-clamp-1">
                                {item.product.description.substring(0, 60)}...
                              </p>
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center border rounded-md">
                                  <button 
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="px-2 py-1 text-sm">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                <div className="text-sm font-medium">
                                  {item.product.price_discount > 0 ? (
                                    <>
                                      <span>${item.product.price_discount}</span>
                                      <span className="ml-1 text-xs text-red-500 line-through">
                                        ${item.product.price}
                                      </span>
                                    </>
                                  ) : (
                                    <span>${item.product.price}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border-t pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>€{cartTotal.toFixed(2)}</span>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => sentMessage(cartItems)}  
                        >
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
                          Escribir al Whatsapp
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => setIsCartOpen(false)}
                        >
                          Continuar comprando
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>


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
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={isAdding}
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        title="Añadir al carrito"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
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
                <Badge className="absolute right-2 top-2 capitalize">{categoryNameDialog}</Badge>
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
                  <Button
                        onClick={() => addToCart(selectedProduct)}
                        disabled={isAdding}
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        title="Añadir al carrito"
                  >
                        <ShoppingCart className="h-4 w-4" />
                  </ Button>
                  <Button className="flex-1 gap-2 cursor-pointer" onClick={() => handleRedirect(selectedProduct.name)}> {/* Añadir flex-1 aquí */}
                    {/*<ShoppingCart className="h-4 w-41" />*/}
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
                    Escribir al Whatsapp
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