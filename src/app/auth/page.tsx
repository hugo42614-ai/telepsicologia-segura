'use client';

import React from 'react';
import { signInWithGoogle } from '@/lib/auth-service';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Activa la cerradura real de Google
      await signInWithGoogle();
      router.push('/chat'); 
    } catch (error) {
      console.error("Error de acceso:", error);
      alert("No se pudo verificar la identidad. Intenta de nuevo.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Identidad Verificada</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Para garantizar la seguridad sanitaria y la privacidad de tu sesión, por favor inicia sesión con Google.
        </p>
        <button 
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-md transform hover:scale-105"
        >
          Continuar con Google
        </button>
        <p className="mt-6 text-[10px] text-slate-400 uppercase tracking-widest">
          Infraestructura Segura — Principio 5
        </p>
      </div>
    </main>
  );
}
