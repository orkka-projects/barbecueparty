import Link from "next/link";
import { getOrganizerCookie } from "@/lib/cookies";
import { prisma } from "@/lib/prisma";
import { BbqCard } from "./bbq-card";

export const metadata = {
  title: "My BBQs — BarbecueParty",
  description: "Manage all your BBQ events in one place.",
};

export default async function DashboardPage() {
  const organizerCookie = await getOrganizerCookie();

  // No cookie — user has never created a BBQ on this device
  if (!organizerCookie) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            My BBQs 🔥
          </h1>
        </header>

        <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl bg-amber-50 border border-amber-200">
          <span className="text-6xl mb-4" aria-hidden="true">🍖</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No BBQs here yet
          </h2>
          <p className="text-gray-600 max-w-md mb-8">
            BBQs you create on this device will appear here. Fire up the grill
            and throw your first party!
          </p>
          <Link
            href="/bbq/new"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md min-h-[44px]"
          >
            🔥 Create your first BBQ
          </Link>
        </div>
      </main>
    );
  }

  // Fetch all BBQs for this organizer, including items and claims
  const bbqs = await prisma.barbecueEvent.findMany({
    where: { organizerId: organizerCookie },
    include: {
      items: {
        include: {
          claims: {
            select: { guestName: true },
          },
        },
      },
    },
  });

  // Derive counts and classify as past/upcoming
  const now = new Date();
  const enriched = bbqs.map((bbq) => {
    const guestCount = new Set(
      bbq.items.flatMap((item) => item.claims.map((c) => c.guestName))
    ).size;
    const unclaimedCount = bbq.items.filter((item) => item.claims.length === 0).length;
    const isPast = new Date(bbq.date) < now;
    return { ...bbq, guestCount, unclaimedCount, isPast };
  });

  // Sort: upcoming soonest first, then past events most-recent first
  const upcoming = enriched
    .filter((b) => !b.isPast)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = enriched
    .filter((b) => b.isPast)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sorted = [...upcoming, ...past];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="flex items-center justify-between gap-4 mb-10 flex-wrap">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          My BBQs 🔥
        </h1>
        <Link
          href="/bbq/new"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-md min-h-[44px]"
        >
          + Create New BBQ
        </Link>
      </header>

      {sorted.length === 0 ? (
        // Cookie exists but no BBQs created yet
        <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl bg-amber-50 border border-amber-200">
          <span className="text-6xl mb-4" aria-hidden="true">🍖</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No BBQs yet
          </h2>
          <p className="text-gray-600 max-w-md mb-8">
            You haven&apos;t hosted any BBQs yet. Time to get the grill going!
          </p>
          <Link
            href="/bbq/new"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md min-h-[44px]"
          >
            🔥 Create your first BBQ
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((bbq) => (
            <BbqCard
              key={bbq.id}
              id={bbq.id}
              name={bbq.name}
              date={bbq.date}
              address={bbq.address}
              guestCount={bbq.guestCount}
              unclaimedCount={bbq.unclaimedCount}
              isPast={bbq.isPast}
            />
          ))}
        </div>
      )}
    </main>
  );
}
