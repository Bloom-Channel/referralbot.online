"use client";

import { useEffect, useState } from "react";
import DoughnutChart from "./doughnut-chart";
import VisitorsChart from "./visitors-chart";
import { formatUsd } from "@/lib/format";
import { getStoredTheme, type Theme } from "@/lib/theme";

const DARK_COLORS = ["#2b2b2b", "#5c5c5c", "#1a1a1a", "#8a8a8a", "#4a4a4a"];
const LIGHT_COLORS = ["#f0a878", "#f6c9a5", "#e89660", "#facdae", "#e0855a"];

export default function ReferralStatsPanel({
  platforms,
  counts,
}: {
  platforms: any[];
  counts: Map<number, number>;
}) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(getStoredTheme());
    const onThemeChanged = () => setTheme(getStoredTheme());
    window.addEventListener("theme-changed", onThemeChanged);
    return () => window.removeEventListener("theme-changed", onThemeChanged);
  }, []);

  const colors = theme === "light" ? LIGHT_COLORS : DARK_COLORS;

  const totalLinks = platforms.reduce((sum, p) => sum + (counts.get(p.id) ?? 0), 0);
  const totalValue = platforms.reduce((sum, p) => sum + (counts.get(p.id) ?? 0) * (p.value_per_referral ?? 0), 0);

  const countSegments = platforms.map((p, i) => ({
    value: counts.get(p.id) ?? 0,
    color: colors[i % colors.length],
  }));

  const valueSegments = platforms.map((p, i) => ({
    value: (counts.get(p.id) ?? 0) * (p.value_per_referral ?? 0),
    color: colors[i % colors.length],
  }));

  return (
    <div className="referral-stats-panel">
      <DoughnutChart
        segments={countSegments}
        centerValue={String(totalLinks)}
        centerLabel={totalLinks === 1 ? "Referral" : "Referrals"}
      />
      <DoughnutChart
        segments={valueSegments}
        centerValue={formatUsd(totalValue).replace(".00", "")}
        centerLabel={
          <>
            Referrals
            <br />
            Value
          </>
        }
      />
      <VisitorsChart />
    </div>
  );
}
