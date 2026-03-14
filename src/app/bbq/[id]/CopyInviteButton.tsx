"use client";

import { useState } from "react";

interface CopyInviteButtonProps {
  url: string;
}

export default function CopyInviteButton({ url }: CopyInviteButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
      aria-label={copied ? "Link copied to clipboard" : "Copy invite link"}
    >
      {copied ? (
        <>
          <span aria-hidden="true">✓</span>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <span aria-hidden="true">🔗</span>
          <span>Copy invite link</span>
        </>
      )}
    </button>
  );
}
