import type { NextAuthOptions } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import GoogleProvider from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";
import crypto from "node:crypto";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;
const shouldUseDatabase = process.env.AUTH_USE_DATABASE === "true";

function readEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : undefined;
}

function normalizePrivateKey(key?: string) {
  if (!key) return undefined;
  return key.trim().replace(/\\n/g, "\n");
}

function toBase64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function createAppleClientSecret() {
  const clientId = readEnv("APPLE_SERVICE_ID");
  const teamId = readEnv("APPLE_TEAM_ID");
  const keyId = readEnv("APPLE_KEY_ID");
  const privateKey = normalizePrivateKey(readEnv("APPLE_PRIVATE_KEY"));

  if (!clientId || !teamId || !keyId || !privateKey) return undefined;

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: teamId,
    iat: now,
    exp: now + 60 * 60 * 24 * 180,
    aud: "https://appleid.apple.com",
    sub: clientId,
  };
  const header = { alg: "ES256", kid: keyId, typ: "JWT" };
  const unsigned = `${toBase64Url(JSON.stringify(header))}.${toBase64Url(
    JSON.stringify(payload),
  )}`;

  const signer = crypto.createSign("SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(privateKey);

  return `${unsigned}.${toBase64Url(signature)}`;
}

function getPool() {
  if (pool) return pool;

  const useDiscreteConfig =
    !!(process.env.PGHOST || process.env.DATABASE_HOST) &&
    !!(process.env.PGUSER || process.env.DATABASE_USER) &&
    !!(process.env.PGDATABASE || process.env.DATABASE_NAME);

  if (useDiscreteConfig) {
    pool = new Pool({
      host: process.env.PGHOST || process.env.DATABASE_HOST,
      port: Number(process.env.PGPORT || process.env.DATABASE_PORT || "5432"),
      database: process.env.PGDATABASE || process.env.DATABASE_NAME,
      user: process.env.PGUSER || process.env.DATABASE_USER,
      password: process.env.PGPASSWORD || process.env.DATABASE_PASSWORD,
      ssl:
        process.env.DATABASE_SSL === "true"
          ? { rejectUnauthorized: false }
          : undefined,
    });
    return pool;
  }

  if (!process.env.DATABASE_URL) return null;

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: false }
        : undefined,
  });
  return pool;
}

export async function ensureOAuthTables() {
  if (!shouldUseDatabase) return;
  if (schemaReady) return schemaReady;

  const client = getPool();
  if (!client) return;

  schemaReady = (async () => {
    try {
      await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

      await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT,
        email TEXT UNIQUE,
        "emailVerified" TIMESTAMPTZ,
        image TEXT
      );
    `);

      await client.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        id_token TEXT,
        scope TEXT,
        session_state TEXT,
        token_type TEXT
      );
    `);

      await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS accounts_provider_provideraccountid_key
      ON accounts (provider, "providerAccountId");
    `);

      await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "sessionToken" TEXT NOT NULL UNIQUE,
        "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMPTZ NOT NULL
      );
    `);

      await client.query(`
      CREATE TABLE IF NOT EXISTS verification_token (
        identifier TEXT NOT NULL,
        token TEXT NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (identifier, token)
      );
    `);
    } catch (error) {
      console.warn("[OAuth] DB schema init skipped:", error);
    }
  })();

  return schemaReady;
}

const providers: NextAuthOptions["providers"] = [];
const authSecret = readEnv("AUTH_SECRET");

if (!authSecret) {
  console.warn("[OAuth] AUTH_SECRET is missing. Fallback secret is in use.");
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const googleClientId = readEnv("GOOGLE_CLIENT_ID");
  const googleClientSecret = readEnv("GOOGLE_CLIENT_SECRET");
  if (!googleClientId || !googleClientSecret) {
    console.warn("[OAuth] Google provider config is incomplete.");
  } else {
    providers.push(
      GoogleProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      }),
    );
  }
}

if (
  readEnv("APPLE_SERVICE_ID") &&
  readEnv("APPLE_TEAM_ID") &&
  readEnv("APPLE_KEY_ID") &&
  readEnv("APPLE_PRIVATE_KEY")
) {
  const appleServiceId = readEnv("APPLE_SERVICE_ID");
  const appleClientSecret = createAppleClientSecret();
  if (!appleServiceId || !appleClientSecret) {
    console.warn("[OAuth] Apple provider config is incomplete.");
  } else {
    providers.push(
      AppleProvider({
        clientId: appleServiceId,
        clientSecret: appleClientSecret,
      }),
    );
  }
}

const dbPool = shouldUseDatabase ? getPool() : null;

export const oauthOptions: NextAuthOptions = {
  secret: authSecret ?? "telloria-local-auth-secret",
  providers,
  adapter: dbPool ? PostgresAdapter(dbPool) : undefined,
  session: { strategy: "jwt" },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/`;
    },
  },
};
