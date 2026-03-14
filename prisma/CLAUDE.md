# prisma/

## Purpose
Defines the PostgreSQL database schema for BarbecueParty via Prisma ORM. Three models
represent the core domain: a BBQ event, the items needed for it, and the claims guests
make to bring those items.

## Key Decisions

### Cookie-based organizer identity
`Bbq.organizerCookie` stores the UUID cookie set in the browser when an organizer creates
an event. There is no user auth system — organizer identity is device-scoped. This allows
zero-friction event creation while still associating events with a "device owner".

### Cascade deletes
`Item` cascades on `Bbq` deletion; `Claim` cascades on `Item` deletion. This keeps the DB
clean with no orphaned rows when an event or item is removed. Matches the `ON DELETE CASCADE`
constraints in the initial migration SQL.

### String IDs (cuid/uuid generated in application layer)
All `id` fields are `String @id` rather than auto-increment integers. IDs are generated
by the application (e.g. `cuid()` or `crypto.randomUUID()`) before insertion, giving
predictable invite-link URLs without an extra DB round-trip.

## Models
- **Bbq** — top-level event. Indexed on `organizerCookie` for dashboard queries.
- **Item** — a consumable needed for the BBQ. Indexed on `bbqId` for efficient event queries.
- **Claim** — a guest pledging to bring an item. Indexed on `itemId`.

## Dependencies
- `src/lib/prisma.ts` — singleton Prisma client used by all server components and actions.
- `src/app/dashboard/page.tsx` — queries `prisma.bbq.findMany` with nested items/claims.

## Gotchas
- **Migrations are applied by the Orkka platform** — never run `prisma migrate dev` or
  `prisma db push` locally; there is no database connection in the dev environment.
- Running `prisma generate` (no DB needed) regenerates the typed client after schema changes.
- The `date` field is stored as `TIMESTAMP(3)` — always pass a full `Date` object, not a
  date-only string, to avoid timezone-related midnight-shift bugs.
