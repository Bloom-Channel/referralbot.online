import { useId } from "react";

type Brand = { color: string; accent?: string; gradient?: [string, string, string] };

const NEAR_BLACK = "#16161c";

const BRANDS: Record<string, Brand> = {
  binance: { color: "#F0B90B" },
  coinbase: { color: "#0052FF" },
  kraken: { color: "#5741D9" },
  bybit: { color: "#F7A600" },
  okx: { color: NEAR_BLACK, accent: "#FFFFFF" },
  amazon: { color: "#FF9900" },
  aliexpress: { color: "#E62E04" },
  shein: { color: NEAR_BLACK, accent: "#FFFFFF" },
  uber: { color: NEAR_BLACK, accent: "#FFFFFF" },
  airbnb: { color: "#FF5A5F" },
  revolut: { color: "#0666EB" },
  "tiktok shop": { color: NEAR_BLACK, accent: "#25F4EE" },
  instagram: { color: "#DD2A7B", gradient: ["#F58529", "#DD2A7B", "#8134AF"] },
  paypal: { color: "#003087" },
  tesla: { color: "#E82127" },
  robinhood: { color: "#00C805" },
  gemini: { color: "#00DCFA" },
  hostinger: { color: "#673DE6" },
  "google workspace": { color: "#4285F4" },
  "brave browser": { color: "#FB542B" },
  presearch: { color: "#2B5CE6" },
  "crypto.com": { color: "#103F91" },
  mexc: { color: "#1972E2" },
  hyperliquid: { color: "#97FCE4" },
};

const FALLBACK_COLORS = ["#7C9EFF", "#4FD1C5", "#FF6B6B", "#C792EA", "#66D9A6", "#F2B705"];

function fallbackColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export default function PlatformBadge({
  name,
  size = 24,
  className,
}: {
  name: string;
  size?: number | string;
  className?: string;
}) {
  const gradientId = `badge-${useId().replace(/:/g, "")}`;
  const brand = BRANDS[name.trim().toLowerCase()] ?? { color: fallbackColor(name) };
  const lum = luminance(brand.color);
  const ink = lum > 0.35 ? "#15151b" : "#FFFFFF";
  const ringColor = brand.accent ?? ink;
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {brand.gradient && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={brand.gradient[0]} />
            <stop offset="0.5" stopColor={brand.gradient[1]} />
            <stop offset="1" stopColor={brand.gradient[2]} />
          </linearGradient>
        </defs>
      )}
      <circle
        cx="48"
        cy="48"
        r="47"
        fill={brand.gradient ? `url(#${gradientId})` : brand.color}
        stroke={lum < 0.03 ? "#4a4a58" : "none"}
        strokeWidth="2"
      />
      <circle
        cx="48"
        cy="48"
        r="35"
        fill="none"
        stroke={ringColor}
        strokeOpacity={brand.accent ? 0.9 : 0.35}
        strokeWidth="3"
      />
      <text
        x="48"
        y="48"
        dy="0.35em"
        textAnchor="middle"
        fontFamily="'Space Grotesk', 'Inter', sans-serif"
        fontWeight={700}
        fontSize="40"
        fill={ink}
      >
        {initial}
      </text>
    </svg>
  );
}
