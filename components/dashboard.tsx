"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import ReferralStatsPanel from "./referral-stats-panel";
import RecentActivity from "./recent-activity";

const CATEGORY_LABELS: Record<string, string> = {
  crypto: "Crypto Exchanges",
  shopping: "Shopping",
  hosting: "Web Hosting & Business Software",
  web3: "Privacy Browsers & Web3 Infrastructure",
  other: "More",
};

export default function Dashboard() {
  const supabase = createClient();
  const [grouped, setGrouped] = useState<Map<string, any[]>>(new Map());
  const [counts, setCounts] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: platforms } = await supabase.from("platforms").select("*").order("sort_order");
      const { data: links } = await supabase.from("referral_links").select("platform_id");

      const countMap = new Map<number, number>();
      (links ?? []).forEach((l) => countMap.set(l.platform_id, (countMap.get(l.platform_id) ?? 0) + 1));
      setCounts(countMap);

      const g = new Map<string, any[]>();
      (platforms ?? []).forEach((p) => {
        const arr = g.get(p.category) ?? [];
        arr.push(p);
        g.set(p.category, arr);
      });
      setGrouped(g);
      setLoading(false);
    })();
  }, []);

  if (loading) return <main><p>Loading…</p></main>;

  const allPlatforms = [...grouped.values()].flat();
  const trending = [...allPlatforms]
    .sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0))
    .slice(0, 6);

  return (
    <main className="dashboard">
      <div className="dashboard-col-left">
        <ReferralStatsPanel platforms={allPlatforms} counts={counts} />
      </div>

      <div className="dashboard-col-main">
        <section>
          <h2>Trending</h2>
          <div className="trending-row">
            {trending.map((p) => {
              const count = counts.get(p.id) ?? 0;
              return (
                <Link key={p.id} href={`/platform/${p.id}`} className="trending-card">
                  {p.logo_url && (
                    <img
                      src={p.logo_url}
                      alt=""
                      className="trending-card-bg"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                  )}
                  {p.value_per_referral > 0 && <span className="card-value-badge">${p.value_per_referral}</span>}
                  <div className="trending-card-overlay">
                    <span className="trending-card-count">{count}</span>
                    <h3>{p.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {[...grouped.entries()].map(([category, items]) => (
          <section key={category}>
            <h2>{CATEGORY_LABELS[category] ?? category}</h2>
            <div className="card-grid">
              {items.map((p) => {
                const count = counts.get(p.id) ?? 0;
                return (
                  <Link key={p.id} href={`/platform/${p.id}`} className="card">
                    <div className="card-header">
                      {p.logo_url && (
                        <img
                          src={p.logo_url}
                          alt=""
                          className="card-icon"
                          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                        />
                      )}
                      {p.value_per_referral > 0 && <span className="card-value-inline">${p.value_per_referral}</span>}
                    </div>
                    <h3>{p.name}</h3>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="dashboard-col-right">
        <RecentActivity />
      </div>
    </main>
  );
}
