import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Render terminates TLS at a proxy and forwards to the app on an internal
  // port, so `origin` here reads https://localhost:10000 -- redirecting a
  // browser there silently ends the login and drops the user back on the home
  // page with no session. Use the host the proxy actually received. `origin`
  // stays as the local-dev fallback, where no forwarded headers are set.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin);

  // /onboarding checks (client-side) whether this auth user already has
  // a linked profile — if so it sets local identity and forwards to
  // /dashboard itself; if not, it asks for a nickname.
  return NextResponse.redirect(`${base}/onboarding`);
}
