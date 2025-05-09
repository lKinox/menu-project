"use client"

import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from 'react';
import "./globals.css";

interface Company {
  id: number;
  name: string;
  welcome_text: string;
  about: string;
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [companyName, setCompanyName] = useState<string>('');
  const [welcomeText, setWelcomeText] = useState<string>('');
  const [aboutText, setAboutText] = useState<string>('');

  useEffect(() => {
    const getCompany = async () => {
      try {
        const response = await fetch(`/api/company`);
        if (response.ok) {
          const companies = await response.json();
          if (companies.length > 0) {
            const company = companies[0];
            setCompanyName(company.name || '');
            setWelcomeText(company.welcome_text || '');
            setAboutText(company.about || '');
          }
        } else {
          console.error('No se encontraron productos.');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };
    
    getCompany();
  }, []);

  useEffect(() => {
    document.title = companyName || "Visualisto"; // Cambia el título de forma dinámica si es necesario
    if (aboutText) {
      const descriptionMetaTag = document.querySelector('meta[name="description"]');
      if (descriptionMetaTag) {
        descriptionMetaTag.setAttribute('content', aboutText);
      }
    }
  }, [companyName, aboutText]);

  return (
    <html lang="en">
      <head>
        <meta name="description" content="Menu App Project" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

