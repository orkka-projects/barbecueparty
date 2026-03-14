"use client";

import { useEffect, useState, useTransition } from "react";
import type { Prisma } from "@prisma/client";
import { claimItem, addItem } from "@/app/actions/items";

type BbqWithItemsAndClaims = Prisma.BbqGetPayload<{
  include: {
    items: {
      include: {
        claims: true;
      };
    };
  };
}>;

interface GuestJoinClientProps {
  bbq: BbqWithItemsAndClaims;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function GuestJoinClient({ bbq }: GuestJoinClientProps) {
  const [guestName, setGuestName] = useState<string>("");
  const [nameInput, setNameInput] = useState<string>("");
  const [newItemName, setNewItemName] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const storageKey = `bbq-guest-name-${bbq.id}`;

  // Load guest name from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(storageKey);
    if (stored) {
      setGuestName(stored);
    }
  }, [storageKey]);

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    sessionStorage.setItem(storageKey, trimmed);
    setGuestName(trimmed);
  }

  function handleClaimItem(itemId: string) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("itemId", itemId);
      fd.set("guestName", guestName);
      fd.set("bbqId", bbq.id);
      await claimItem(fd);
    });
  }

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newItemName.trim();
    if (!trimmed) return;
    setNewItemName("");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("bbqId", bbq.id);
      fd.set("itemName", trimmed);
      fd.set("guestName", guestName);
      await addItem(fd);
    });
  }

  // ── Name Entry Gate ──────────────────────────────────────────────────────────
  if (!guestName) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
        {/* BBQ Header */}
        <div className="w-full max-w-md mb-8 text-center">
          <div className="text-5xl mb-3">🔥</div>
          <h1 className="text-3xl font-bold text-orange-700">{bbq.name}</h1>
          <p className="mt-1 text-amber-700 font-medium">
            {formatDate(bbq.date)} · {formatTime(bbq.date)}
          </p>
          <p className="mt-1 text-amber-600 text-sm">{bbq.address}</p>
        </div>

        {/* Name Entry Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-amber-200 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            You&apos;re invited! 🎉
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Enter your name to see the item list and pitch in.
          </p>
          <form onSubmit={handleNameSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Your name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full border border-amber-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-base"
              autoFocus
              maxLength={60}
            />
            <button
              type="submit"
              disabled={!nameInput.trim()}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-200 text-white font-semibold py-3 rounded-xl transition-colors text-base min-h-[44px]"
            >
              Let&apos;s go 🍖
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main Guest View ──────────────────────────────────────────────────────────
  const unclaimedCount = bbq.items.filter((item) => item.claims.length === 0).length;

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="text-4xl mb-2">🔥</div>
          <h1 className="text-2xl font-bold">{bbq.name}</h1>
          <p className="mt-1 text-orange-100 text-sm font-medium">
            {formatDate(bbq.date)} · {formatTime(bbq.date)}
          </p>
          <p className="mt-1 text-orange-200 text-sm">{bbq.address}</p>
          <p className="mt-4 text-orange-100 text-sm">
            Welcome, <span className="font-bold text-white">{guestName}</span>! 👋
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Status bar */}
        <div className="mb-5 flex items-center gap-2 flex-wrap">
          <span className="bg-white border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
            {bbq.items.length} item{bbq.items.length !== 1 ? "s" : ""}
          </span>
          {unclaimedCount > 0 && (
            <span className="bg-red-100 border border-red-200 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
              {unclaimedCount} still needed
            </span>
          )}
          {unclaimedCount === 0 && bbq.items.length > 0 && (
            <span className="bg-green-100 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              ✓ Everything&apos;s covered!
            </span>
          )}
        </div>

        {/* Item List */}
        <div className="flex flex-col gap-3 mb-6">
          {bbq.items.length === 0 && (
            <div className="text-center py-10 text-amber-500 text-sm">
              No items yet. Add something below!
            </div>
          )}

          {bbq.items.map((item) => {
            const guestHasClaimed = item.claims.some(
              (c) => c.guestName === guestName
            );
            const isClaimed = item.claims.length > 0;

            return (
              <div
                key={item.id}
                className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-gray-800 text-base leading-snug flex-1">
                    {item.name}
                  </span>

                  {guestHasClaimed ? (
                    <span className="shrink-0 inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-3 py-2 rounded-full min-h-[36px]">
                      ✓ You&apos;re bringing this
                    </span>
                  ) : (
                    <button
                      onClick={() => handleClaimItem(item.id)}
                      disabled={isPending}
                      className="shrink-0 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-200 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors min-h-[44px] min-w-[110px]"
                    >
                      {isPending ? "…" : "Bring this 🙋"}
                    </button>
                  )}
                </div>

                {/* Claimants */}
                {isClaimed && (
                  <div className="flex flex-wrap gap-1">
                    {item.claims.map((claim) => (
                      <span
                        key={claim.id}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          claim.guestName === guestName
                            ? "bg-orange-100 text-orange-700"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {claim.guestName === guestName
                          ? `${claim.guestName} (you)`
                          : claim.guestName}
                      </span>
                    ))}
                  </div>
                )}

                {!isClaimed && (
                  <p className="text-xs text-gray-400 italic">
                    Nobody&apos;s claimed this yet
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Add New Item */}
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">
            ➕ Add something to the list
          </h3>
          <form onSubmit={handleAddItem} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Potato salad"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-1 border border-amber-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm min-h-[44px]"
              maxLength={100}
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={!newItemName.trim() || isPending}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-200 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm min-h-[44px] whitespace-nowrap"
            >
              Add item
            </button>
          </form>
          <p className="mt-2 text-xs text-amber-500">
            You&apos;ll automatically be marked as bringing it.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-amber-400">
          Logged in as <strong>{guestName}</strong> ·{" "}
          <button
            onClick={() => {
              sessionStorage.removeItem(storageKey);
              setGuestName("");
              setNameInput("");
            }}
            className="underline hover:text-amber-600"
          >
            Change name
          </button>
        </p>
      </div>
    </div>
  );
}
