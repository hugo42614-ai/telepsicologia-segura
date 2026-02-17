'use client'; // Necesario para que el botón funcione

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    // Redirige a la página de autenticación/registro
    router.push('/auth'); 
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Telepsicología Segura
          </h1>
          <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
        </header>

        <section className="space-y-6 text-center">
          <p className="text-2xl text-slate-700 italic font-light leading-relaxed">
            "Tu espacio seguro, donde la tecnología cuida tu humanidad."
          </p>
          
          <blockquote className="border-l-4 border-blue-200 pl-6 py-2 text-left text-slate-600 italic">
            "No necesitas ver toda la escalera para dar el primer paso. Aquí, tu voz es privada, tu proceso está protegido y tu bienestar es nuestra única brújula."
          </blockquote>
        </section>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <h3 className="font-semibold text-blue-900 mb-2">Privacidad Absoluta</h3>
            <p className="text-xs text-blue-800/80">Palabras blindadas con cifrado de grado médico.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <h3 className="font-semibold text-green-900 mb-2">Seguridad 24/7</h3>
            <p className="text-xs text-green-800/80">Crisis Guard activo para proteger tu integridad.</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <h3 className="font-semibold text-purple-900 mb-2">Ética Humana</h3>
            <p className="text-xs text-purple-800/80">Transparencia total en el manejo de tu información.</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          {/* BOTÓN CONECTADO */}
          <button 
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg"
          >
            Iniciar Sesión Segura
          </button>
          <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest">
            Al continuar, aceptas nuestro Consentimiento Informado (Principio 1).
          </p>
        </div>

      </div>
      
      <footer className="mt-8 text-slate-400 text-xs">
        © 2026 Telepsicología Segura — Tecnología al servicio de la Salud Mental
      </footer>
    </main>
  );
}