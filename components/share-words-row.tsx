"use client";

import { SHARE_WORDS } from "@/lib/share-words";

// Inserts a "Share"/"Refer" marker card after every 5 translated words,
// alternating between the two.
function withMarkers(words: string[]) {
  const result: { text: string; marker: boolean }[] = [];
  let markerToggle = 0;
  words.forEach((word, i) => {
    result.push({ text: word, marker: false });
    if ((i + 1) % 5 === 0) {
      result.push({ text: markerToggle % 2 === 0 ? "Share" : "Refer", marker: true });
      markerToggle++;
    }
  });
  return result;
}

export default function ShareWordsRow({ heading = true }: { heading?: boolean }) {
  // Duplicated so the marquee can loop seamlessly at -50%.
  const base = withMarkers(SHARE_WORDS);
  const words = [...base, ...base];

  const marquee = (
    <div className="share-words-row">
      <div className="share-words-track">
        {words.map((item, i) => {
          const colorClass = i % 2 === 0 ? "share-word-silver" : "share-word-darkgrey";
          const className = item.marker
            ? `share-word-card share-word-card-marker ${colorClass}`
            : `share-word-card ${colorClass}`;
          return (
            <span key={i} className={className}>
              {item.text}
            </span>
          );
        })}
      </div>
    </div>
  );

  if (!heading) return marquee;

  return (
    <section>
      <h2>Share &amp; Refer, Worldwide</h2>
      {marquee}
    </section>
  );
}
