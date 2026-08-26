"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import AuthModal from "@/components/auth-modal";
import LottieAvatar from "@/components/lottie-avatar";
import { isLottieAvatar, isVideoAvatar } from "@/lib/avatar";
import { displayName } from "@/lib/format";

const AVATAR_COLORS = ["#f2b705", "#4fd1c5", "#ff6b6b", "#7c9eff", "#c792ea", "#66d9a6"];

function avatarColor(nickname: string) {
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) hash = nickname.charCodeAt(i) + hash * 31;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

type SortKey = "holder" | "uses";
type SortDir = "asc" | "desc";

function SortArrow({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      className={`sort-arrow${active ? " sort-arrow-active" : ""}${active && dir === "desc" ? " sort-arrow-desc" : ""}`}
    >
      <path d="M12 4v16M6 10l6-6 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PlatformClient({ platform, links, comments, myLink, userId, onDataChange }: any) {
  const supabase = createClient();
  const [linkValue, setLinkValue] = useState(myLink?.link ?? "");
  const [saving, setSaving] = useState(false);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [useCounts, setUseCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(links.map((l: any) => [l.id, l.use_count ?? 0]))
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  };

  const sortedLinks = useMemo(() => {
    if (!sortKey) return links;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...links].sort((a: any, b: any) => {
      if (sortKey === "holder") {
        const an = (a.profiles?.nickname ?? "anon").toLowerCase();
        const bn = (b.profiles?.nickname ?? "anon").toLowerCase();
        return an < bn ? -1 * dir : an > bn ? 1 * dir : 0;
      }
      const av = useCounts[a.id] ?? 0;
      const bv = useCounts[b.id] ?? 0;
      return (av - bv) * dir;
    });
  }, [links, sortKey, sortDir, useCounts]);

  useEffect(() => {
    setUseCounts((prev) => {
      const next = { ...prev };
      for (const l of links) if (!(l.id in next)) next[l.id] = l.use_count ?? 0;
      return next;
    });
  }, [links]);

  useEffect(() => {
    setLinkValue(myLink?.link ?? "");
  }, [myLink?.link]);

  const copyLink = async (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
    setUseCounts((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
    await supabase.rpc("increment_link_use", { link_id: id });
  };

  const deleteLink = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setConfirmDeleteId(null);
    await supabase.from("referral_links").delete().eq("id", id);
    await onDataChange();
  };

  const saveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setShowAuth(true);
      return;
    }
    setSaveError("");
    const trimmed = linkValue.trim();

    const { data: duplicates } = await supabase
      .from("referral_links")
      .select("id, platform_id, platforms(name)")
      .eq("user_id", userId)
      .eq("link", trimmed)
      .neq("platform_id", platform.id);

    if (duplicates && duplicates.length > 0) {
      const otherPlatform = (duplicates[0] as any).platforms?.name ?? "another platform";
      setSaveError(`You've already posted this exact link under ${otherPlatform}. Use a different link for each platform.`);
      return;
    }

    setSaving(true);
    await supabase
      .from("referral_links")
      .upsert(
        { user_id: userId, platform_id: platform.id, link: trimmed, updated_at: new Date().toISOString() },
        { onConflict: "user_id,platform_id" }
      );
    setSaving(false);
    await onDataChange();
  };

  const postComment = async (referralLinkId: string) => {
    const body = commentDrafts[referralLinkId]?.trim();
    if (!body) return;
    if (!userId) {
      setShowAuth(true);
      return;
    }
    await supabase.from("comments").insert({ referral_link_id: referralLinkId, user_id: userId, body });
    setCommentDrafts((d) => ({ ...d, [referralLinkId]: "" }));
    await onDataChange();
  };

  const onIdentified = async () => {
    setShowAuth(false);
    await onDataChange();
  };

  const commentsFor = (linkId: string) => comments.filter((c: any) => c.referral_link_id === linkId);

  return (
    <main className="platform-page">
      <div className="platform-header">
        {platform?.logo_url && <img src={platform.logo_url} alt="" className="platform-icon" />}
        <h1>{platform?.name}</h1>
      </div>

      {(platform?.signup_url || platform?.referral_info_url) && (
        <div className="platform-links-row">
          {platform?.signup_url && (
            <a href={platform.signup_url} target="_blank" rel="noopener noreferrer" className="platform-link-btn">
              Register on {platform.name}
            </a>
          )}
          {platform?.referral_info_url && (
            <a
              href={platform.referral_info_url}
              target="_blank"
              rel="noopener noreferrer"
              className="platform-link-btn platform-link-btn-secondary"
            >
              {platform.name} referral info page
            </a>
          )}
        </div>
      )}

      <section className="my-link">
        <h2>Your referral link</h2>
        <form onSubmit={saveLink}>
          <input
            type="url"
            placeholder="https://…"
            value={linkValue}
            onChange={(e) => {
              setLinkValue(e.target.value);
              setSaveError("");
            }}
            required
          />
          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
        {!userId && <p className="hint">Saving will ask you to sign in or pick a guest nickname first.</p>}
        {saveError && <p className="error">{saveError}</p>}
      </section>

      <section className="all-links">
        <h2>Shared by the community</h2>
        {links.length === 0 && <p>No one has shared a link for {platform?.name} yet.</p>}
        {links.length > 0 && (
          <div className="referral-table-wrap">
            <table className="referral-table">
              <thead>
                <tr>
                  <th className="sortable-th" onClick={() => toggleSort("holder")}>
                    Nickname
                    <SortArrow active={sortKey === "holder"} dir={sortKey === "holder" ? sortDir : "asc"} />
                  </th>
                  <th>Referral code</th>
                  <th className="sortable-th" onClick={() => toggleSort("uses")}>
                    Uses
                    <SortArrow active={sortKey === "uses"} dir={sortKey === "uses" ? sortDir : "asc"} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedLinks.map((l: any) => {
                  const nickname = l.profiles?.nickname ?? "anon";
                  const isExpanded = expandedId === l.id;
                  const linkComments = commentsFor(l.id);
                  return (
                    <Fragment key={l.id}>
                      <tr
                        className="referral-row"
                        onClick={() => setExpandedId(isExpanded ? null : l.id)}
                      >
                        <td>
                          <div className="holder-cell">
                            {l.profiles?.avatar_url ? (
                              isVideoAvatar(l.profiles.avatar_url) ? (
                                <video src={l.profiles.avatar_url} className="avatar avatar-img" autoPlay loop muted playsInline />
                              ) : isLottieAvatar(l.profiles.avatar_url) ? (
                                <LottieAvatar src={l.profiles.avatar_url} className="avatar avatar-img" />
                              ) : (
                                <img src={l.profiles.avatar_url} alt="" className="avatar avatar-img" />
                              )
                            ) : (
                              <span className="avatar" style={{ background: avatarColor(nickname) }}>
                                {nickname[0]?.toUpperCase()}
                              </span>
                            )}
                            <Link href={`/user/${l.user_id}`} onClick={(e) => e.stopPropagation()}>
                              {displayName(nickname)}
                            </Link>
                          </div>
                        </td>
                        <td>
                          <div className="code-cell">
                            <span className="code-text" title={l.link}>
                              {l.code || l.link}
                            </span>
                            <button
                              type="button"
                              className="copy-icon-btn"
                              aria-label="Copy referral link"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyLink(l.id, l.link);
                              }}
                            >
                              {copiedId === l.id ? (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                  <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" />
                                </svg>
                              )}
                            </button>
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(l.link)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="whatsapp-share-btn"
                              aria-label="Share on WhatsApp"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11a16.3 16.3 0 0 1-1.65-.6c-2.9-1.25-4.8-4.15-4.94-4.35-.15-.19-1.19-1.58-1.19-3.01 0-1.43.75-2.14 1.02-2.43.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2.01.89 2.16.07.15.12.32.02.52-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.28-.12.55.15.27.68 1.12 1.46 1.82 1 .9 1.85 1.18 2.12 1.32.27.14.43.11.59-.07.15-.18.65-.76.83-1.02.17-.27.34-.22.58-.13.24.09 1.52.72 1.78.85.27.13.45.19.51.3.07.11.07.62-.17 1.3Z" />
                              </svg>
                            </a>
                            {userId && l.user_id === userId && (
                              <button
                                type="button"
                                className={`delete-icon-btn${confirmDeleteId === l.id ? " delete-icon-btn-confirm" : ""}`}
                                aria-label={confirmDeleteId === l.id ? "Confirm delete" : "Delete referral link"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteLink(l.id);
                                }}
                                onMouseLeave={() => confirmDeleteId === l.id && setConfirmDeleteId(null)}
                              >
                                {confirmDeleteId === l.id ? (
                                  "Confirm?"
                                ) : (
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                    <path
                                      d="M4 7h16M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m2 0v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="uses-cell">{useCounts[l.id] ?? 0}</td>
                      </tr>
                      {isExpanded && (
                        <tr className="comments-row">
                          <td colSpan={3}>
                            <div className="comments">
                              {linkComments.map((c: any) => (
                                <p key={c.id}>
                                  <strong>{displayName(c.profiles?.nickname)}:</strong> {c.body}
                                </p>
                              ))}
                              <div className="comment-form" onClick={(e) => e.stopPropagation()}>
                                <input
                                  placeholder="Add a comment…"
                                  value={commentDrafts[l.id] ?? ""}
                                  onChange={(e) => setCommentDrafts((d) => ({ ...d, [l.id]: e.target.value }))}
                                />
                                <button onClick={() => postComment(l.id)}>Post</button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onIdentified={onIdentified} showAvatar />}
    </main>
  );
}