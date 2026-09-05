export const metadata = {
  title: "Contact",
  description: "Get in touch with Referralbot.online.",
};

export default function ContactPage() {
  return (
    <main className="legal-page">
      <h1>Contact</h1>
      <p>
        Got a question, found a bug, or want to report a referral link that's wrong or against
        these terms? The fastest way to reach us is on X:
      </p>
      <p>
        <a href="https://x.com/ReferralsWeb" target="_blank" rel="noopener noreferrer">
          @ReferralsWeb
        </a>
      </p>
      <p>
        If you'd rather suggest a missing referral program instead, use the "New Scheme" button in
        the site header — it goes straight into our review queue.
      </p>
    </main>
  );
}
