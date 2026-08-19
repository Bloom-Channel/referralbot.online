"use client";

import { useEffect, useRef } from "react";
import { decodeLottieFile, decodeLottieUrl } from "@/lib/lottie-decode";

export default function LottieAvatar({
  src,
  file,
  className,
}: {
  src?: string;
  file?: File;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: any;
    let cancelled = false;

    (async () => {
      const data = file ? await decodeLottieFile(file).catch(() => null) : src ? await decodeLottieUrl(src).catch(() => null) : null;
      if (cancelled || !data || !containerRef.current) return;

      const lottie = (await import("lottie-web")).default;
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: data,
      });
    })();

    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, [src, file]);

  return <div ref={containerRef} className={className} />;
}
