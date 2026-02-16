"use client";

import { useEffect, useRef } from "react";

interface CrisisMessageProps {
  open: boolean;
  onClose: () => void;
}

const EMERGENCY_CONTACTS = [
  { name: "Teléfono de la Esperanza", number: "717 003 717", available: "24h" },
  { name: "Emergencias", number: "112", available: "24h" },
  { name: "Teléfono contra el Suicidio", number: "024", available: "24h" },
];

export default function CrisisMessage({ open, onClose }: CrisisMessageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto max-w-md rounded-xl border-2 border-red-600 bg-white p-0 shadow-2xl backdrop:bg-black/60"
      onClose={onClose}
    >
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-xl text-white">
            !
          </span>
          <h2 className="text-xl font-bold text-red-700">
            Alerta de Crisis
          </h2>
        </div>

        <p className="mb-4 text-gray-800">
          Hemos detectado señales que indican que podrías estar en una situación
          de crisis. <strong>Tu bienestar es lo más importante.</strong>
        </p>

        <p className="mb-4 text-sm text-gray-600">
          Esta plataforma no puede sustituir la atención humana inmediata.
          Por favor, contacta con uno de los siguientes recursos:
        </p>

        <ul className="mb-6 space-y-3">
          {EMERGENCY_CONTACTS.map((contact) => (
            <li
              key={contact.number}
              className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3"
            >
              <div>
                <span className="font-semibold text-gray-900">
                  {contact.name}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  ({contact.available})
                </span>
              </div>
              <a
                href={`tel:${contact.number.replace(/\s/g, "")}`}
                className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white transition-colors hover:bg-red-700"
              >
                {contact.number}
              </a>
            </li>
          ))}
        </ul>

        <p className="mb-4 text-center text-sm font-medium text-red-700">
          Si estás en peligro inmediato, llama al 112
        </p>

        <button
          onClick={onClose}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100"
        >
          He tomado nota de los recursos de ayuda
        </button>
      </div>
    </dialog>
  );
}
