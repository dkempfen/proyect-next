import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { productos } from "@/assets/products";

export async function migrateProducts() {
    // 1. Obtener referencia de la DB (variable db)
    // 2. Obtener referencia de la colección de productos (variable productsCollection)
    const productsCollection = collection(db, "products");

    // Iterar sobre cada producto en el array de productos
    for (const product of productos) {
        try {
            // 3. Verificar si el producto ya existe en la base de datos
            const q = query(productsCollection, where("id", "==", product.id)); // Aquí puedes usar el "id" o cualquier otro campo único
            const querySnapshot = await getDocs(q);

            // Si el producto ya existe, no insertarlo
            if (!querySnapshot.empty) {
                console.log(`El producto con ID ${product.id} ya existe. No se insertará.`);
                continue; // Salta al siguiente producto
            }

            // Si no existe, insertar el producto
            await addDoc(productsCollection, product);
            console.log("Producto agregado: ", product.id);
        } catch (error) {
            console.error("Error al agregar el producto: ", error);
        }
    }
}
