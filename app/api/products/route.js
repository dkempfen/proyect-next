import { db } from "@/firebase"
import { collection, getDocs, where, query } from "firebase/firestore"
import { NextResponse } from "next/server"


export async function GET(request) {

    const searchParams = request.nextUrl.searchParams
    const categoria = searchParams.get("categoria")
    const filtro = searchParams.get("filtro"); 

    const productsCollection = collection(db, "products")

    try {
        let consulta;

        if (categoria && filtro) {
            consulta = query(productsCollection, where("category", "==", categoria), where("filtro", "==", filtro));
        } else if (categoria) {
            consulta = query(productsCollection, where("category", "==", categoria));
        } else if (filtro) {
            consulta = query(productsCollection, where("filtro", "==", filtro));
        } else {
            consulta = productsCollection;
        }

        const snapshot = await getDocs(consulta);

        const productosFinales = snapshot.docs.map((documentRef) => {
            const id = documentRef.id;
            const productoData = documentRef.data();
            productoData.id = id;
            return productoData;
        });

        return NextResponse.json({
            message: "Productos obtenidos con éxito",
            error: false,
            payload: productosFinales,
        });

    } catch (error) {
        return NextResponse.json({
            message: "Error al obtener los productos",
            error: true,
            payload: null,
        });
    }
}


export async function POST(req) {

    console.log("POST")

    console.log(await req.json())

    return NextResponse.json({ message: "POST" })
}