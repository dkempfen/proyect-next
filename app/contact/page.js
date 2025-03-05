import Contact from "@/components/Contact";

export const metadata = {
    title: "Contacto - ecommerce-platform",
    description: "Ponte en contacto con nosotros para cualquier consulta o soporte.",
};

export default function ContactPage() {
    return (
        <div className="max-w-3xl mx-auto p-8 shadow-md rounded-lg">
            <h1 className="text-5xl font-extrabold text-center text-blue-600 mb-6">Contáctanos</h1>
            <p className="text-xl text-center text-white-600 mb-8">Estamos aquí para ayudarte. Completa el formulario a continuación y nos pondremos en contacto contigo lo antes posible.</p>
            <Contact />
        </div>
    );
}