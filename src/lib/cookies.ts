import { cookies } from "next/headers";

export const ORGANIZER_COOKIE_NAME = "organizer_id";

/**
 * Reads the organizer UUID from the request cookies.
 * Returns the cookie value or null if not present.
 * Must be called from a server component or server action.
 */
export async function getOrganizerCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ORGANIZER_COOKIE_NAME)?.value ?? null;
}
