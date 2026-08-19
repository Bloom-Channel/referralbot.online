"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type ActivityEvent = {
  id: string;
  text: string;
  at: string;
};

function sentenceCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function timeAgo(iso: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RecentActivity() {
  const supabase = createClient();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: profiles }, { data: links }, { data: newPlatforms }] = await Promise.all([
        supabase.from("profiles").select("id, nickname, created_at").order("created_at", { ascending: false }).limit(8),
        supabase
          .from("referral_links")
          .select("id, updated_at, profiles(nickname), platforms(name)")
          .order("updated_at", { ascending: false })
          .limit(8),
        supabase.from("platforms").select("id, name, created_at").order("created_at", { ascending: false }).limit(2),
      ]);

      const joinEvents: ActivityEvent[] = (profiles ?? []).map((p: any) => ({
        id: `join-${p.id}`,
        text: sentenceCase(`${p.nickname} joined`),
        at: p.created_at,
      }));

      const linkEvents: ActivityEvent[] = (links ?? []).map((l: any) => ({
        id: `link-${l.id}`,
        text: sentenceCase(`${l.profiles?.nickname ?? "anon"} shared a ${l.platforms?.name ?? "referral"} link`),
        at: l.updated_at,
      }));

      const platformEvents: ActivityEvent[] = (newPlatforms ?? []).map((p: any) => ({
        id: `platform-${p.id}`,
        text: sentenceCase(`${p.name} added as a new program`),
        at: p.created_at,
      }));

      const merged = [...joinEvents, ...linkEvents, ...platformEvents]
        .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
        .slice(0, 10);

      setEvents(merged);
      setLoading(false);
    })();
  }, []);

  if (loading || events.length === 0) return null;

  // Duplicated so the marquee can loop seamlessly at -50%.
  const scrolling = [...events, ...events];

  return (
    <section className="activity-feed">
      <h2>Latest Activity</h2>
      <div className="activity-feed-viewport">
        <ul className="activity-feed-list activity-feed-scroll">
          {scrolling.map((e, i) => (
            <li key={`${e.id}-${i}`} className="activity-feed-item">
              <span className="activity-feed-dot" />
              <span className="activity-feed-text">{e.text}</span>
              <span className="activity-feed-time">{timeAgo(e.at)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
