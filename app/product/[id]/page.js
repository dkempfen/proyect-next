import PageTitle from "@/components/PageTitle";
import Link from "next/link";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function ProductDetailsPage({ params }) {
    const { id } = params;

    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return (
            <>
                <PageTitle>Producto no encontrado</PageTitle>
                <p>El producto con ID {id} no existe, intentalo de nuevo</p>
                <Link href="/product">Volver a productos</Link>
            </>
        );
    }

    const productDetail = docSnap.data();

    return (
        <>
            <PageTitle>Detalle del producto {productDetail.name}</PageTitle>
            <p>Descripción: {productDetail.description}</p>
            <p>Precio: ${productDetail.price}</p>
            <p>Tipo: {productDetail.type}</p>
            <img src={productDetail.image1} alt={productDetail.name} width={300} />
        </>
    );
}
