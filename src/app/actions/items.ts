"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function claimItem(formData: FormData) {
  const itemId = formData.get("itemId");
  const guestName = formData.get("guestName");
  const bbqId = formData.get("bbqId");

  if (
    typeof itemId !== "string" ||
    typeof guestName !== "string" ||
    typeof bbqId !== "string" ||
    !itemId.trim() ||
    !guestName.trim() ||
    !bbqId.trim()
  ) {
    return { error: "Invalid input" };
  }

  try {
    await prisma.claim.create({
      data: {
        itemId: itemId.trim(),
        guestName: guestName.trim(),
      },
    });

    revalidatePath(`/bbq/${bbqId}/join`);
    return { success: true };
  } catch {
    return { error: "Failed to claim item" };
  }
}

export async function addItem(formData: FormData) {
  const bbqId = formData.get("bbqId");
  const itemName = formData.get("itemName");
  const guestName = formData.get("guestName");

  if (
    typeof bbqId !== "string" ||
    typeof itemName !== "string" ||
    typeof guestName !== "string" ||
    !bbqId.trim() ||
    !itemName.trim() ||
    !guestName.trim()
  ) {
    return { error: "Invalid input" };
  }

  try {
    await prisma.item.create({
      data: {
        name: itemName.trim(),
        bbqId: bbqId.trim(),
        claims: {
          create: {
            guestName: guestName.trim(),
          },
        },
      },
    });

    revalidatePath(`/bbq/${bbqId}/join`);
    return { success: true };
  } catch {
    return { error: "Failed to add item" };
  }
}
