# src/app/bbq/[id]

## Purpose
BBQ detail page. Displays event info, shareable invite link, and the items list. Accessible to both the organizer and guests.

## Key Decisions
- **`[id]` maps to `inviteCode`, not database `id`** — The server action redirects to `/bbq/${inviteCode}` after creation. Always fetch with `prisma.barbecueEvent.findUnique({ where: { inviteCode: params.id } })`. Never use the database primary key in URLs.
- **Host header for invite URL** — The join URL is built server-side using `headers().get("host")` to avoid relying on `NEXT_PUBLIC_APP_URL` env var. Protocol is inferred: `localhost` / `127.*` → `http`, everything else → `https` (Vercel always serves HTTPS).
- **Organizer detection via cookie** — The `organizer_id` httpOnly cookie is set by the server action. The detail page reads it and compares to `bbq.organizerId` to show organizer-specific UI (e.g., "You're the organizer" badge). Guests see the same page without the badge.
- **`CopyInviteButton` is a client component** — `navigator.clipboard` is a browser API; it cannot be called in a server component. The URL is passed as a prop so the server component retains full control over the URL construction.

## Business Logic
- If `inviteCode` is not found in DB, `notFound()` is called → renders 404 page.
- Date and time are stored as a single `DateTime` in the DB. They are formatted separately using `toLocaleDateString` / `toLocaleTimeString` for display.
- Items are listed in creation order (`orderBy: { createdAt: "asc" }`).
- At MVP, all items show "Unclaimed" — claiming is a future feature.

## Dependencies
- `@/lib/prisma` — database client.
- `CopyInviteButton.tsx` — client component for clipboard interaction.
- `next/headers` — `headers()` and `cookies()` for request context.
- Future: guest join flow lives at `/bbq/[id]/join`.
