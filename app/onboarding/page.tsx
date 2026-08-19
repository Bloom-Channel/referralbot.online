"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { setLocalIdentity } from "@/lib/local-identity";
import { checkLottieDuration, checkVideoDuration, isLottieFile } from "@/lib/avatar";
import LottieAvatar from "@/components/lottie-avatar";

export default function Onboarding() {
  const supabase = createClient();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [nickname, setNickname] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        router.replace("/");
        return;
      }

      const { data: existing } = await supabase
        .from("profiles")
        .select("id, nickname, avatar_url")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (existing) {
        setLocalIdentity(existing.id, existing.nickname, existing.avatar_url);
        router.replace("/dashboard");
        return;
      }

      setChecking(false);
    })();
  }, []);

  const pickAvatar = async (file: File | null) => {
    setError("");
    if (file?.type.startsWith("video/")) {
      const check = await checkVideoDuration(file);
      if (!check.ok) {
        setError(check.message);
        return;
      }
    } else if (file && isLottieFile(file)) {
      const check = await checkLottieDuration(file);
      if (!check.ok) {
        setError(check.message);
        return;
      }
    }
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setError("Not signed in.");
      setSaving(false);
      return;
    }

    const { data: profile, error: insertErr } = await supabase
      .from("profiles")
      .insert({ nickname, auth_user_id: user.id })
      .select()
      .single();

    if (insertErr) {
      setSaving(false);
      setError(
        insertErr.message.includes("duplicate")
          ? "That nickname is already taken."
          : insertErr.message
      );
      return;
    }

    let avatar_url: string | undefined;
    if (avatarFile) {
      const path = `${profile.id}-${avatarFile.name}`;
      const contentType = avatarFile.type || (isLottieFile(avatarFile) ? "application/gzip" : undefined);
      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true, contentType });
      if (!uploadErr) {
        const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
        avatar_url = pub.publicUrl;
        await supabase.from("profiles").update({ avatar_url }).eq("id", profile.id);
      }
    }

    setSaving(false);
    setLocalIdentity(profile.id, profile.nickname, avatar_url);
    router.push("/dashboard");
  };

  if (checking) return null;

  return (
    <main className="landing">
      <h1>One last step</h1>
      <p>Pick a nickname to finish setting up your account.</p>
      <form onSubmit={handleSubmit}>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Nickname"
          minLength={3}
          maxLength={24}
          required
        />
        <label className="avatar-dropzone">
          {avatarPreview ? (
            avatarFile?.type.startsWith("video/") ? (
              <video src={avatarPreview} className="avatar-dropzone-preview" autoPlay loop muted playsInline />
            ) : avatarFile && isLottieFile(avatarFile) ? (
              <LottieAvatar file={avatarFile} className="avatar-dropzone-preview" />
            ) : (
              <img src={avatarPreview} alt="" className="avatar-dropzone-preview" />
            )
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          <span>{avatarFile ? avatarFile.name : "Add a photo, sticker (incl. TGS), GIF, SVG, or 1s video (optional)"}</span>
          <input
            type="file"
            accept="image/*,image/webp,image/svg+xml,video/mp4,video/webm,video/quicktime,.tgs,.json"
            onChange={(e) => pickAvatar(e.target.files?.[0] ?? null)}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Continue"}
        </button>
      </form>
    </main>
  );
}
