# src/lib/actions

## Purpose
Next.js Server Actions for BarbecueParty mutations. Each file corresponds to a domain entity.

## Key Decisions
- **Cookie set BEFORE redirect** — `redirect()` in Next.js throws internally (a special `NEXT_REDIRECT` error that bubbles up). Any code after `redirect()` never executes. The `organizer_id` cookie must be set before calling `redirect()`.
- **`nanoid(10)` for invite codes** — Short (10-char) URL-safe random strings. The package is nanoid v3 (named export: `import { nanoid } from 'nanoid'`). Do not switch to v4+ without verifying ESM/CJS compatibility with the Next.js build.
- **Combined date+time parsing** — The HTML form sends separate `date` (YYYY-MM-DD) and `time` (HH:MM) strings. These are combined as `new Date(\`${date}T${time}:00\`)` to produce a JS `Date` / Prisma `DateTime`. Always validate with `isNaN(eventDate.getTime())` after combining.
- **`BbqFormState` error shape** — The return type for `useActionState`. Each field maps to an optional error string. Returning `{}` (no errors) after a redirect is unreachable — the redirect throws before the return.

## Business Logic
- Organizer identity is a UUID stored in an httpOnly cookie (`organizer_id`, 1-year TTL). If a cookie already exists, the existing value is reused so the organizer can manage multiple BBQs under one identity.
- Empty or whitespace-only items are stripped before validation. Only non-empty trimmed values are persisted.
- At least one item is required (server-side guard; form also enforces client-side visually).

## Dependencies
- `@/lib/prisma` — Prisma client singleton.
- `nanoid` — invite code generation (v3, CJS-compatible).
- `next/headers` — `cookies()` for organizer identity.
- `next/navigation` — `redirect()` for post-create navigation.
