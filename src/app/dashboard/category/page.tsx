"use client"

import { useEffect, useState } from 'react';
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Plus, Asterisk, MoreVertical, Edit, Trash} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { showToast } from "nextjs-toast-notify";

interface Category {
    id: string;
    name: string;
}

export default function CategoryPage() {
    const router = useRouter()
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
    const [category, setCategory] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

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

    const addCategory = () => {
        setIsCategoryDialogOpen(true)
    }

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

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('category', category);

        try {
            const response = await fetch('/api/category', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setCategory('');  // Limpiar el campo de entrada
                setIsCategoryDialogOpen(false);
                fetchCategory();  // Recargar la lista de categorías

                showToast.success('¡Categoría creada correctamente!', {
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
    };

    const deleteCategory = async (id: string) => {
        try {
            const response = await fetch(`/api/category/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCategories(categories.filter(category => category.id !== id)); // Eliminar de la lista local

                showToast.success('¡Categoría eliminada correctamente!', {
                    duration: 4000,
                    progress: false,
                    position: "top-left",
                    transition: "popUp",
                    icon: '',
                    sound: false,
                });
            } else {
                console.error('Error al eliminar la categoría:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud de eliminación:', error);
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
                        <h2 className="text-2xl font-bold">Categorías</h2>
                        <p className="text-muted-foreground">Añade categorías para clasificar tus productos.</p>
                        </div>
                        <Button onClick={() => addCategory()}>
                            <Plus className="mr-2 h-4 w-4" /> Añadir Categoría
                        </Button>
                    </div>

                    <Card className="mb-8">
                        <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {/* <TableHead className="w-[80px]">ID</TableHead> */}
                                    <TableHead>Nombre</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                    No se encontraron categorías.
                                    </TableCell>
                                </TableRow>
                                ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        {/* <TableCell className="font-medium">{product.id}</TableCell> */}
                                        <TableCell>{category.name}</TableCell>
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
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => deleteCategory(category.id)}
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

                </div>
            </main>


            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Añadir Categoría</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="category">
                                Nombre de la categoría: 
                                <Asterisk className="mr-1 h-3 w-4" color="#ff0000" />
                            </Label>
                            <Input
                                id="category"
                                name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Ingrese el nombre de la categoría"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">
                                Añadir
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
                </Dialog>

        </div>
    )
} 