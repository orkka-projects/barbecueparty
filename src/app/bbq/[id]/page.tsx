import { notFound } from "next/navigation";
import { headers, cookies } from "next/headers";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CopyInviteButton from "./CopyInviteButton";

interface BbqDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BbqDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const bbq = await prisma.barbecueEvent.findUnique({
    where: { inviteCode: id },
    select: { name: true, date: true },
  });

  if (!bbq) {
    return { title: "BBQ Not Found — BarbecueParty" };
  }

  return {
    title: `${bbq.name} — BarbecueParty`,
    description: `Join the BBQ on ${bbq.date.toLocaleDateString()}!`,
  };
}

export default async function BbqDetailPage({ params }: BbqDetailPageProps) {
  const { id } = await params;

  const bbq = await prisma.barbecueEvent.findUnique({
    where: { inviteCode: id },
    include: { items: { orderBy: { createdAt: "asc" } } },
  });

  if (!bbq) {
    notFound();
  }

  // Detect organizer
  const cookieStore = await cookies();
  const organizerId = cookieStore.get("organizer_id")?.value;
  const isOrganizer = !!organizerId && organizerId === bbq.organizerId;

  // Build the invite join URL
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol =
    host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
  const inviteUrl = `${protocol}://${host}/bbq/${bbq.inviteCode}/join`;

  // Format date and time from the combined DateTime
  const eventDate = bbq.date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const eventTime = bbq.date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <main className="min-h-screen bg-amber-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <span className="text-5xl" aria-hidden="true">
            🍖
          </span>
          <h1 className="mt-3 text-3xl font-bold text-orange-700">
            {bbq.name}
          </h1>
          {isOrganizer && (
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold uppercase tracking-wide">
              You&apos;re the organizer
            </span>
          )}
        </div>

        {/* Event Details */}
        <section
          className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 space-y-4"
          aria-label="Event details"
        >
          <h2 className="text-lg font-bold text-orange-800">Event Details</h2>
          <dl className="space-y-3">
            <div className="flex items-start gap-3">
              <dt className="text-orange-500 text-xl" aria-label="Date">
                📅
              </dt>
              <dd className="text-gray-800 font-medium">{eventDate}</dd>
            </div>
            <div className="flex items-start gap-3">
              <dt className="text-orange-500 text-xl" aria-label="Time">
                🕐
              </dt>
              <dd className="text-gray-800 font-medium">{eventTime}</dd>
            </div>
            <div className="flex items-start gap-3">
              <dt className="text-orange-500 text-xl" aria-label="Address">
                📍
              </dt>
              <dd className="text-gray-800 font-medium">{bbq.address}</dd>
            </div>
          </dl>
        </section>

        {/* Invite Link */}
        <section
          className="bg-orange-50 rounded-2xl border border-orange-200 p-6 space-y-4"
          aria-label="Invite link"
        >
          <h2 className="text-lg font-bold text-orange-800">
            Share the invite 🎉
          </h2>
          <p className="text-sm text-orange-700">
            Copy and share this link with your crew so they can join and claim
            items.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <code className="flex-1 block bg-white border border-orange-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 break-all">
              {inviteUrl}
            </code>
            <CopyInviteButton url={inviteUrl} />
          </div>
        </section>

        {/* Items List */}
        <section
          className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6"
          aria-label="Items list"
        >
          <h2 className="text-lg font-bold text-orange-800 mb-4">
            What&apos;s needed ({bbq.items.length} item
            {bbq.items.length !== 1 ? "s" : ""})
          </h2>

          {bbq.items.length === 0 ? (
            <p className="text-gray-500 text-sm">No items added yet.</p>
          ) : (
            <ul className="space-y-2">
              {bbq.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg bg-amber-50 border border-amber-100"
                >
                  <span className="text-orange-400" aria-hidden="true">
                    🥩
                  </span>
                  <span className="text-gray-800 font-medium">{item.name}</span>
                  <span className="ml-auto text-xs text-amber-600 font-medium">
                    Unclaimed
                  </span>
                </li>
              ))}
            </ul>
          )}

          {bbq.items.length > 0 && (
            <p className="mt-4 text-sm text-orange-600 font-medium">
              🙋 Share the invite link so guests can claim items!
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
