import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Referralbot.online",
    short_name: "Referralbot",
    description: "Share and discover referral links across crypto exchanges, shopping apps, and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e1116",
    theme_color: "#b8541c",
    categories: ["finance", "shopping", "utilities"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
