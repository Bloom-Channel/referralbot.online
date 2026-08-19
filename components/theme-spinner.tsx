"use client";

import { useEffect, useRef, useState } from "react";
import { decodeLottieUrl } from "@/lib/lottie-decode";
import { recolorLottie } from "@/lib/lottie-recolor";
import { getStoredTheme, type Theme } from "@/lib/theme";

// One shade lighter than the light-theme background (--bg #F8F7F4 →
// --surface #FFFFFF is the app's own "next lighter" token), reused here
// so the spinner blends in as a subtle accent instead of a stark black mark.
const LIGHT_COLOR: [number, number, number] = [1, 1, 1];

export default function ThemeSpinner({
  src,
  className,
  style,
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(getStoredTheme());
    const sync = () => setTheme(getStoredTheme());
    window.addEventListener("theme-changed", sync);
    return () => window.removeEventListener("theme-changed", sync);
  }, []);

  useEffect(() => {
    let anim: any;
    let cancelled = false;

    (async () => {
      const data = await decodeLottieUrl(src).catch(() => null);
      if (cancelled || !data || !containerRef.current) return;

      const finalData = theme === "light" ? recolorLottie(data, LIGHT_COLOR) : data;

      const lottie = (await import("lottie-web")).default;
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: finalData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMin meet",
        },
      });
    })();

    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, [src, theme]);

  return <div ref={containerRef} className={className} style={style} />;
}
