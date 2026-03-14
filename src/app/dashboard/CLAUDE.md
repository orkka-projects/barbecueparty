# Dashboard Module

## Purpose
The organizer dashboard (`/dashboard`) lists all BBQ events created by the current organizer on this device. It is the primary home base for organizers to see the status of their parties and navigate to each event.

## Key Decisions
- **Pure server component** — no client-side JS needed; data is fetched at request time via Prisma, keeping the page fast and SEO-friendly.
- **Cookie-based organizer identity** — there is no auth system. The organizer is identified by an `organizer_id` UUID stored in a browser cookie (set when a BBQ is created). See `src/lib/cookies.ts`.
- **In-memory derived counts** — `guestCount` and `unclaimedCount` are computed from the fully-included Prisma result rather than using raw SQL aggregates. This is simpler and performant at the scale of a personal BBQ organizer (tens of events, not millions).
- **Two distinct empty states**:
  1. No cookie present → user is brand new; explain that BBQs created here will appear.
  2. Cookie present but no BBQs → organizer signed up somehow with no data; prompt to create first event.

## Business Logic
- **Guest count**: unique set of `guestName` values across all claims for all items of a BBQ.
- **Unclaimed count**: items with zero claims.
- **Sort order**: upcoming events ascending (soonest first), past events descending (most recent first), concatenated `[upcoming..., past...]`.
- A BBQ is considered "past" if its `date` is strictly before `new Date()` at request time.

## Dependencies
- `src/lib/cookies.ts` — `getOrganizerCookie()` reads the organizer UUID.
- `src/lib/prisma.ts` — singleton Prisma client.
- `src/app/dashboard/bbq-card.tsx` — pre-built card component for each event.
- `src/components/ui/card.tsx` — base Card primitives used by BbqCard.

## Gotchas
- Prisma returns `date` as a `Date` object (not string), which is what `BbqCard` expects.
- The cookie is `HttpOnly`-safe to read server-side; never try to access it in client components.
- If the organizer clears cookies, their dashboard will appear empty even if their BBQs still exist in the DB — this is by design (no auth required by spec).
