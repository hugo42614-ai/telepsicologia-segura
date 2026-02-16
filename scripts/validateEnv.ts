import fs from "fs";
import path from "path";

interface EnvRule {
  key: string;
  required: boolean;
  validate?: (value: string) => string | null;
  description: string;
}

const KMS_KEY_PATTERN =
  /^projects\/[\w-]+\/locations\/[\w-]+\/keyRings\/[\w-]+\/cryptoKeys\/[\w-]+$/;

const ANTHROPIC_KEY_PATTERN = /^sk-ant-api03-.+$/;

const ENV_RULES: EnvRule[] = [
  {
    key: "FIREBASE_PROJECT_ID",
    required: true,
    description: "ID del proyecto de Firebase",
  },
  {
    key: "FIREBASE_CLIENT_EMAIL",
    required: true,
    validate: (v) =>
      v.includes("@") ? null : "Debe ser un email válido de service account",
    description: "Email de la service account de Firebase",
  },
  {
    key: "FIREBASE_PRIVATE_KEY",
    required: true,
    validate: (v) =>
      v.includes("-----BEGIN PRIVATE KEY-----")
        ? null
        : "Debe contener una clave PEM válida (-----BEGIN PRIVATE KEY-----)",
    description: "Clave privada PEM de Firebase",
  },
  {
    key: "GCP_KMS_KEY_NAME",
    required: true,
    validate: (v) =>
      KMS_KEY_PATTERN.test(v)
        ? null
        : "Formato inválido. Esperado: projects/{project}/locations/{location}/keyRings/{ring}/cryptoKeys/{key}",
    description: "Nombre completo de la clave KMS de Google Cloud",
  },
  {
    key: "ANTHROPIC_API_KEY",
    required: true,
    validate: (v) =>
      ANTHROPIC_KEY_PATTERN.test(v)
        ? null
        : "Formato inválido. Esperado: sk-ant-api03-...",
    description: "API key de Anthropic (Claude)",
  },
  {
    key: "NEXT_PUBLIC_APP_URL",
    required: false,
    validate: (v) => {
      try {
        new URL(v);
        return null;
      } catch {
        return "Debe ser una URL válida";
      }
    },
    description: "URL pública de la aplicación",
  },
];

function loadEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf-8");
  const env: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function validate(): void {
  const envPath = path.resolve(process.cwd(), ".env.local");
  const env = loadEnvFile(envPath);

  console.log("=== Telepsicologia Segura - Validacion de Env ===\n");

  if (Object.keys(env).length === 0) {
    console.error("X No se encontro .env.local o esta vacio.");
    console.error("  Ejecuta: npm run setup:env\n");
    process.exit(1);
  }

  let hasErrors = false;

  for (const rule of ENV_RULES) {
    const value = env[rule.key];
    if (!value || value === "") {
      if (rule.required) {
        console.error(`X ${rule.key} - Requerida y no definida`);
        hasErrors = true;
      } else {
        console.warn(`? ${rule.key} - Opcional, no definida`);
      }
      continue;
    }
    if (rule.validate) {
      const error = rule.validate(value);
      if (error) {
        console.error(`X ${rule.key} - ${error}`);
        hasErrors = true;
        continue;
      }
    }
    console.log(`OK ${rule.key}`);
  }

  console.log("");
  if (hasErrors) {
    console.error("Resultado: FALLO - Corrige los errores.\n");
    process.exit(1);
  }
  console.log("Resultado: OK - Todas las variables validadas.\n");
}

validate();
