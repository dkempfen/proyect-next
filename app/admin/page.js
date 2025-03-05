"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";


const AdminPage = () => {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("welcome") === "true") {
      setShowWelcome(true);
      setTimeout(() => {
        router.push("/admin"); 
      }, 3000); 
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-6">
      <div className="w-full max-w-md bg-white p-8 shadow-2xl rounded-2xl">
        {showWelcome && (
          <div className="fadeInAndSlideUp animation duration-500 ease-in-out">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
              ¡Bienvenido de nuevo! 🎉
            </h1>
            <p className="text-lg text-center text-gray-600">¡Estamos listos para empezar!</p>
          </div>
        )}
        <p className="text-lg text-center text-gray-600">¡Esta es la página de administración!</p>
      </div>
    </div>
  );
};

export default AdminPage;
