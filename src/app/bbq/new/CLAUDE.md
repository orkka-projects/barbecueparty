# src/app/bbq/new

## Purpose
BBQ creation flow. `page.tsx` is a server component shell; `CreateBbqForm.tsx` is the interactive client component that collects event details and submits them to the `createBbq` server action.

## Key Decisions
- **`useActionState` from `react`** (not `react-dom`) — React 19 API. Do not change the import path.
- **Multiple `name="item"` inputs** — The dynamic item list renders plain `<input name="item">` elements. `formData.getAll("item")` in the server action collects all values at once. No serialization needed.
- **`useFormStatus` for submit state** — Extracted into a separate `SubmitButton` component so `useFormStatus` can read the pending state from the nearest `<form>` ancestor. Must be a child of the form, not a sibling.
- **Controlled item inputs with `useState`** — Items are tracked in local state so the UI can reflect add/remove changes instantly without a server round-trip. Values are synced back to hidden inputs at submit time via the controlled inputs themselves.

## Business Logic
- At least one non-empty item is required (validated server-side in `createBbq`).
- Remove button is disabled when only one item row remains.
- Validation errors are returned in `state.errors` and displayed inline below each field.

## Dependencies
- `@/lib/actions/bbq` — `createBbq` server action and `BbqFormState` type.
- On successful submission, `createBbq` redirects to `/bbq/[inviteCode]`.
