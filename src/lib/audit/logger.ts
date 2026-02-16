import { getFirestore, Timestamp } from "firebase-admin/firestore";
import type { CrisisAnalysis } from "@/middleware/crisisGuard";

const COLLECTION = "crisisAuditLog";

export interface CrisisAuditEntry {
  sessionId: string;
  riskLevel: string;
  score: number;
  matchedCategories: string[];
  blocked: boolean;
  timestamp: Timestamp;
  handled: boolean;
}

/**
 * Registra un evento de bloqueo de crisis en Firestore para auditoría legal.
 * Principio 9: Trazabilidad y registro legal de cada intervención del sistema.
 */
export async function logCrisisBlock(
  sessionId: string,
  analysis: CrisisAnalysis
): Promise<string> {
  const db = getFirestore();

  const entry: CrisisAuditEntry = {
    sessionId,
    riskLevel: analysis.riskLevel,
    score: analysis.score,
    matchedCategories: analysis.matchedCategories,
    blocked: analysis.riskLevel === "high",
    timestamp: Timestamp.now(),
    handled: false,
  };

  const docRef = await db.collection(COLLECTION).add(entry);
  return docRef.id;
}

/**
 * Marca una alerta de crisis como atendida por un profesional.
 */
export async function markAlertHandled(alertId: string): Promise<void> {
  const db = getFirestore();
  await db.collection(COLLECTION).doc(alertId).update({
    handled: true,
    handledAt: Timestamp.now(),
  });
}
