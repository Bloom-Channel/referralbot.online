"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { isLottieAvatar, isVideoAvatar } from "@/lib/avatar";
import LottieAvatar from "@/components/lottie-avatar";
import { displayName } from "@/lib/format";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [featured, setFeatured] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: profileData } = await supabase.from("profiles").select("id, nickname, avatar_url, bio").eq("id", userId).single();
      const { data: featuredData } = await supabase
        .from("featured_links")
        .select("*")
        .eq("user_id", userId)
        .order("position");
      const { data: historyData } = await supabase
        .from("referral_links")
        .select("id, link, code, use_count, updated_at, platforms(name, logo_url)")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      setProfile(profileData);
      setFeatured(featuredData ?? []);
      setHistory(historyData ?? []);
      setLoading(false);
    })();
  }, [userId]);

  const copy = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (loading) return <main><p>Loading…</p></main>;

  if (!profile) {
    return (
      <main>
        <h1>Profile not found</h1>
      </main>
    );
  }

  const avatarUrl = profile.avatar_url;

  return (
    <main className="profile-page">
      <div className="profile-header">
        {avatarUrl ? (
          isVideoAvatar(avatarUrl) ? (
            <video src={avatarUrl} className="profile-avatar" autoPlay loop muted playsInline />
          ) : isLottieAvatar(avatarUrl) ? (
            <LottieAvatar src={avatarUrl} className="profile-avatar" />
          ) : (
            <img src={avatarUrl} alt="" className="profile-avatar" />
          )
        ) : (
          <span className="profile-avatar profile-avatar-initial">{profile.nickname[0]?.toUpperCase()}</span>
        )}
        <div className="profile-header-text">
          <h1>{displayName(profile.nickname)}</h1>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        </div>
      </div>

      {featured.length > 0 && (
        <section>
          <h2>Main links</h2>
          <div className="card-grid">
            {featured.map((f) => (
              <div key={f.id} className="card featured-link-card">
                <h3>{f.label || "Referral link"}</h3>
                <div className="code-cell">
                  <span className="code-text" title={f.link}>
                    {f.link}
                  </span>
                  <button type="button" className="copy-icon-btn" onClick={() => copy(f.id, f.link)}>
                    {copiedId === f.id ? "Copied" : "Copy"}
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(f.link)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-share-btn"
                    aria-label="Share on WhatsApp"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11a16.3 16.3 0 0 1-1.65-.6c-2.9-1.25-4.8-4.15-4.94-4.35-.15-.19-1.19-1.58-1.19-3.01 0-1.43.75-2.14 1.02-2.43.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2.01.89 2.16.07.15.12.32.02.52-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.28-.12.55.15.27.68 1.12 1.46 1.82 1 .9 1.85 1.18 2.12 1.32.27.14.43.11.59-.07.15-.18.65-.76.83-1.02.17-.27.34-.22.58-.13.24.09 1.52.72 1.78.85.27.13.45.19.51.3.07.11.07.62-.17 1.3Z" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2>History</h2>
        {history.length === 0 && <p>No referral links posted yet.</p>}
        {history.length > 0 && (
          <div className="referral-table-wrap">
            <table className="referral-table">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Referral code</th>
                  <th>Uses</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <div className="holder-cell">
                        {h.platforms?.logo_url && <img src={h.platforms.logo_url} alt="" className="avatar avatar-img" />}
                        {h.platforms?.name}
                      </div>
                    </td>
                    <td className="code-text">{h.code || h.link}</td>
                    <td className="uses-cell">{h.use_count}</td>
                    <td className="uses-cell">{new Date(h.updated_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
