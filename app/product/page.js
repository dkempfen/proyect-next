    import PageTitle from "@/components/PageTitle";
    import ProductList from "@/components/ProductList";
    import { collection, getDocs } from "firebase/firestore";
    import { db } from "@/firebase";

    export default async function ProductPage() {
        try {
            const productsRef = collection(db, "products");

            const snapshot = await getDocs(productsRef);

            const products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return (
                <div className="text-black">
                    <PageTitle>Productos</PageTitle>
                    <ProductList productos={products} />
                </div>
            );
        } catch (error) {
            console.error("Failed to fetch products:", error);
            return (
                <>
                    <PageTitle>Error</PageTitle>
                    <p>Failed to load products. Please try again later.</p>
                </>
            );
        }
    }
