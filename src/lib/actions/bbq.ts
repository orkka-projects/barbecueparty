"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";

export type BbqFormState = {
  errors?: {
    name?: string;
    date?: string;
    time?: string;
    address?: string;
    items?: string;
  };
};

export async function createBbq(
  _prevState: BbqFormState,
  formData: FormData
): Promise<BbqFormState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const date = (formData.get("date") as string | null)?.trim() ?? "";
  const time = (formData.get("time") as string | null)?.trim() ?? "";
  const address = (formData.get("address") as string | null)?.trim() ?? "";
  const rawItems = formData.getAll("item") as string[];
  const items = rawItems.map((i) => i.trim()).filter(Boolean);

  // Validate
  const errors: BbqFormState["errors"] = {};
  if (!name) errors.name = "Event name is required.";
  if (!date) errors.date = "Date is required.";
  if (!time) errors.time = "Time is required.";
  if (!address) errors.address = "Address is required.";
  if (items.length === 0)
    errors.items = "Add at least one item to the list.";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // Combine date + time into a DateTime
  const eventDate = new Date(`${date}T${time}:00`);
  if (isNaN(eventDate.getTime())) {
    return { errors: { date: "Invalid date or time." } };
  }

  // Organizer identity via cookie
  const cookieStore = await cookies();
  let organizerId = cookieStore.get("organizer_id")?.value;
  if (!organizerId) {
    organizerId = crypto.randomUUID();
  }

  // Generate short invite code
  const inviteCode = nanoid(10);

  // Persist to database
  await prisma.barbecueEvent.create({
    data: {
      inviteCode,
      name,
      date: eventDate,
      address,
      organizerId,
      items: {
        create: items.map((itemName) => ({ name: itemName })),
      },
    },
  });

  // Set organizer cookie BEFORE redirect (redirect throws, so must be last)
  cookieStore.set("organizer_id", organizerId, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });

  redirect(`/bbq/${inviteCode}`);
}
