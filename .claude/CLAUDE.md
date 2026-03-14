# BarbecueParty

## Project Brief

# BarbecueParty

## Overview
BarbecueParty is a lightweight, invite-only web app for organizing barbecue parties with friends. Anyone can create a BBQ event by setting a date, time, address, and a list of consumables needed. The organizer shares an invitation link with friends, who join without signing up — they simply enter their name and claim items they'll bring. The app turns guest attendance into a shared responsibility system, giving everyone visibility into what's covered and what's still needed.

## Target Users
- **Organizer:** The person who creates and hosts the BBQ. Their goal is to set up the event details, define an initial list of food/drinks/supplies needed, share the invite link, and monitor who is coming and what each person is bringing.
- **Guest:** A friend invited via a shared link. Their goal is to see the BBQ details, pick their name (no sign-up required), view the full item list (claimed and unclaimed), claim one or more items to bring, and optionally add new items not on the original list.

## Core Features (MVP)
1. **Create a BBQ Event** — Organizer fills out a form with date, time, address, and an initial list of consumables (food, meat, drinks, etc.).
2. **Invitation Link Generation** — Each BBQ gets a unique shareable invite link. The organizer can easily copy and share it.
3. **Guest Join Flow (No Auth)** — Guests access the BBQ via the invite link and enter only their name to participate. No account or sign-up required.
4. **Item Claiming** — Guests can see all items on the list, who has claimed each item, and which items are still unclaimed. Multiple guests can claim the same item.
5. **Add New Items** — Guests can add items to the list that weren't in the organizer's original list, if they want to bring something different.
6. **Organizer Dashboard** — The organizer has a view listing all BBQs they've created, with access to each event's detail page.
7. **Real-Time Item Visibility** — All participants (organizer and guests) can see a live confirmation list of who is bringing what and what is still missing.

## Key Screens

- **Organizer Dashboard** — Lists all BBQs created by the organizer. Each entry shows the event name/date and links to the event detail page. Includes a "Create New BBQ" action.
- **Create BBQ Form** — Form fields for date, time, address, and an initial consumables list (ability to add multiple items). Submitting generates the BBQ and its unique invite link.
- **BBQ Detail View (Organizer)** — Full event details (date, time, address), the shareable invite link with a copy button, and a real-time confirmation list showing all guests, items claimed, and items still unclaimed.
- **BBQ Detail View (Guest)** — Full event details visible to the guest. Shows the full item list with each item's status (unclaimed or showing who claimed it). Guest can claim items or add new ones. Guest enters their name to interact.
- **Guest Name Entry** — Simple prompt/modal when a guest first opens an invite link asking them to enter their name before they can interact with the item list.

## Branding & Style
- **Vibe:** Fun, cool, and festive. Casual and approachable, not corporate.
- **Color Palette:** Warm, inviting tones — reds, oranges, and ambers to evoke fire, grills, and summer gatherings. Specific palette to be defined during design system creation.
- **Logo:** BBQ-themed imagery — should incorporate elements like a grill, fire, or meat. Style should be playful and energetic to match the fun vibe.
- **Design System:** A full design system (typography, colors, components, spacing) should be created and applied consistently across the app. The logo should be created and used throughout the project.
- **Tone:** Casual, warm, and friendly. Copy should feel like it's coming from a friend, not a product.

## Integrations
- None discussed. No third-party services, APIs, or external tools are required for MVP.

## Out of Scope
- User authentication / account creation (guests are anonymous by name only)
- Push notifications or reminders
- Comments or notes on items
- Marking items as "received" on the day of the event
- Any features beyond creating, sharing, and tracking BBQ events and their item lists

## Technical Notes
- **Stack:** Next.js (App Router) + Prisma + Tailwind CSS + PostgreSQL
- **Deployment:** Vercel (auto-deploy on push to main)
- **Auth:** No authentication system needed for guests. TBD on whether organizer identity is persisted (e.g., via localStorage/cookie to associate them with their created BBQs) — this was not explicitly discussed.
- **Invite Links:** Each BBQ should have a unique URL (e.g., `/bbq/[unique-id]`) accessible without login.
- **Real-Time Updates:** The item list should reflect live changes (TBD on implementation — could be polling or WebSockets, not discussed in conversation).
- **Guest Identity:** Guest names are entered per session via the invite link. No persistence of guest identity across sessions was discussed — TBD.

## Tech Stack
- **Framework:** Next.js (App Router)
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **Deployment:** Vercel (auto-deploy on push to main)

## Conventions
- Server components by default, client components only for interactivity
- Use server actions for mutations
- Tailwind for all styling — mobile-first, responsive
- Prisma for all database access