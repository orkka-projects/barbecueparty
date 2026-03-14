# src/components

## Purpose
Shared UI components used across the app. Currently focused on client-interactive
components that wrap server-fetched data for guest-facing BBQ interactions.

## Key Decisions
- **Client components only** — this directory holds components that require browser
  APIs (sessionStorage) or interactivity (useState, useTransition). Server components
  live inline in their route files (`app/bbq/[id]/join/page.tsx`).
- **Props typed via `Prisma.XGetPayload`** — component prop types are derived directly
  from Prisma's generated types to avoid drift between DB queries and component interfaces.

## Key Components

### `guest-join-client.tsx`
The main interactive component for the guest join flow. Receives a fully-hydrated `bbq`
object (with items and claims) from the server component and handles:
- **Name gate**: reads/writes `bbq-guest-name-{bbqId}` in sessionStorage so guests
  don't re-enter their name on refresh within the same tab session.
- **Item claiming**: calls `claimItem` server action via `useTransition`.
- **Add item**: calls `addItem` server action; guest is auto-claimed as the bringer.
- **Revalidation**: server actions call `revalidatePath`, which causes Next.js to
  re-fetch the server component and pass fresh `bbq` props down — no manual state sync needed.

## Gotchas
- sessionStorage is browser-only; always read it inside `useEffect` to avoid SSR
  hydration mismatches.
- `useEffect` here is intentional and acceptable per project conventions (browser API,
  not data fetching).
- The `isPending` flag from `useTransition` disables all mutation buttons during any
  in-flight server action — prevents double-submits.
