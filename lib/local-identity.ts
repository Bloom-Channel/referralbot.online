// No login in this app. Each browser gets a random ID stored in
// localStorage, tied to a chosen nickname. This is a convenience
// for "which links are mine" in the UI — it is NOT secure identity.
// See supabase/schema.sql notes: all rows are publicly writable.

const ID_KEY = "referhub_user_id";
const NICKNAME_KEY = "referhub_nickname";
const AVATAR_KEY = "referhub_avatar_url";
const VISITOR_ID_KEY = "referhub_visitor_id";

// Separate from the guest/user identity above — this one exists purely to
// count unique visitors once per browser, even for people who never sign
// in or pick a nickname.
export function getOrCreateVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

export function getLocalUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ID_KEY);
}

export function getLocalNickname(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(NICKNAME_KEY);
}

export function getLocalAvatarUrl(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AVATAR_KEY);
}

export function setLocalIdentity(id: string, nickname: string, avatarUrl?: string | null) {
  localStorage.setItem(ID_KEY, id);
  localStorage.setItem(NICKNAME_KEY, nickname);
  if (avatarUrl) {
    localStorage.setItem(AVATAR_KEY, avatarUrl);
  } else {
    localStorage.removeItem(AVATAR_KEY);
  }
  window.dispatchEvent(new Event("identity-changed"));
}

export function clearLocalIdentity() {
  localStorage.removeItem(ID_KEY);
  localStorage.removeItem(NICKNAME_KEY);
  localStorage.removeItem(AVATAR_KEY);
  window.dispatchEvent(new Event("identity-changed"));
}
