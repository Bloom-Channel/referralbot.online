"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { setLocalIdentity } from "@/lib/local-identity";
import { checkLottieDuration, checkVideoDuration, isLottieFile } from "@/lib/avatar";
import LottieAvatar from "./lottie-avatar";

export default function AuthModal({
  onClose,
  onIdentified,
  showAvatar = false,
}: {
  onClose: () => void;
  onIdentified?: (id: string, nickname: string) => void;
  showAvatar?: boolean;
}) {
  const supabase = createClient();
  const [nickname, setNickname] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const continueWithGoogle = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

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

  const claimNickname = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const { data, error: insertErr } = await supabase
      .from("profiles")
      .insert({ nickname })
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
      const path = `${data.id}-${avatarFile.name}`;
      const contentType = avatarFile.type || (isLottieFile(avatarFile) ? "application/gzip" : undefined);
      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true, contentType });
      if (!uploadErr) {
        const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
        avatar_url = pub.publicUrl;
        await supabase.from("profiles").update({ avatar_url }).eq("id", data.id);
      }
    }

    setSaving(false);
    setLocalIdentity(data.id, data.nickname, avatar_url);
    onIdentified?.(data.id, data.nickname);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2>Sign in</h2>
        <p>Sign in with Google, or pick a nickname to continue as a guest.</p>

        <button type="button" className="google-btn" onClick={continueWithGoogle} disabled={googleLoading}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.71v2.26h2.91c1.7-1.57 2.69-3.87 2.69-6.61z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.19l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.35 0-4.34-1.58-5.05-3.71H.98v2.33A9 9 0 009 18z" />
            <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.98A9 9 0 000 9c0 1.45.35 2.83.98 4.03l2.97-2.33z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.98 4.97l2.97 2.33C4.66 5.16 6.65 3.58 9 3.58z" />
          </svg>
          {googleLoading ? "Redirecting…" : "Continue with Google"}
        </button>

        <div className="divider"><span>or</span></div>

        <form onSubmit={claimNickname}>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname"
            minLength={3}
            maxLength={24}
            required
          />
          {showAvatar && (
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
          )}
          <button type="submit" disabled={saving}>
            {saving ? "Checking…" : "Continue as guest"}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
