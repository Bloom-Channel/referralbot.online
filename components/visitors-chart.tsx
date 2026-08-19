"use client";

import { useEffect, useState } from "react";
import DoughnutChart from "./doughnut-chart";
import { createClient } from "@/lib/supabase-browser";
import { getOrCreateVisitorId } from "@/lib/local-identity";

export default function VisitorsChart() {
  const supabase = createClient();
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const visitorId = getOrCreateVisitorId();
      await supabase.from("site_visits").upsert({ visitor_id: visitorId }, { onConflict: "visitor_id", ignoreDuplicates: true });

      const { count } = await supabase.from("site_visits").select("*", { count: "exact", head: true });
      setTotal(count ?? 0);
    })();
  }, []);

  if (total === null) return null;

  return (
    <DoughnutChart
      segments={[{ value: total || 1, color: "var(--accent)" }]}
      centerValue={String(total)}
      centerLabel={total === 1 ? "Visitor" : "Visitors"}
    />
  );
}
