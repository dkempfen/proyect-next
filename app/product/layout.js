"use client";

import { useState, useEffect } from "react";
import { FaLaptop, FaHome, FaTshirt, FaList } from "react-icons/fa";
import { db } from "@/firebase";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import Image from "next/image";
import Swal from "sweetalert2";
import { useCategory } from "@/context/CategoryContext";
import { useCart } from "@/app/carrito/CartContext";
import { auth } from "@/firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import ProductAdd from '../admin/add/ProductAdd';


export default function ProductLayout() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [user, setUser] = useState(null);
 

  const { cart, addToCart, removeFromCart } = useCart(); 
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };


  const categories = [
    { id: "all", name: "Todos", icon: <FaList /> },
    { id: "electronics", name: "Electrónica", icon: <FaLaptop /> },
    { id: "hogar", name: "Hogar", icon: <FaHome /> },
    { id: "moda", name: "Ropa", icon: <FaTshirt /> }
  ];

  const subCategories = {
    moda: ["zapatillas", "sandalias", "Vestido", "short", "Camiseta", "Buzo", "Jeans", "Campera"],
    electronics: ["tablet", "Celular", "Televisor", "CPU", "Parlantes", "auriculares", "Reloj", "Monitor", "Mouse"],
    hogar: ["Cuadro", "Espejo", "sillon", "Silla", "Mesa", "Respaldo", "Banqueta", "Lámpara"]
  };

  const handleCategoryChange = (category) => {
      setSelectedCategory(category);
      setSelectedSubCategory(""); // Resetea la subcategoría al cambiar la categoría
      router.push(`/product?category=${category}`); // Actualiza la URL con la categoría seleccionada
  };

  const handleSubCategoryChange = (subCategory) => {
      setSelectedSubCategory(subCategory);
      router.push(`/product?category=${selectedCategory}&subCategory=${subCategory}`); // Actualiza la URL con la subcategoría seleccionada
  };

  const styles = {
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
      justifyContent: "center",
      padding: "20px",
    },
    productCard: {
      maxWidth: "320px",
      background: "white",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      padding: "15px",
      textAlign: "center",
      transition: "transform 0.3s ease-in-out",
      border: "2px solid transparent", 
    },
    selectedProductCard: {
      border: "2px solid #4CAF50",
      backgroundColor: "#eaf7e5",
      transform: "scale(1.05)",
    },
    productCardHover: {
      transform: "scale(1.05)",
    },
    checkIcon: {
      position: "absolute",
      top: "10px",
      right: "10px",
      color: "#4CAF50",
      fontSize: "24px",
    },
    checkbox: {
      position: "absolute",
      top: "10px",
      left: "10px",
      cursor: "pointer",
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      backgroundColor: "#fff",
      border: "2px solid #ddd",
      transition: "background-color 0.3s, border-color 0.3s",
    },
    checkboxChecked: {
      backgroundColor: "#4CAF50",
      borderColor: "#4CAF50",
      boxShadow: "0 0 5px rgba(0, 255, 0, 0.5)",
    },
    checkboxIcon: {
      fontSize: "20px",
      color: "#fff",
      position: "absolute",
      top: "5px",
      left: "5px",
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);  
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let q;

        if (category && category !== "all") {
          if (subCategory) {
            q = query(
              collection(db, "products"),
              where("filtro", "==", category),
              where("subfiltro", "==", subCategory.toLowerCase()) 
            );
          } else {
            q = query(collection(db, "products"), where("filtro", "==", category));
          }
        } else {
          q = collection(db, "products"); 
        }

        const querySnapshot = await getDocs(q);
        setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, subCategory]);

const toggleDescription = (id) => {
    setExpandedProduct(expandedProduct === id ? null : id);
};



  const handleAddToCart = async (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    const prevQuantity = existingProduct ? existingProduct.quantity : 0;

    const { value: quantity } = await Swal.fire({
      title: `Agregar ${product.name} al carrito`,
      input: "number",
      inputAttributes: { min: 0, step: 1 },
      inputValue: prevQuantity,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (value === "") return "Debes ingresar una cantidad válida.";
        if (value < 0) return "La cantidad no puede ser negativa.";
      },
    });

    if (quantity !== undefined) {
      const parsedQuantity = Number(quantity);

      if (parsedQuantity === 0) {
        removeFromCart(product.id); 
        Swal.fire({
          icon: "info",
          title: "Producto eliminado",
          text: `${product.name} ha sido eliminado del carrito`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        if (existingProduct) {
          addToCart({ ...product, quantity: parsedQuantity });
          Swal.fire({
            icon: "success",
            title: "Cantidad actualizada",
            text: `Cantidad actualizada: ${parsedQuantity}`,
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          addToCart({ ...product, quantity: parsedQuantity });
          Swal.fire({
            icon: "success",
            title: "Producto agregado",
            text: "Producto agregado al carrito",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      }
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prevState => 
      prevState.includes(productId) 
      ? prevState.filter(id => id !== productId) 
      : [...prevState, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedProducts(selectAll ? [] : products.map(product => product.id));
  };

  const handleDeleteSelected = async () => {
    try {
      if (selectedProducts.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Sin selección",
          text: "Por favor, selecciona al menos un producto para eliminar.",
        });
        return;
      }
    
      for (const productId of selectedProducts) {
        const productDoc = doc(db, "products", productId);
        await deleteDoc(productDoc);
      }
    
      Swal.fire({
        icon: "success",
        title: "Productos eliminados",
        text: "Los productos seleccionados han sido eliminados.",
        timer: 1500,
        showConfirmButton: false,
      });
      setSelectedProducts([]); // Reset selected products
    } catch (error) {
      console.error("Error eliminando productos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al eliminar los productos seleccionados. Intenta de nuevo.",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white p-6 shadow-lg border-r border-gray-300 hidden xl:block">
        <h3 className="text-black font-semibold mb-2">Categorías</h3>
        <div className="flex flex-col gap-2">
          {categories.map(({ id, name, icon }) => (
            <div key={id}>
              <button onClick={() => setCategory(category === id ? "" : id)} className={`flex items-center gap-2 p-3 rounded-lg text-left transition-all border-2 w-full 
                  ${category === id ? "bg-blue-600 text-white border-blue-700" : "bg-gray-100 hover:bg-blue-300 text-black border-gray-400"}`} >                   
                  {icon} {name} 
              </button>

              {category === id && subCategories[id] && (
                <div className="mt-2 ml-4">
                  <div className="flex flex-col gap-2">
                    {subCategories[id].map((sub) => (
                      <button key={sub} onClick={() => setSubCategory(subCategory === sub.trim().toLowerCase() ? "" : sub.trim().toLowerCase())} className={`p-2 rounded-lg border border-gray-400 transition-all w-full 
                          ${subCategory === sub.trim().toLowerCase() ? "bg-blue-600 text-white border-blue-700" : "bg-gray-100 hover:bg-blue-300 text-black"}`}>
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-8">
        {user && (
          <div className="mb-4">
            <button onClick={handleSelectAll} className="px-4 py-2 bg-blue-600 text-white rounded-md mr-4">
              {selectAll ? "Deseleccionar Todos" : "Seleccionar Todos"}
            </button>
            <button onClick={handleDeleteSelected} className="px-4 py-2 bg-red-600 text-white rounded-md" disabled={selectedProducts.length === 0}>
              Eliminar seleccionados
            </button>

            <button  onClick={handleOpenModal} className="px-4 py-2 bg-green-600 text-white rounded-md ml-4">
                Agregar Producto
            </button>
          </div>
        )}
        <ProductAdd showModal={showModal} setShowModal={setShowModal} />

        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">Cargando productos...</p>
        ) : (
          <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] justify-center p-5">
            {products.length > 0 ? (
              products.map((product) => {
                const cartItem = cart.find((item) => item.id === product.id);
                const quantity = cartItem ? cartItem.quantity : 0;
                const isSelected = selectedProducts.includes(product.id);
                const isExpanded = expandedProduct === product.id;

                return (
                  <div key={product.id} className={`relative bg-white rounded-lg shadow-lg p-4 text-center transition-transform duration-300 ${isSelected ? "border-2 border-green-500 bg-green-100" : ""}`} >
                         {user && (
                            <div className={`custom-checkbox ${isSelected ? "checked" : ""}`} onClick={() => handleSelectProduct(product.id)}style={{ ...styles.checkbox, ...(isSelected ? styles.checkboxChecked : {}) }} >
                                {isSelected && <span style={styles.checkboxIcon}>✔</span>}
                            </div>
                        )}
                        <Image src={product.image1} alt={product.name} width={288} height={288} className="object-cover rounded-md mb-3 w-full" />
                        <h3 className="font-bold text-lg text-black mb-2 truncate">{product.name}</h3>
                        <p className="text-xl font-semibold text-blue-700">${product.price}</p>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => toggleDescription(product.id)} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition">
                              {expandedProduct === product.id ? "Ocultar" : "Más"}
                          </button>
                          <button onClick={() => handleAddToCart(product)} className={`flex-1 px-4 py-2 rounded-md transition ${quantity > 0 ? "bg-orange-500" : "bg-green-500"} text-white`}>
                              {quantity > 0 ? "Actualizar" : "Agregar"}
                          </button>
                        
                        </div>
                            {expandedProduct === product.id && <p className="mt-3 text-gray-600 text-base">{product.description}</p>}
                   </div>
                );
              })
            ) : (
              <p>No se encontraron productos en esta categoría.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
