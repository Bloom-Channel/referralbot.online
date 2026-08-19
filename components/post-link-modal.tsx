"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const CATEGORY_LABELS: Record<string, string> = {
  crypto: "Crypto Exchanges",
  shopping: "Shopping",
  other: "More",
};

export default function PostLinkModal({ onClose }: { onClose: () => void }) {
  const supabase = createClient();
  const router = useRouter();
  const [grouped, setGrouped] = useState<Map<string, any[]>>(new Map());

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("platforms").select("*").order("sort_order");
      const g = new Map<string, any[]>();
      (data ?? []).forEach((p) => {
        const arr = g.get(p.category) ?? [];
        arr.push(p);
        g.set(p.category, arr);
      });
      setGrouped(g);
    })();
  }, []);

  const goToPlatform = (id: number) => {
    onClose();
    router.push(`/platform/${id}`);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal platform-picker-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2>Post a referral link</h2>
        <p>Pick which platform your link is for.</p>

        <div className="platform-picker-list">
          {[...grouped.entries()].map(([category, items]) => (
            <div key={category} className="platform-picker-group">
              <span className="platform-picker-label">{CATEGORY_LABELS[category] ?? category}</span>
              {items.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="platform-picker-item"
                  onClick={() => goToPlatform(p.id)}
                >
                  {p.logo_url && <img src={p.logo_url} alt="" />}
                  {p.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
