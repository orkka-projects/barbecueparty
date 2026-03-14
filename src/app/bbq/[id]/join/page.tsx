import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GuestJoinClient } from "@/components/guest-join-client";

interface JoinPageProps {
  params: Promise<{ id: string }>;
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { id } = await params;

  const bbq = await prisma.bbq.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
        include: {
          claims: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!bbq) {
    notFound();
  }

  return <GuestJoinClient bbq={bbq} />;
}
