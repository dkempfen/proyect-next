import { useState } from "react";

const ProductAdd = ({ showModal, setShowModal }) => {
  const [newProduct, setNewProduct] = useState({
    id: "",
    filtro: "",
    subfiltro: "",
    name: "",
    type: "",
    image1: "",
    image2: "",
    category: "",
    place: "",
    description: "",
    features: [{ measures: "" }, { weight: "" }],
    price: "",
    product: "",
  });

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProduct = () => {
    console.log("Producto agregado:", newProduct);
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-black">Agregar Producto</h2>

            <input type="text"name="name" placeholder="Nombre"value={newProduct.name} onChange={handleChange}className="w-full mb-2 p-2 border rounded-md  text-black"/>
            <input type="text" name="type" placeholder="Tipo" value={newProduct.type} onChange={handleChange} className="w-full mb-2 p-2 border rounded-md  text-black" />
            <input type="text" name="category" placeholder="Categoría" value={newProduct.category} onChange={handleChange} className="w-full mb-2 p-2 border rounded-md  text-black" />
            <input type="text" name="price" placeholder="Precio" value={newProduct.price} onChange={handleChange} className="w-full mb-2 p-2 border rounded-md  text-black" />

            <div className="flex justify-end mt-4">
                <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-400 text-white rounded-md mr-2">
                Cancelar
                </button>
                <button onClick={handleSaveProduct} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                Guardar
                </button>
            </div>
            </div>
        </div>
        )}

    </>
  );
};

export default ProductAdd;
