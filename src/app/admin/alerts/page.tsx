"use client";

import { useState, useEffect } from "react";
import type { RiskLevel } from "@/middleware/crisisGuard";

interface CrisisAlert {
  id: string;
  timestamp: string;
  riskLevel: RiskLevel;
  score: number;
  matchedCategories: string[];
  sessionId: string;
  handled: boolean;
}

const RISK_STYLES: Record<RiskLevel, string> = {
  none: "bg-gray-100 text-gray-700",
  low: "bg-yellow-100 text-yellow-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
};

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);
  const [filter, setFilter] = useState<RiskLevel | "all">("all");

  useEffect(() => {
    // TODO: Conectar con Firestore (collection: crisisAuditLog)
    // Por ahora se carga un estado vacío — los datos reales vendrán
    // del audit logger cuando esté conectado a Firebase
    setAlerts([]);
  }, []);

  const filtered =
    filter === "all" ? alerts : alerts.filter((a) => a.riskLevel === filter);

  const pendingCount = alerts.filter(
    (a) => a.riskLevel === "high" && !a.handled
  ).length;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Panel de Alertas de Crisis
          </h1>
          <p className="text-sm text-gray-500">
            Principio 9: Registro de auditoría legal
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">
            {pendingCount} sin atender
          </span>
        )}
      </div>

      <div className="mb-4 flex gap-2">
        {(["all", "high", "medium", "low"] as const).map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === level
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {level === "all" ? "Todas" : level.toUpperCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
          <p className="text-gray-500">No hay alertas registradas.</p>
          <p className="mt-1 text-sm text-gray-400">
            Las alertas aparecerán aquí cuando el sistema detecte riesgo.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((alert) => (
            <li
              key={alert.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-md px-2 py-1 text-xs font-bold ${RISK_STYLES[alert.riskLevel]}`}
                >
                  {alert.riskLevel.toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Sesión: {alert.sessionId}
                  </p>
                  <p className="text-xs text-gray-500">
                    {alert.matchedCategories.join(", ")} — Score: {alert.score}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{alert.timestamp}</p>
                {alert.handled ? (
                  <span className="text-xs text-green-600">Atendida</span>
                ) : (
                  <span className="text-xs font-semibold text-red-600">
                    Pendiente
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
