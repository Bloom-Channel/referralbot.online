import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span className="site-footer-copy">© {new Date().getFullYear()} ReferHub</span>
        <nav className="site-footer-links">
          <Link href="/about">About Us</Link>
        </nav>
      </div>
    </footer>
  );
}
