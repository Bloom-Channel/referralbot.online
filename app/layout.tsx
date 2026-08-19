import "./globals.css";
import Sidebar from "@/components/sidebar";
import SiteHeader from "@/components/site-header";

export const metadata = {
  title: "ReferHub",
  description: "Share and discover referral links",
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
          </div>
        </div>
      </body>
    </html>
  );
}
