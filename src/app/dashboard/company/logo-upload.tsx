"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface LogoUploadProps {
  onLogoChange: (fileOrUrl: File | string | null) => void; // Cambiamos el tipo para aceptar File o string (URL)
  initialImage?: string;
}

export function LogoUpload({ onLogoChange, initialImage }: LogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(initialImage || null);
  }, [initialImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onLogoChange(file); // Pasamos el File cuando se selecciona uno nuevo
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(initialImage || null); // Mantenemos la imagen inicial si no se selecciona nada
      onLogoChange(initialImage || null); // Pasamos la URL inicial si no hay nuevo archivo
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {preview ? (
        <div className="relative w-full max-w-[200px]">
          <img
            src={preview}
            alt="Logo preview"
            className="w-full h-auto object-contain border rounded-md"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Eliminar logo</span>
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Haga clic para subir su logo o arrastre y suelte aquí</p>
          <p className="mt-1 text-xs text-muted-foreground">PNG, JPG o SVG (máx. 5MB)</p>
        </div>
      )}

      {!preview && (
        <Button type="button" variant="outline" onClick={handleClick} className="w-full">
          Seleccionar Logo
        </Button>
      )}
    </div>
  );
}