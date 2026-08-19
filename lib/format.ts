const usdFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatUsd(value: number) {
  return usdFormatter.format(value);
}

// Display-only capitalization — never applied to stored/compared values.
export function displayName(nickname: string | null | undefined) {
  if (!nickname) return nickname ?? "";
  return nickname.charAt(0).toUpperCase() + nickname.slice(1);
}
