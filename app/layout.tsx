import "./globals.css";
import Sidebar from "@/components/sidebar";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

const SITE_URL = "https://referralbot.online";
const SITE_TITLE = "ReferHub — Share and Discover Referral Links";
const SITE_DESCRIPTION =
  "Find and share real referral links for crypto exchanges, shopping apps, web hosting, and more — with sourced dollar values, not guesses.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | ReferHub",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "referral links",
    "referral codes",
    "crypto exchange referral",
    "Binance referral",
    "Coinbase referral",
    "referral bonus",
    "invite friends earn money",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "ReferHub",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('referhub_theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <div className="app-shell">
          <Sidebar />
          <div className="app-main-col">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
