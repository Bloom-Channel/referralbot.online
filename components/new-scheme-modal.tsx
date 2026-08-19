"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { getLocalUserId } from "@/lib/local-identity";

export default function NewSchemeModal({ onClose }: { onClose: () => void }) {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error: insertErr } = await supabase.from("scheme_suggestions").insert({
      user_id: getLocalUserId(),
      name: name.trim(),
      link: link.trim() || null,
      notes: notes.trim() || null,
    });

    setSaving(false);

    if (insertErr) {
      setError(insertErr.message);
      return;
    }

    setDone(true);
    setTimeout(onClose, 1400);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2>Suggest a new scheme</h2>
        <p>Know an exchange or platform with a referral program we're missing? Tell us about it.</p>

        {done ? (
          <p className="success-msg">Thanks! We'll take a look. 🎉</p>
        ) : (
          <form onSubmit={submit}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Platform name (e.g. Gemini)"
              minLength={2}
              maxLength={60}
              required
            />
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Link to their referral program (optional)"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything else worth knowing? (optional)"
              rows={3}
            />
            <button type="submit" disabled={saving}>
              {saving ? "Sending…" : "Send suggestion"}
            </button>
          </form>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
