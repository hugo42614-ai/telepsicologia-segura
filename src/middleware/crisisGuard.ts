export type RiskLevel = "none" | "low" | "medium" | "high";

interface RiskCategory {
  weight: number;
  terms: string[];
}

const RISK_DICTIONARY: Record<string, RiskCategory> = {
  suicidio: {
    weight: 3,
    terms: [
      "suicidarme",
      "suicidio",
      "quitarme la vida",
      "acabar con todo",
      "no quiero vivir",
      "mejor muerto",
      "mejor muerta",
      "me quiero morir",
      "quiero morirme",
      "acabar con mi vida",
      "no vale la pena vivir",
      "desaparecer para siempre",
    ],
  },
  autolesion: {
    weight: 2,
    terms: [
      "cortarme",
      "hacerme daño",
      "autolesion",
      "autolesionarme",
      "lastimarme",
      "herirme",
      "golpearme",
      "quemarme",
    ],
  },
  violencia: {
    weight: 2,
    terms: [
      "matar",
      "hacer daño a alguien",
      "violencia",
      "agredir",
      "atacar",
      "golpear a alguien",
      "arma",
    ],
  },
  desesperanza: {
    weight: 1,
    terms: [
      "no hay salida",
      "sin esperanza",
      "no puedo más",
      "no aguanto más",
      "todo es inútil",
      "nadie me quiere",
      "estoy solo",
      "estoy sola",
      "no le importo a nadie",
      "soy una carga",
    ],
  },
};

export interface CrisisAnalysis {
  riskLevel: RiskLevel;
  score: number;
  matchedCategories: string[];
}

/**
 * Analyzes text for crisis risk indicators.
 * Scans against a categorized dictionary of risk terms and computes
 * a weighted score to determine the risk level.
 */
export function analyzeCrisisRisk(text: string): CrisisAnalysis {
  const normalized = text.toLowerCase();
  let score = 0;
  const matchedCategories: string[] = [];

  for (const [category, { weight, terms }] of Object.entries(RISK_DICTIONARY)) {
    for (const term of terms) {
      if (normalized.includes(term)) {
        score += weight;
        if (!matchedCategories.includes(category)) {
          matchedCategories.push(category);
        }
      }
    }
  }

  let riskLevel: RiskLevel;
  if (score === 0) {
    riskLevel = "none";
  } else if (score <= 2) {
    riskLevel = "low";
  } else if (score <= 4) {
    riskLevel = "medium";
  } else {
    riskLevel = "high";
  }

  return { riskLevel, score, matchedCategories };
}

export class CrisisBlockError extends Error {
  public readonly analysis: CrisisAnalysis;

  constructor(analysis: CrisisAnalysis) {
    super(
      "CRISIS_BLOCK: Se ha detectado un nivel de riesgo alto. " +
        "Se requiere intervención humana inmediata. " +
        "Por favor, contacte con el Teléfono de la Esperanza (717 003 717) " +
        "o acuda al servicio de urgencias más cercano."
    );
    this.name = "CrisisBlockError";
    this.analysis = analysis;
  }
}

export interface CrisisGuardResult {
  allowed: true;
  analysis: CrisisAnalysis;
}

/**
 * Crisis guard middleware. Analyzes text for crisis indicators and:
 * - If risk is HIGH: throws CrisisBlockError (blocks processing, requires human intervention)
 * - Otherwise: returns the analysis metadata so downstream handlers can act accordingly
 */
export function crisisGuard(text: string): CrisisGuardResult {
  const analysis = analyzeCrisisRisk(text);

  if (analysis.riskLevel === "high") {
    throw new CrisisBlockError(analysis);
  }

  return { allowed: true, analysis };
}
