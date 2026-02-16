import crypto from "crypto";
import { KeyManagementServiceClient } from "@google-cloud/kms";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

const kmsClient = new KeyManagementServiceClient();

const KMS_KEY_NAME =
  process.env.GCP_KMS_KEY_NAME ??
  "projects/PROJECT/locations/LOCATION/keyRings/RING/cryptoKeys/KEY";

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
  encryptedDek: string;
}

/**
 * Generates a Data Encryption Key (DEK) and encrypts it with Google Cloud KMS.
 * Envelope encryption: KMS wraps the DEK, the DEK encrypts the data.
 */
async function generateWrappedDek(): Promise<{
  plainDek: Buffer;
  encryptedDek: string;
}> {
  const plainDek = crypto.randomBytes(32);

  const [result] = await kmsClient.encrypt({
    name: KMS_KEY_NAME,
    plaintext: plainDek,
  });

  const encryptedDek = Buffer.from(
    result.ciphertext as Uint8Array
  ).toString("base64");

  return { plainDek, encryptedDek };
}

/**
 * Decrypts a wrapped DEK using Google Cloud KMS.
 */
async function unwrapDek(encryptedDek: string): Promise<Buffer> {
  const [result] = await kmsClient.decrypt({
    name: KMS_KEY_NAME,
    ciphertext: Buffer.from(encryptedDek, "base64"),
  });

  return Buffer.from(result.plaintext as Uint8Array);
}

/**
 * Encrypts clinical data using AES-256-GCM with envelope encryption via KMS.
 * - Generates a random DEK (Data Encryption Key)
 * - Wraps the DEK with Google Cloud KMS
 * - Encrypts the data with the DEK using AES-256-GCM
 * - Returns the encrypted payload (ciphertext + iv + authTag + wrapped DEK)
 */
export async function encrypt(plaintext: string): Promise<EncryptedPayload> {
  const { plainDek, encryptedDek } = await generateWrappedDek();

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, plainDek, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
    encryptedDek,
  };
}

/**
 * Decrypts clinical data by unwrapping the DEK via KMS and then
 * decrypting the ciphertext with AES-256-GCM.
 */
export async function decrypt(payload: EncryptedPayload): Promise<string> {
  const plainDek = await unwrapDek(payload.encryptedDek);

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    plainDek,
    Buffer.from(payload.iv, "base64"),
    { authTagLength: AUTH_TAG_LENGTH }
  );

  decipher.setAuthTag(Buffer.from(payload.authTag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
