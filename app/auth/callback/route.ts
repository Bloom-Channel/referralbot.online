import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // /onboarding checks (client-side) whether this auth user already has
  // a linked profile — if so it sets local identity and forwards to
  // /dashboard itself; if not, it asks for a nickname.
  return NextResponse.redirect(`${origin}/onboarding`);
}
