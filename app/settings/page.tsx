"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { getLocalUserId, setLocalIdentity } from "@/lib/local-identity";
import { getStoredTheme, applyTheme, type Theme } from "@/lib/theme";
import { checkLottieDuration, checkVideoDuration, isLottieFile } from "@/lib/avatar";
import LottieAvatar from "@/components/lottie-avatar";
import AuthModal from "@/components/auth-modal";
import ThemeSpinner from "@/components/theme-spinner";

function PenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="pen-icon">
      <path
        d="M4 20h4l10.5-10.5a2 2 0 0 0 0-2.83l-1.17-1.17a2 2 0 0 0-2.83 0L4 16v4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.5 6.5 17.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function SettingsPage() {
  const supabase = createClient();
  const userId = getLocalUserId();

  const [theme, setTheme] = useState<Theme>("dark");
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<any>(null);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState("");

  const [featured, setFeatured] = useState<Record<1 | 2, { label: string; link: string }>>({
    1: { label: "", link: "" },
    2: { label: "", link: "" },
  });

  const [history, setHistory] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveErr, setSaveErr] = useState("");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const saveBarRef = useRef<HTMLDivElement>(null);
  const [decorationStyle, setDecorationStyle] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const top = headingRef.current;
      const bottom = saveBarRef.current;
      if (top && bottom) {
        const topRect = top.getBoundingClientRect();
        const bottomRect = bottom.getBoundingClientRect();
        setDecorationStyle({ top: topRect.top, height: bottomRect.bottom - topRect.top });
      }
    };
    measure();
    const raf1 = requestAnimationFrame(() => requestAnimationFrame(measure));
    const timer = setTimeout(measure, 400);
    (document as any).fonts?.ready?.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
  }, [loading, featured, history]);

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", userId).single();
      setProfile(profileData);
      setNickname(profileData?.nickname ?? "");
      setBio(profileData?.bio ?? "");

      const { data: featuredData } = await supabase.from("featured_links").select("*").eq("user_id", userId);
      const f: Record<1 | 2, { label: string; link: string }> = { 1: { label: "", link: "" }, 2: { label: "", link: "" } };
      (featuredData ?? []).forEach((row: any) => {
        f[row.position as 1 | 2] = { label: row.label ?? "", link: row.link };
      });
      setFeatured(f);

      const { data: historyData } = await supabase
        .from("referral_links")
        .select("id, link, code, use_count, updated_at, platforms(name, logo_url)")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      setHistory(historyData ?? []);

      setLoading(false);
    })();
  }, [userId]);

  const switchTheme = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
  };

  const pickAvatar = async (file: File | null) => {
    setAvatarError("");
    if (file?.type.startsWith("video/")) {
      const check = await checkVideoDuration(file);
      if (!check.ok) {
        setAvatarError(check.message);
        return;
      }
    } else if (file && isLottieFile(file)) {
      const check = await checkLottieDuration(file);
      if (!check.ok) {
        setAvatarError(check.message);
        return;
      }
    }
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  };

  const saveAll = async () => {
    if (!userId) return;
    setSaving(true);
    setSaveMsg("");
    setSaveErr("");

    let avatarUrl = profile?.avatar_url;

    if (avatarFile) {
      const path = `${userId}-${avatarFile.name}`;
      const contentType = avatarFile.type || (isLottieFile(avatarFile) ? "application/gzip" : undefined);
      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true, contentType });
      if (uploadErr) {
        setSaving(false);
        setSaveErr(uploadErr.message);
        return;
      }
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      avatarUrl = pub.publicUrl;
    }

    const { error: profileErr } = await supabase
      .from("profiles")
      .update({ nickname, avatar_url: avatarUrl, bio: bio.trim() || null })
      .eq("id", userId);

    if (profileErr) {
      setSaving(false);
      setSaveErr(profileErr.message.includes("duplicate") ? "That nickname is already taken." : profileErr.message);
      return;
    }

    for (const pos of [1, 2] as const) {
      const entry = featured[pos];
      if (entry.link.trim()) {
        await supabase
          .from("featured_links")
          .upsert(
            { user_id: userId, position: pos, label: entry.label.trim() || null, link: entry.link.trim(), updated_at: new Date().toISOString() },
            { onConflict: "user_id,position" }
          );
      } else {
        await supabase.from("featured_links").delete().eq("user_id", userId).eq("position", pos);
      }
    }

    setProfile((p: any) => ({ ...p, nickname, avatar_url: avatarUrl, bio: bio.trim() || null }));
    setLocalIdentity(userId, nickname, avatarUrl);
    setAvatarFile(null);
    setAvatarPreview(null);
    setSaving(false);
    setSaveMsg("All changes saved.");
  };

  if (loading) return <main><p>Loading…</p></main>;

  if (!userId) {
    return (
      <main>
        <h1>Settings</h1>
        <p>Sign in or continue as a guest to manage your settings.</p>
        <button type="button" className="signin-btn" onClick={() => setShowAuth(true)}>
          Sign in
        </button>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onIdentified={() => window.location.reload()} />}
      </main>
    );
  }

  return (
    <main className="settings-page">
      <ThemeSpinner
        src="/spin-animation.json"
        className="settings-side-decoration"
        style={decorationStyle ? { top: decorationStyle.top, height: decorationStyle.height } : undefined}
      />
      <h1 ref={headingRef}>Settings</h1>

      <section>
        <h2>Theme</h2>
        <div className="theme-toggle">
          <button type="button" className={theme === "dark" ? "theme-btn active" : "theme-btn"} onClick={() => switchTheme("dark")}>
            Dark
          </button>
          <button type="button" className={theme === "light" ? "theme-btn active" : "theme-btn"} onClick={() => switchTheme("light")}>
            Light
          </button>
        </div>
      </section>

      <section>
        <h2>Display picture</h2>
        <label className="avatar-dropzone editable-field">
          {avatarPreview ? (
            avatarFile?.type.startsWith("video/") ? (
              <video src={avatarPreview} className="avatar-dropzone-preview" autoPlay loop muted playsInline />
            ) : avatarFile && isLottieFile(avatarFile) ? (
              <LottieAvatar file={avatarFile} className="avatar-dropzone-preview" />
            ) : (
              <img src={avatarPreview} alt="" className="avatar-dropzone-preview" />
            )
          ) : profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="avatar-dropzone-preview" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          <span>{avatarFile ? avatarFile.name : "Choose a photo, sticker, GIF, SVG, or 1s video"}</span>
          <PenIcon />
          <input
            type="file"
            accept="image/*,image/webp,image/svg+xml,video/mp4,video/webm,video/quicktime,.tgs,.json"
            onChange={(e) => pickAvatar(e.target.files?.[0] ?? null)}
          />
        </label>
        {avatarError && <p className="error">{avatarError}</p>}
      </section>

      <section>
        <h2>Nickname</h2>
        <div className="editable-field">
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} minLength={3} maxLength={24} required />
          <PenIcon />
        </div>
      </section>

      <section>
        <h2>Bio</h2>
        <p>A short line other users see under your photo on your public profile.</p>
        <div className="editable-field">
          <input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="e.g. Sharing the best crypto & shopping deals"
            maxLength={140}
          />
          <PenIcon />
        </div>
      </section>

      <section>
        <h2>Main referral links</h2>
        <p>Pin up to 2 links other users see when they open your profile.</p>
        {([1, 2] as const).map((pos) => (
          <div key={pos} className="featured-link-row editable-field">
            <input
              placeholder={`Label (e.g. "My Binance link")`}
              value={featured[pos].label}
              onChange={(e) => setFeatured((f) => ({ ...f, [pos]: { ...f[pos], label: e.target.value } }))}
            />
            <input
              type="url"
              placeholder="https://…"
              value={featured[pos].link}
              onChange={(e) => setFeatured((f) => ({ ...f, [pos]: { ...f[pos], link: e.target.value } }))}
            />
            <PenIcon />
          </div>
        ))}
        <p className="hint">
          <Link href={`/user/${userId}`}>View my public profile →</Link>
        </p>
      </section>

      <section>
        <h2>History</h2>
        {history.length === 0 && <p>You haven't posted any referral links yet.</p>}
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

      <div className="settings-save-bar" ref={saveBarRef}>
        <button type="button" onClick={saveAll} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        {saveMsg && <span className="hint">{saveMsg}</span>}
        {saveErr && <span className="error">{saveErr}</span>}
      </div>
    </main>
  );
}
