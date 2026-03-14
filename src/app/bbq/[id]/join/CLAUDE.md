# src/app/bbq/[id]/join

## Purpose
The guest-facing invite page. Anyone with the link `/bbq/[id]/join` can view BBQ
details and interact with the item list — no authentication required.

## Server / Client Split
- **`page.tsx` (server component)**: fetches the BBQ record with nested items and
  claims using Prisma, then renders `<GuestJoinClient bbq={bbq} />`.
- **`GuestJoinClient` (client component, in `src/components/`)**: handles all
  browser-side interactivity — name gate, claiming, adding items.

This split keeps data fetching on the server (fast, no client waterfall) while
enabling interactive UI features that require browser APIs.

## Data Flow
```
page.tsx (server)
  → prisma.bbq.findUnique (includes items → claims)
  → <GuestJoinClient bbq={bbq} />
      → sessionStorage (name persistence)
      → claimItem / addItem (server actions)
          → revalidatePath("/bbq/[id]/join")
          → page.tsx re-fetches and passes fresh props
```

## Revalidation Strategy
Server actions call `revalidatePath` after mutations. Next.js invalidates the
server component cache and re-renders with fresh data from the database. No
client-side state synchronisation is needed for the item list.

## sessionStorage Key Convention
Guest names are stored as `bbq-guest-name-{bbqId}`. Keying by BBQ id means
a user can attend multiple BBQs in different tabs without name conflicts.

## Gotchas
- `params` is a `Promise<{ id: string }>` in Next.js 15 App Router — must be
  `await`-ed before use.
- This route is intentionally separate from `/bbq/[id]` (organizer view) so each
  page can have a focused UI without conditional role-checking.
