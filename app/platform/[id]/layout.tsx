import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: platform } = await supabase
    .from("platforms")
    .select("name, description")
    .eq("id", id)
    .single();

  if (!platform?.name) return {};

  return {
    title: platform.name,
    description:
      platform.description ??
      `Find and share ${platform.name} referral links on Referralbot.online.`,
  };
}

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return children;
}
