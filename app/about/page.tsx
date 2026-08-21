export const metadata = {
  title: "About Us",
  description: "The story behind ReferHub — a home for real, sourced referral links.",
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <h1>About Us</h1>

      <section className="about-post">
        <h2>Hello World</h2>
        <p>
          Hi, I'm the person behind ReferHub. I built this site because every time I went looking
          for a referral link — for an exchange, a shopping app, a hosting plan — I'd end up
          wading through forum posts and expired codes, never quite sure if the numbers being
          promised were real. So I started keeping my own list, and eventually decided it was
          worth building properly and sharing.
        </p>
        <p>
          ReferHub is that list, opened up: a place to post and find referral links across crypto
          exchanges, shopping apps, web hosting, and privacy tools — with dollar values sourced
          from each program's actual terms, not invented ones. If a program doesn't have an honest
          flat figure to quote, we say so instead of guessing.
        </p>
        <p>
          It's early days, and the site will keep changing as more people use it. Thanks for
          stopping by — and if you've got a referral program we're missing, the "New Scheme"
          button in the header is there for exactly that.
        </p>
      </section>
    </main>
  );
}
