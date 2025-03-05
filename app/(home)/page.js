"use client";

import { migrateProducts } from "@/actions/migrateProducts";
import Head from "next/head";
import { useRouter } from "next/navigation";


async function HomePage() {
    const router = useRouter(); 

    migrateProducts()
    return (
        <>
        {/* Agrega el componente Head para definir los metadatos */}
        <Head>
            <title>Bienvenidos a nuestra tienda</title>
            <meta name="description" content="Explora nuestra tienda y encuentra lo que necesitas. Gran variedad de productos disponibles." />
            <meta name="keywords" content="tienda, productos, comprar, tienda en línea" /> 
            <meta name="author" content="GlobalGoods" /> 
            <meta property="og:title" content="Bienvenidos a nuestra tienda" /> 
            <meta property="og:description" content="Explora nuestra tienda y encuentra lo que necesitas." /> 
            <meta property="og:image" content="/path/to/your-image.jpg" /> 
            <meta property="og:url" content="https://tusitio.com" /> 
            <meta name="viewport" content="width=device-width, initial-scale=1" /> 
        </Head>

        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.heading}>Bienvenidos!</h1>
                <p style={styles.paragraph}>Explora nuestra tienda y encuentra lo que necesitas</p>
                <button onClick={() => router.push('/product')} style={styles.button}>Comienza ahora</button>
            </div>
        </div>
    </>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
    },
    content: {
        textAlign: 'center',
        backgroundColor: '#fff',
        padding: '50px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        fontSize: '2.5em',
        color: '#333',
        marginBottom: '20px',
    },
    paragraph: {
        fontSize: '1.2em',
        color: '#666',
        marginBottom: '30px',
    },
    button: {
        fontSize: '1em',
        color: '#fff',
        backgroundColor: '#0070f3',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    buttonHover: {
        backgroundColor: '#005bb5',
    },
};

export default HomePage;