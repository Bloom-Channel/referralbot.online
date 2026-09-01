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

export default function RecentActivity() {
  const supabase = createClient();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const [{ data: profiles }, { data: links }, { data: newPlatforms }, thisWeek, lastWeek] = await Promise.all([
        supabase.from("profiles").select("id, nickname, created_at").order("created_at", { ascending: false }).limit(8),
        supabase
          .from("referral_links")
          .select("id, updated_at, profiles(nickname), platforms(name)")
          .order("updated_at", { ascending: false })
          .limit(8),
        supabase.from("platforms").select("id, name, created_at").order("created_at", { ascending: false }).limit(2),
        supabase.from("site_visits").select("id", { count: "exact", head: true }).gte("created_at", weekAgo.toISOString()),
        supabase
          .from("site_visits")
          .select("id", { count: "exact", head: true })
          .gte("created_at", twoWeeksAgo.toISOString())
          .lt("created_at", weekAgo.toISOString()),
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

      const visitorEvents: ActivityEvent[] = [];
      const thisWeekCount = thisWeek.count ?? 0;
      const lastWeekCount = lastWeek.count ?? 0;
      if (lastWeekCount > 0) {
        const pctChange = Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
        if (pctChange !== 0) {
          const direction = pctChange > 0 ? "increase" : "decrease";
          visitorEvents.push({
            id: "visitors-trend",
            text: `${Math.abs(pctChange)}% ${direction} in site visitors this week`,
            at: now.toISOString(),
          });
        }
      }

      const merged = [...visitorEvents, ...joinEvents, ...linkEvents, ...platformEvents]
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
