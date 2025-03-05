"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Box, Tag, Star, Percent, Globe, Mail, LogIn, Menu, X, User } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"; 
import { useCart } from "@/app/carrito/CartContext"; 
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase"; 

function Header() {
  const { getTotalItems } = useCart(); 
  const totalItems = getTotalItems(); 
  const { user, logout } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { href: "/product", icon: <Box />, label: "Productos" },
    { href: "/categories", icon: <Tag />, label: "Categorías" },
    { href: "/bestsellers", icon: <Star />, label: "Más Vendidos" },
    { href: "/offers", icon: <Percent />, label: "Ofertas" },
    { href: "/international", icon: <Globe />, label: "Compra Int." },
    { href: "/contact", icon: <Mail />, label: "Contacto" },
    { href: "../carrito", icon: <ShoppingCart />, label: `Carrito (${totalItems})` },
    !user && { href: "/login", icon: <LogIn />, label: "Login" },
  ].filter(Boolean);

  const handleLogout = async () => {
    try {
        await signOut(auth);  
        console.log("Usuario cerrado sesión exitosamente");
    } catch (error) {
        console.error("Error al cerrar sesión", error);
    }
};

  return (
    <header className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
      <div className="flex justify-between items-center">
        <Link href="/">
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-wide text-white hover:text-yellow-300 transition-transform transform hover:scale-105">
            GlobalGoods
          </h1>
        </Link>

        {/* Menú para pantallas mayores a 1536px */}
        
        <nav className="hidden 2xl:flex gap-6 items-center">
          {menuItems.map(({ href, icon, label }) => (
            <Link key={href} href={href} className="flex items-center gap-2 text-white hover:text-yellow-400">
              {icon}
              {label}
            </Link>
          ))}

          {user ? (
            <div className="relative">
              <div className="flex items-center gap-4 text-white">
                <div className="flex flex-col text-right">
                  <p className="text-sm font-semibold">{user.firstName} {user.lastName}</p>
                </div>

                <div className="relative cursor-pointer hover:scale-110 transition-transform duration-300" onClick={() => setIsOpen(!isOpen)}>
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Perfil"
                      className="w-14 h-14 rounded-full object-cover border-2 border-transparent hover:border-yellow-400 shadow-lg" 
                    />
                  ) : (
                    <User className="w-10 h-10 text-white bg-gray-500 rounded-full p-2 border-2 border-transparent hover:border-yellow-400 shadow-lg" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-52 bg-gray-900 bg-opacity-90 backdrop-blur-md text-white rounded-lg shadow-xl overflow-hidden"
                  >
                    <div className="px-4 py-3">
                      <p className="text-base text-gray-200">{user.email}</p>
                      <button className="block w-full text-left px-4 py-3 hover:bg-gray-800 transition-all">
                        📸 Cambiar foto
                      </button>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-3 hover:bg-red-600 transition-all">
                        🚪 Cerrar sesión
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login" className="text-white hover:text-yellow-300">
              Login
            </Link>
          )}
        </nav>

        <button className="block 2xl:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {menuOpen && (
  <nav className="2xl:hidden grid grid-cols-2 gap-4 bg-blue-700 p-6 rounded-lg mt-2">
    {menuItems.map(({ href, icon, label }) => (
      <Link
        key={href}
        href={href}
        className="flex flex-col items-center text-white bg-yellow-500 p-6 rounded-lg shadow-md hover:bg-yellow-600 transition-all"
        onClick={() => setMenuOpen(false)} 
      >
        <div className="text-3xl">{icon}</div> 
        <span className="text-lg">{label}</span> 
      </Link>
    ))}
    
    {user ? (
      <div className="flex justify-center items-center relative">
        <div className="flex flex-col items-center gap-6 text-white">
          <p className="text-4xl font-semibold">{user.firstName} {user.lastName}</p> 
          
          <div className="relative cursor-pointer hover:scale-110 transition-transform duration-300" onClick={() => setIsOpen(!isOpen)}>
            {user.profileImage ? (
              <img  src={user.profileImage} alt="Perfil" className="w-24 h-24 rounded-full object-cover border-4 border-transparent hover:border-yellow-400 shadow-lg transition-all"
              />
            ) : (
              <User className="w-20 h-20 text-white bg-gray-600 rounded-full p-5 border-4 border-transparent hover:border-yellow-400 shadow-lg transition-all" />
            )}
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute top-full mt-4 w-80 bg-gray-800 bg-opacity-90 backdrop-blur-md text-white rounded-lg shadow-2xl overflow-hidden z-50"
              >
                <div className="px-6 py-4 space-y-4">
                  <p className="text-2xl text-gray-300">{user.email}</p> 
                  <button className="block w-full text-left px-6 py-4 text-lg hover:bg-gray-700 transition-all rounded-lg">
                    📸 Cambiar foto
                  </button>
                  <button onClick={handleLogout} className="block w-full text-left px-6 py-4 text-lg hover:bg-red-600 transition-all rounded-lg">
                    🚪 Cerrar sesión
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      ) : (
        <Link href="/login" className="text-white hover:text-yellow-300 text-lg">
          Login
        </Link>
      )}


  </nav>
)}

  </header>
  );
}

export default Header;
