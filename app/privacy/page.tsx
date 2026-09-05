export const metadata = {
  title: "Privacy Policy",
  description: "How Referralbot.online collects, stores, and uses data.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: September 2026</p>

      <section>
        <h2>What this site is</h2>
        <p>
          Referralbot.online is a directory where people post and discover referral links for
          crypto exchanges, shopping apps, web hosting, and similar services. This policy explains
          what information the site collects and how it's used.
        </p>
      </section>

      <section>
        <h2>Information we collect</h2>
        <p><strong>If you use the site as a guest</strong> (no sign-in), we store a randomly
          generated ID, the nickname you choose, and an optional display picture in your browser's
          local storage and in our database. We don't collect your email, real name, or any other
          personal detail unless you choose to sign in with Google.</p>
        <p><strong>If you sign in with Google</strong>, we receive your Google account ID and use
          it to link your session to a profile. We do not receive or store your Google password.</p>
        <p><strong>Content you post</strong> — referral links, your nickname, bio, comments, and
          scheme suggestions — is stored in our database and shown publicly on the site.</p>
        <p><strong>Visitor counting</strong> — we store a random, non-identifying ID in your
          browser to count unique visits to the site. This isn't linked to any personal
          information.</p>
      </section>

      <section>
        <h2>How data is stored — please read this part</h2>
        <p>
          This site currently runs on an honor-system model: there is no password-based login for
          guest accounts, and the database rows behind referral links, comments, and profiles are
          openly readable and writable by design. In practice this means content you post is public
          and could technically be edited by another user of the site. We don't recommend posting
          any sensitive personal information in your nickname, bio, or comments.
        </p>
      </section>

      <section>
        <h2>Cookies and advertising</h2>
        <p>
          We use local storage (not traditional cookies) to remember your identity and theme
          preference. If this site displays ads through Google AdSense, Google and its partners may
          use cookies to serve ads based on your visits to this and other sites. You can opt out of
          personalized advertising by visiting{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            Google's Ads Settings
          </a>.
        </p>
      </section>

      <section>
        <h2>Third parties</h2>
        <p>
          We use Supabase to store data and Render to host the site. Neither is authorized to use
          your data for anything beyond running this site. If you sign in with Google, that
          authentication is handled by Google and Supabase's authentication service.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          You can delete your own referral links at any time from the platform page they're posted
          on. To request removal of other data associated with your guest account, reach out via
          the contact page.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about this policy? See the <a href="/contact">Contact</a> page.
        </p>
      </section>
    </main>
  );
}
