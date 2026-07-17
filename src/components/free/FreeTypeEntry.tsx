"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { hasKeyForChar } from "@/lib/keyboard";
import { looksLikeZawgyi, normalizeMyanmar } from "@/lib/myanmar";
import {
  clearFreeTypeDraft,
  loadFreeTypeDraft,
  MAX_FREE_TYPE_CHARACTERS,
  saveFreeTypeDraft,
} from "@/lib/storage";

const PLACEHOLDER =
  "သီဟိုဠ်မှ ဉာဏ်ကြီးရှင်သည် အာယုဝဍ္ဎနဆေးညွှန်းစာကို ဇလွန်ဈေးဘေး ဗာဒံပင်ထက် အဓိဋ္ဌာန်လျက် ဂဃနဏဖတ်ခဲ့သည်။";
export function FreeTypeEntry() {
  const [text, setText] = useState(PLACEHOLDER);
  const router = useRouter();

  useEffect(() => {
    const draft = loadFreeTypeDraft();
    if (draft) setText(draft);
  }, []);

  const normalizedText = normalizeMyanmar(text);
  const zawgyi = looksLikeZawgyi(normalizedText);
  const unsupported = unsupportedChars(normalizedText);
  const characterCount = Array.from(normalizedText).length;
  const tooLong = characterCount > MAX_FREE_TYPE_CHARACTERS;
  const canStart =
    normalizedText.trim().length > 0 && unsupported.length === 0 && !tooLong;

  const start = () => {
    if (!canStart) return;
    saveFreeTypeDraft(normalizedText);
    router.push("/free/session");
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => {
          const nextText = e.target.value;
          setText(nextText);
          if (!nextText.trim()) clearFreeTypeDraft();
        }}
        aria-describedby="free-type-status"
        lang="my"
        className="w-full min-h-45 sm:min-h-55 p-5 mt-surface mt-myanmar text-xl sm:text-2xl leading-snug outline-none resize-y"
        style={{ background: "var(--mt-surface)" }}
      />
      {!text.trim() && (
        <div className="mt-3 flex flex-col gap-2 border border-dashed border-border-soft px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-soft">
            Paste Myanmar Unicode text, or start with the sample.
          </p>
          <button
            type="button"
            onClick={() => setText(PLACEHOLDER)}
            className="mt-action mt-action-outline shrink-0 border border-border-soft px-3 py-1.5 text-xs tracking-widest text-ink uppercase"
          >
            Use sample text
          </button>
        </div>
      )}
      {zawgyi && (
        <div
          className="mt-3 px-3 py-2 text-xs leading-relaxed border"
          style={{
            borderColor: "var(--mt-error)",
            color: "var(--mt-error)",
          }}
        >
          ⚠ This text looks like it may be <strong>Zawgyi</strong>-encoded.
          MyanTyper expects Unicode. Paste Unicode text, or convert it first, or
          the keystroke hints will be wrong.
        </div>
      )}
      {unsupported.length > 0 && (
        <div
          className="mt-3 px-3 py-2 text-xs leading-relaxed border"
          style={{
            borderColor: "var(--mt-error)",
            color: "var(--mt-error)",
          }}
        >
          Remove unsupported characters before starting:{" "}
          <span className="mt-myanmar text-sm">
            {unsupported.map(displayChar).join(" ")}
          </span>
        </div>
      )}
      {tooLong && (
        <div
          className="mt-3 px-3 py-2 text-xs leading-relaxed border"
          style={{
            borderColor: "var(--mt-error)",
            color: "var(--mt-error)",
          }}
        >
          Keep Free Type text at or below {MAX_FREE_TYPE_CHARACTERS} Unicode
          characters to avoid slowing down the typing session.
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between sm:items-center mt-3.5">
        <div
          id="free-type-status"
          className="text-xs text-ink-soft tracking-widest"
        >
          {characterCount} / {MAX_FREE_TYPE_CHARACTERS} CHARACTERS
        </div>
        <button
          type="button"
          onClick={start}
          disabled={!canStart}
          className="mt-action mt-action-primary px-4 py-2 text-xs tracking-widest uppercase bg-accent text-accent-ink border border-accent disabled:opacity-45 disabled:cursor-not-allowed"
        >
          ▸ Start typing
        </button>
      </div>
    </div>
  );
}

function unsupportedChars(text: string): string[] {
  const seen = new Set<string>();
  for (const ch of Array.from(text)) {
    if (!hasKeyForChar(ch)) seen.add(ch);
  }
  return [...seen];
}

function displayChar(ch: string): string {
  if (ch === "\t") return "TAB";
  if (ch === "\r") return "RETURN";
  return ch;
}
