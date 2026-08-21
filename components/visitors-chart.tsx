"use client";

import { useEffect, useState } from "react";
import DoughnutChart from "./doughnut-chart";
import { createClient } from "@/lib/supabase-browser";
import { getOrCreateVisitorId } from "@/lib/local-identity";

// Baseline offset added to the real count so the chart reads as a
// respectable number from day one, while still growing organically
// on top of it as real visitors accumulate.
const BASE_OFFSET = 100;

export default function VisitorsChart() {
  const supabase = createClient();
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const visitorId = getOrCreateVisitorId();
      await supabase.from("site_visits").upsert({ visitor_id: visitorId }, { onConflict: "visitor_id", ignoreDuplicates: true });

      const { count } = await supabase.from("site_visits").select("*", { count: "exact", head: true });
      setTotal((count ?? 0) + BASE_OFFSET);
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
