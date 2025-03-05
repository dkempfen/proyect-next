import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';

function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-10">
            <div className="container mx-auto px-6">
                <div className="flex flex-wrap justify-between">
                    <div className="w-full md:w-1/4 mb-6 md:mb-0">
                        <h5 className="uppercase font-bold mb-4">Contáctenos</h5>
                        <ul className="list-none space-y-2">
                            <li>
                                <Link href="mailto:info@digitalshop.com" className="text-gray-400 hover:text-white transition-colors">
                                    GlobalGoods@GlobalShop.com
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="w-full md:w-1/4 mb-6 md:mb-0">
                        <h5 className="uppercase font-bold mb-4">Síguenos</h5>
                        <ul className="list-none flex space-x-4">
                            <li>
                                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors text-2xl">
                                    <FaFacebookF />
                                </Link>
                            </li>
                            <li>
                                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors text-2xl">
                                    <FaTwitter />
                                </Link>
                            </li>
                            <li>
                                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors text-2xl">
                                    <FaInstagram />
                                </Link>
                            </li>
                            <li>
                                <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-white transition-colors text-2xl">
                                    <FaYoutube />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="w-full md:w-1/4 md:ml-6">
                        <h5 className="uppercase font-bold mb-4">Sobre Nosotros</h5>
                        <p className="text-gray-400">
                            Somos una plataforma de comercio electrónico líder que ofrece una amplia gama de productos a nuestros clientes.
                        </p>
                    </div>
                </div>

                <div className="text-center mt-8 text-gray-500 text-sm">
                    <p>&copy; 2025 GlobalGoods. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
