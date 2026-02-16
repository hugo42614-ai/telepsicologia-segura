"use client";

import { useState } from "react";

interface HandoverProfessionalProps {
  sessionId: string;
  onRequest?: (sessionId: string) => void;
}

export default function HandoverProfessional({
  sessionId,
  onRequest,
}: HandoverProfessionalProps) {
  const [requested, setRequested] = useState(false);

  function handleClick() {
    setRequested(true);
    onRequest?.(sessionId);
    // TODO: Conectar con backend para notificar al profesional de guardia
  }

  if (requested) {
    return (
      <div className="rounded-lg border-2 border-green-500 bg-green-50 p-4 text-center">
        <p className="font-semibold text-green-800">
          Solicitud enviada
        </p>
        <p className="mt-1 text-sm text-green-700">
          Un profesional se pondrá en contacto contigo lo antes posible.
          Si necesitas ayuda inmediata, llama al{" "}
          <a href="tel:024" className="font-bold underline">
            024
          </a>{" "}
          o al{" "}
          <a href="tel:112" className="font-bold underline">
            112
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="w-full rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-800"
    >
      Quiero hablar con un profesional ahora
    </button>
  );
}
