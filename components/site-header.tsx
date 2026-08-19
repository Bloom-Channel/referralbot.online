"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getLocalAvatarUrl, getLocalNickname } from "@/lib/local-identity";
import { isLottieAvatar, isVideoAvatar } from "@/lib/avatar";
import { displayName } from "@/lib/format";
import AuthModal from "./auth-modal";
import PostLinkModal from "./post-link-modal";
import NewSchemeModal from "./new-scheme-modal";
import LottieAvatar from "./lottie-avatar";

export default function SiteHeader() {
  const [nickname, setNickname] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [showScheme, setShowScheme] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      setNickname(getLocalNickname());
      setAvatarUrl(getLocalAvatarUrl());
    };
    sync();
    window.addEventListener("identity-changed", sync);
    return () => window.removeEventListener("identity-changed", sync);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <div className="site-header-actions">
            <button type="button" className="post-link-btn" onClick={() => setShowScheme(true)}>
              New Scheme
            </button>
            <button type="button" className="post-link-btn" onClick={() => setShowPost(true)}>
              + Post referral link
            </button>
            {nickname ? (
              <div className="account-menu-wrap" ref={menuRef}>
                <button type="button" className="account-pill" onClick={() => setShowAccountMenu((v) => !v)}>
                  {displayName(nickname)}
                  {avatarUrl ? (
                    isVideoAvatar(avatarUrl) ? (
                      <video src={avatarUrl} className="account-pill-avatar" autoPlay loop muted playsInline />
                    ) : isLottieAvatar(avatarUrl) ? (
                      <LottieAvatar src={avatarUrl} className="account-pill-avatar" />
                    ) : (
                      <img src={avatarUrl} alt="" className="account-pill-avatar" />
                    )
                  ) : (
                    <span className="account-pill-initial">{nickname[0]?.toUpperCase()}</span>
                  )}
                </button>
                {showAccountMenu && (
                  <div className="account-menu">
                    <Link href="/settings" className="account-menu-item" onClick={() => setShowAccountMenu(false)}>
                      Settings
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <button type="button" className="signin-btn" onClick={() => setShowAuth(true)}>
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showPost && <PostLinkModal onClose={() => setShowPost(false)} />}
      {showScheme && <NewSchemeModal onClose={() => setShowScheme(false)} />}
    </>
  );
}
