export const metadata = {
  title: "Terms of Service",
  description: "The terms for using Referralbot.online.",
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <h1>Terms of Service</h1>
      <p className="legal-updated">Last updated: September 2026</p>

      <section>
        <h2>What we provide</h2>
        <p>
          Referralbot.online lets users post and browse referral links for third-party services
          (crypto exchanges, shopping apps, hosting providers, and similar). We don't operate any
          of the linked services, and we don't control what happens after you click through to
          them.
        </p>
      </section>

      <section>
        <h2>Referral values aren't guaranteed by us</h2>
        <p>
          Where a dollar value is shown next to a platform, it's sourced from that platform's own
          publicly stated referral terms at the time it was added, or a value that user has
          knowingly configured for their own program. Referral programs change their terms
          frequently and without notice. Always verify the current terms directly on the platform
          before relying on a figure shown here.
        </p>
      </section>

      <section>
        <h2>Posting content</h2>
        <p>
          When you post a referral link, nickname, bio, comment, or scheme suggestion, you're
          responsible for what you post. Don't post anything illegal, deceptive, or a link you're
          not entitled to share. We reserve the right to remove content that violates these terms
          or applicable law.
        </p>
        <p>
          As explained in our <a href="/privacy">Privacy Policy</a>, this site runs on an honor
          system: there's no strict per-account access control behind the scenes. Don't rely on any
          content here as permanently under your exclusive control.
        </p>
      </section>

      <section>
        <h2>No financial advice</h2>
        <p>
          Nothing on this site is financial, investment, or legal advice. Referral programs for
          crypto exchanges and financial platforms carry real risk — do your own research before
          signing up for or funding any account.
        </p>
      </section>

      <section>
        <h2>Availability</h2>
        <p>
          We don't guarantee the site will always be available, error-free, or that any specific
          referral link or program will remain listed. Features may change or be removed at any
          time.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          Referralbot.online is provided "as is." We're not liable for losses arising from your use
          of any third-party service you find through this site, including changes to referral
          terms, account issues, or financial loss on a linked platform.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms? See the <a href="/contact">Contact</a> page.
        </p>
      </section>
    </main>
  );
}
