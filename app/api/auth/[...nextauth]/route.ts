import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { ensureOAuthTables, oauthOptions } from "@/app/lib/oauth";

const handler = NextAuth(oauthOptions);

export async function GET(req: NextRequest, context: any) {
  await ensureOAuthTables();
  return handler(req, context);
}

export async function POST(req: NextRequest, context: any) {
  await ensureOAuthTables();
  return handler(req, context);
}
