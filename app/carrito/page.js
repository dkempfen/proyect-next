    "use client";

    import { useCart } from "@/app/carrito/CartContext";
    import Swal from "sweetalert2";
    import Image from "next/image";
    import { useState, useEffect } from "react";
    import creditCardType from "credit-card-type";
    import jsPDF from "jspdf";
    import JsBarcode from "jsbarcode";
    import { db } from "@/firebase"; 
    import { addDoc, collection } from "firebase/firestore";
    import { useRouter } from "next/navigation";


    export default function Carrito() {
    const router = useRouter(); 
    const {cart, addToCart, removeFromCart,updateCart, clearCart } = useCart();
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [buyAll, setBuyAll] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        direccion: "",
        codigoPostal: "",
        ciudad: "",
        telefono: "",
        email: "",
        metodoPago: "",
        documento: "",
        tarjetaNumero: "",
        tarjetaNombre: "",
        tarjetaVencimientoMes: "",
        tarjetaVencimientoAnio: "",
        tarjetaCVV: "",
        cuotas: "1",
        tarjetaTipo: "",
    });

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem("formData"));
        if (savedData) {
        setFormData(savedData);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("formData", JSON.stringify(formData));
    }, [formData]);

    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        setFormData({ ...formData, [name]: value });
    };
    
    const handleCardNumberChange = (e) => {
        const { value } = e.target;
    
        if (value === '') {
            setFormData({
                ...formData,
                tarjetaNumero: value,
                tarjetaTipo: '', 
                tarjetaModalidad: '', 
                cuotas: "1", 
            });
        } else {
            const cardType = creditCardType(value)[0]?.type || ''; 
            const cardModality = getCardModality(value); 
    
            setFormData({
                ...formData,
                tarjetaNumero: value,
                tarjetaTipo: cardType,
                tarjetaModalidad: cardModality,
                cuotas: cardModality === 'Débito' ? '1' : formData.cuotas, // Si es débito, no permitir cuotas
            });
        }
    };

    const getCardModalityFromAPI = async (cardNumber) => {
        const bin = cardNumber.slice(0, 6); 
        try {
            const response = await fetch(`https://lookup.binlist.net/${bin}`);
            const data = await response.json();
    
            if (data.scheme && data.type) {
                const cardType = data.scheme; 
                const cardModality = data.type === 'debit' ? 'Débito' : 'Crédito';
                return cardModality;
            }
    
            return 'Desconocido';
        } catch (error) {
            console.error('Error al obtener los detalles de la tarjeta:', error);
            return 'Desconocido';
        }
    };
      
    const handleCardNumberChangeNew = (e) => {
        const { value } = e.target;
        const cardType = creditCardType(value)[0]?.type; 
        const cardModality = getCardModality(value); 
      
        setFormData({
          ...formData,
          tarjetaNumero: value,
          tarjetaTipo: cardType,
          tarjetaModalidad: cardModality
        });
      };
    
      const getCardDetails = async (cardNumber) => {
        const bin = cardNumber.slice(0, 6); 
        try {
          const response = await fetch(`https://lookup.binlist.net/${bin}`);
          const data = await response.json();
          
          if (data.scheme) {
            const cardType = data.scheme; 
            const cardModality = data.type === 'debit' ? 'Débito' : 'Crédito';
            return { cardType, cardModality };
          }
          
          return { cardType: 'Desconocido', cardModality: 'Desconocido' };
        } catch (error) {
          console.error('Error al obtener los detalles de la tarjeta:', error);
          return { cardType: 'Error', cardModality: 'Error' };
        }
      };
      
    const getCardModality = (cardNumber) => {
        const debitCards = ['4026', '4508', '4844', '4913']; 
        const firstFourDigits = cardNumber.substring(0, 4);
      
        if (debitCards.includes(firstFourDigits)) {
          return 'Débito';
        }
        return 'Crédito';
    };      

    const getCardInfo = async (cardNumber) => {
        try {
          const response = await fetch(`https://lookup.binlist.net/${cardNumber}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          });
      
          if (!response.ok) {
            throw new Error('Error al obtener información de la tarjeta');
          }
                const data = await response.json();
      
          if (data.scheme && data.type) {
            const cardType = data.scheme; 
            const cardModalidad = data.type === 'debit' ? 'Débito' : 'Crédito'; 
            console.log(`Tipo de tarjeta: ${cardType}`);
            console.log(`Modalidad: ${cardModalidad}`);
      
            setFormData({
              ...formData,
              tarjetaTipo: cardType,
              tarjetaModalidad: cardModalidad
            });
          } else {
            console.log('No se pudo obtener información de la tarjeta.');
          }
        } catch (error) {
          console.error('Error al obtener la información:', error);
        }
      };
    

    const handleBuyClick = (product) => {
        setSelectedProduct([product]);
        setBuyAll(false);
        setShowModal(true);
    };

    const handleBuyAll = () => {
        setSelectedProduct(cart);
        setBuyAll(true);
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowModal(false);
        setShowPayment(true);
    };

    const handlePaymentMethod = (method) => {
        setPaymentMethod(method);
    };
    const isCardValid =
    formData.documento &&
    formData.tarjetaNumero &&
    formData.tarjetaNombre &&
    formData.tarjetaVencimientoMes &&
    formData.tarjetaVencimientoAnio &&
    formData.tarjetaCVV &&
    formData.cuotas;


    const handleBackToPersonalData = () => {
        setShowPayment(false);
        setShowModal(true);
    };

    const handleExit = () => {
        setShowModal(false);
        setShowPayment(false);
    };


    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;
      
        const updatedCart = cart.map((product) =>
          product.id === id ? { ...product, quantity: newQuantity } : product
        );
      
        updateCart(updatedCart); 
    };

    const handleDownloadPDF = async () => {
        try {
            const doc = new jsPDF();
            doc.text("Detalles de Compra", 20, 20);
            doc.text(`Nombre: ${formData.nombre} ${formData.apellido}`, 20, 30);
            doc.text(`Email: ${formData.email}`, 20, 40);
            doc.text("Productos Comprados:", 20, 50);
            
            cart.forEach((product, index) => {
                doc.text(`${index + 1}. ${product.name} - $${product.price}`, 20, 60 + index * 10);
            });
    
            doc.save("compra.pdf");
    
            await addDoc(collection(db, "pagos"), {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                productos: cart.map(product => ({
                    nombre: product.name,
                    precio: product.price
                })),
                fecha: new Date().toISOString()
            });
    
            Swal.fire({
                title: "Pago realizado",
                text: "Tu pago ha sido registrado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            });
    
        } catch (error) {
            console.error("Error al registrar el pago:", error);
            
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al registrar el pago.",
                icon: "error",
                confirmButtonText: "Intentar de nuevo"
            });
        }
    };
    return (
        <div className="min-h-screen bg-gray-100 p-8 text-black">
        <h1 className="text-3xl font-bold text-center mb-8">🛒 Carrito de Compras</h1>
        {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <Image 
                src="/assets/imagen_carrito.jpg"  
                width={250} 
                height={250} 
                alt="Carrito vacío y feliz" 
            />
            <p className="mt-4 text-xl font-semibold text-gray-700">
                ¡Oops! Tu carrito está vacío 🛒💨
            </p>
            <p className="text-gray-500">¿No sabes qué comprar? ¡Explora nuestros productos!</p>
            <button 
                onClick={() => router.push('/product')} 
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
            >
                🔍 Ver productos
            </button>
        </div>
        
        ) : (
            <div>
                
                <div>
                    <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Productos seleccionados: {cart.reduce((acc, product) => acc + product.quantity, 0)}</h2>
                        <h2 className="text-lg font-semibold text-gray-900">Total a pagar: ${cart.reduce((acc, product) => acc + product.quantity * product.price, 0)}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {cart.map((product) => (
                            <div key={product.id} className="p-5 bg-white rounded-2xl shadow-lg flex flex-col items-center border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                                <Image src={product.image1} alt={product.name} width={180} height={180} className="object-cover rounded-lg mb-4" />
                                <h3 className="font-semibold text-lg text-gray-900 mb-1">{product.name}</h3>
                                <p className="text-xl font-semibold text-blue-700 mb-2">${product.price * product.quantity}</p>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleQuantityChange(product.id, product.quantity - 1)} 
                                        className="px-2 py-1 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all"
                                        disabled={product.quantity <= 1}
                                    >
                                        ➖
                                    </button>
                                    <span className="text-sm text-gray-700">{product.quantity}</span>
                                    <button 
                                        onClick={() => handleQuantityChange(product.id, product.quantity + 1)} 
                                        className="px-2 py-1 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-all"
                                    >
                                        ➕
                                    </button>
                                </div>

                                <div className="flex gap-4 mt-2">
                                    <button 
                                        onClick={() => handleBuyClick(product)} 
                                        className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 hover:scale-105 transition-all ease-in-out duration-200"
                                    >
                                        🛒 Comprar
                                    </button>
                                    <button 
                                        onClick={() => removeFromCart(product.id)} 
                                        className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 hover:scale-105 transition-all ease-in-out duration-200"
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    <button 
                        onClick={handleBuyAll} 
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:scale-105 transition-transform ease-in-out duration-200 flex items-center gap-2"
                    >
                        🛍️ <span>Comprar Todo</span>
                    </button>
                    <button 
                        onClick={clearCart} 
                        className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 hover:scale-105 transition-transform ease-in-out duration-200 flex items-center gap-2"
                    >
                        🗑️ <span>Vaciar Carrito</span>
                    </button>
                </div>

            </div>
        )}

        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-black">
                <h2 className="text-2xl font-bold mb-4">Datos Personales</h2>
                <form onSubmit={handleSubmit}>
                <input type="text" name="nombre" onChange={handleInputChange} value={formData.nombre} required placeholder="Nombre" className="w-full p-2 border rounded mt-2" />
                <input type="text" name="apellido" onChange={handleInputChange} value={formData.apellido} required placeholder="Apellido" className="w-full p-2 border rounded mt-2" />
                <input type="text" name="direccion" onChange={handleInputChange} value={formData.direccion} required placeholder="Dirección" className="w-full p-2 border rounded mt-2" />
                <input type="text" name="codigoPostal" onChange={handleInputChange} value={formData.codigoPostal} required placeholder="Código Postal" className="w-full p-2 border rounded mt-2" />
                <input type="text" name="ciudad" onChange={handleInputChange} value={formData.ciudad} required placeholder="Ciudad" className="w-full p-2 border rounded mt-2" />
                <input type="text" name="telefono" onChange={handleInputChange} value={formData.telefono} required placeholder="Teléfono" className="w-full p-2 border rounded mt-2" />
                <input type="email" name="email" onChange={handleInputChange} value={formData.email} required placeholder="Email" className="w-full p-2 border rounded mt-2" />
                <div className="mt-4 flex gap-4">
                  
                    <button 
                        onClick={handleExit} 
                        className="w-1/2 p-3 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Salir
                    </button>
                    <button 
                        type="submit" 
                        className="w-1/2 p-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Continuar
                    </button>
                    
                </div>
                </form>
            </div>
            </div>
        )}

        {showPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-black">
                <h2 className="text-2xl font-bold mb-4">Selecciona tu Método de Pago</h2>
                <button onClick={() => handlePaymentMethod("efectivo")} className="w-full p-2 bg-gray-300 rounded mt-2">Efectivo</button>
                <button onClick={() => handlePaymentMethod("transferencia")} className="w-full p-2 bg-gray-300 rounded mt-2">Transferencia</button>
                <button onClick={() => handlePaymentMethod("tarjeta")} className="w-full p-2 bg-gray-300 rounded mt-2">Tarjeta</button>

                {paymentMethod === "efectivo" && (
                <button onClick={handleDownloadPDF} className="mt-4 w-full p-2 bg-green-500 text-white rounded">Descargar PDF</button>
                )}

                {paymentMethod === "transferencia" && (
                <div className="mt-4">
                    <p>CBU: 123-45678901234</p>
                    <p>Alias: ejemplo.alias</p>
                </div>
                )}

                {paymentMethod === "tarjeta" && (
                <div className="mt-4">
                    <h3 className="text-xl font-bold mb-2">Datos de la Tarjeta</h3>
                    <input
                    type="text"
                    name="documento"
                    onChange={handleInputChange}
                    value={formData.documento}
                    required
                    placeholder="Documento"
                    className="w-full p-2 border rounded mt-2"
                    />
                    <input
                    type="text"
                    name="tarjetaNumero"
                    onChange={handleCardNumberChange}  
                    value={formData.tarjetaNumero}
                    required
                    placeholder="Número de Tarjeta"
                    className="w-full p-2 border rounded mt-2"
                    />
                    
                    {formData.tarjetaTipo && formData.tarjetaModalidad && (
                    <div className="mt-2">
                        <p><strong>Tipo de Tarjeta:</strong> {formData.tarjetaTipo}</p>
                        <p><strong>Modalidad:</strong> {formData.tarjetaModalidad}</p>
                    </div>
                    )}

                    <input
                    type="text"
                    name="tarjetaNombre"
                    onChange={handleInputChange}
                    value={formData.tarjetaNombre}
                    required
                    placeholder="Nombre en la Tarjeta"
                    className="w-full p-2 border rounded mt-2"
                    />

                    <div className="flex gap-2">
                    <input
                        type="text"
                        name="tarjetaVencimientoMes"
                        onChange={handleInputChange}
                        value={formData.tarjetaVencimientoMes}
                        required
                        placeholder="MM"
                        className="w-1/2 p-2 border rounded mt-2"
                    />
                    <input
                        type="text"
                        name="tarjetaVencimientoAnio"
                        onChange={handleInputChange}
                        value={formData.tarjetaVencimientoAnio}
                        required
                        placeholder="AA"
                        className="w-1/2 p-2 border rounded mt-2"
                    />
                    </div>

                    <input
                    type="text"
                    name="tarjetaCVV"
                    onChange={handleInputChange}
                    value={formData.tarjetaCVV}
                    required
                    placeholder="CVV"
                    className="w-full p-2 border rounded mt-2"
                    />

                    <label className="block mt-2">Cuotas:</label>
                    <select
                        name="cuotas"
                        onChange={handleInputChange}
                        value={formData.cuotas}
                        className="w-full p-2 border rounded mt-1"
                        disabled={formData.tarjetaModalidad === 'Débito'} 
                    >
                        <option value="1">1 cuota</option>
                        <option value="3">3 cuotas</option>
                        <option value="6">6 cuotas</option>
                        <option value="12">12 cuotas</option>
                    </select>

                    <button onClick={handleDownloadPDF} className="mt-4 w-full p-2 bg-green-500 text-white rounded">
                    Confirmar Pago
                    </button>
                </div>
                )}

         

                <div className="mt-4 flex gap-4">
                    <button
                        onClick={handleBackToPersonalData}
                        className="w-1/2 p-3 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Atrás
                    </button>
                    <button
                        onClick={handleExit}
                        className="w-1/2 p-3 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Salir
                    </button>
                </div>


            </div>
            </div>
        )}
        </div>
    );

}


