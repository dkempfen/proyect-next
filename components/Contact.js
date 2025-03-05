"use client"; 

import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";  

const Contact = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const templateParams = {
            name: formData.name,
            email: formData.email,
            message: formData.message,
        };

        emailjs.send(
            "service_5xbxdcd",  //  Service ID
            "template_u4zy4bp", //  Template ID
            templateParams,
            "BrEmTJIZxIFtlMUcJ"   // Public Key de Email.js
        )
        .then(() => {
            Swal.fire({
                icon: "success",
                title: "Mensaje enviado",
                text: "Tu mensaje ha sido enviado correctamente.",
            });
            setFormData({ name: "", email: "", message: "" });
        })
        .catch((error) => {
            console.error("Error al enviar:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al enviar el mensaje.",
            });
        });
    };

    return (
        <div className="bg-black p-5 rounded-lg shadow-2xl text-yellow-500 font-sans">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-1">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 rounded-md border-none shadow-lg"
                    />
                </div>
                
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 rounded-md border-none shadow-lg"
                    />
                </div>
                
                <div className="mb-4">
                    <label htmlFor="message" className="block mb-1 text-yellow-500">Mensaje:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full p-2 rounded-md border-none shadow-lg text-black"
                    ></textarea>
                </div>
                
                <button
                    type="submit"
                    className="bg-yellow-500 text-black p-2 rounded-md border-none shadow-lg cursor-pointer"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
};


export default Contact;

