import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span className="site-footer-copy">© {new Date().getFullYear()} Referralbot.online</span>
        <nav className="site-footer-links">
          <Link href="/about">About Us</Link>
          <a
            href="https://x.com/ReferralsWeb"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Referralbot.online on X"
            className="site-footer-x"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </nav>
      </div>
    </footer>
  );
}
