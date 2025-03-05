"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CartProvider } from "@/app/carrito/CartContext"; 
import { AuthProvider } from "@/context/AuthContext"; // Importar AuthProvider
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import { metadata } from "@/app/metadata"; 

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="author" content={metadata.author} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="viewport" content={metadata.viewport} />
      </head>
      <body className="bg-background min-h-screen flex flex-col">
        <AuthProvider> 
          <CartProvider> 
            <Header />
            <main className="grow p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
