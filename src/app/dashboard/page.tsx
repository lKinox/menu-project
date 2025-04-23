"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreVertical, Plus, Search, Trash } from "lucide-react"
import { showToast } from "nextjs-toast-notify";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    img: string; // Suponemos que img almacena el ID del producto
  }

export default function DashboardPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  const [products, setProducts] = useState<Product[]>([]); // Estado para almacenar los productos

  // Función para obtener productos de la API
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products'); // Llama a tu API
      if (response.ok) {
        const data: Product[] = await response.json();
        setProducts(data); // Actualiza el estado con los datos obtenidos
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

  console.log(products)

  // Filtrar productos según el término de búsqueda
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Función para eliminar un producto
  const handleDeleteProduct = async () => {
    if (productToDelete !== null) {
      try {
        const response = await fetch(`/api/products/edit/${productToDelete}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          // Actualizar el estado local para eliminar el producto de la lista
          setProducts(products.filter((product) => product.id !== productToDelete));
          showToast.success('¡Producto eliminado correctamente!', {
            duration: 4000,
            progress: false,
            position: "top-left",
            transition: "popUp",
            icon: '',
            sound: false,
          });
          console.log('Producto eliminado con éxito');
        } else {
          console.error('Error al eliminar el producto:', response.statusText);
        }
      } catch (error) {
        console.error('Error en la solicitud de eliminación:', error);
      } finally {
        setProductToDelete(null); // Restablecer el ID del producto a eliminar
        setIsDeleteDialogOpen(false); // Cerrar el diálogo de eliminación si es necesario
      }
    }
  };

  // Función para confirmar eliminación
  const confirmDelete = (id: number) => {
    setProductToDelete(id)
    setIsDeleteDialogOpen(true)
  }

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

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">Productos</h2>
              <p className="text-muted-foreground">Gestiona los productos de tu catálogo</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/create">
                <Plus className="mr-2 h-4 w-4" /> Añadir Producto
              </Link>
            </Button>
          </div>

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardContent className="p-4 pt-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Buscar productos..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                  >
                    Tabla
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    Cuadrícula
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table View */}
          {viewMode === "table" && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {/* <TableHead className="w-[80px]">ID</TableHead> */}
                      <TableHead className="w-[80px]">Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="hidden md:table-cell">Descripción</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead className="w-[100px] text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No se encontraron productos.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          {/* <TableCell className="font-medium">{product.id}</TableCell> */}
                          <TableCell>
                            <div className="relative h-10 w-10 overflow-hidden rounded-md">
                              <Image
                                src={product.img}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell className="hidden max-w-xs truncate md:table-cell">
                            {product.description}
                          </TableCell>
                          <TableCell>$ {product.price}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Abrir menú</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push(`dashboard/edit/${product.id}`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => confirmDelete(product.id)}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Products Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <p className="text-muted-foreground">No se encontraron productos.</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <Card key={product.id}>
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.img}
                        alt={product.name}
                        fill
                        className="object-cover transition-all hover:scale-105"
                      />
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="font-medium">{product.price}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between p-4 pt-0">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/editar-producto/${product.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => confirmDelete(product.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600">
          <p>© {new Date().getFullYear()} Tu Empresa. Panel de Administración.</p>
        </div>
      </footer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
