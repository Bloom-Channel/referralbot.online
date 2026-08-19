"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PlatformClient from "./platform-client";
import { createClient } from "@/lib/supabase-browser";
import { getLocalUserId } from "@/lib/local-identity";

export default function PlatformPage() {
  const params = useParams();
  const platformId = Number(params.id);
  const supabase = createClient();

  const [platform, setPlatform] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = getLocalUserId();

  const fetchData = useCallback(async () => {
    const { data: platformData } = await supabase
      .from("platforms")
      .select("*")
      .eq("id", platformId)
      .single();

    const { data: linksData } = await supabase
      .from("referral_links")
      .select("id, link, code, user_id, updated_at, use_count, profiles(nickname, avatar_url)")
      .eq("platform_id", platformId)
      .order("updated_at", { ascending: false });

    const linkIds = (linksData ?? []).map((l) => l.id);
    const { data: commentsData } = linkIds.length
      ? await supabase
          .from("comments")
          .select("id, body, created_at, user_id, referral_link_id, profiles(nickname)")
          .in("referral_link_id", linkIds)
      : { data: [] };

    setPlatform(platformData);
    setLinks(linksData ?? []);
    setComments(commentsData ?? []);
    setLoading(false);
  }, [platformId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <main><p>Loading…</p></main>;

  const myLink = links.find((l) => l.user_id === userId) ?? null;

  return (
    <PlatformClient
      platform={platform}
      links={links}
      comments={comments}
      myLink={myLink}
      userId={userId}
      onDataChange={fetchData}
    />
  );
}
