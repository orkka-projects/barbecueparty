import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";

interface BbqCardProps {
  id: string;
  name: string;
  date: Date;
  address: string;
  guestCount: number;
  unclaimedCount: number;
  isPast: boolean;
}

export function BbqCard({
  id,
  name,
  date,
  address,
  guestCount,
  unclaimedCount,
  isPast,
}: BbqCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));

  return (
    <Link href={`/bbq/${id}`} className="block group">
      <Card className={`h-full transition-all duration-200 group-hover:-translate-y-0.5 ${isPast ? "opacity-70" : ""}`}>
        <CardBody className="flex flex-col gap-3 py-5">
          {/* Event name */}
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors leading-tight">
              {name}
            </h2>
            {isPast && (
              <span className="shrink-0 text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                Past
              </span>
            )}
          </div>

          {/* Date/time */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span aria-hidden="true">📅</span>
            <span>{formattedDate}</span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <span aria-hidden="true" className="mt-0.5">📍</span>
            <span className="line-clamp-2">{address}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 pt-1 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              <span aria-hidden="true">🧑</span>
              {guestCount} {guestCount === 1 ? "guest" : "guests"}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ${
                unclaimedCount === 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span aria-hidden="true">🛒</span>
              {unclaimedCount === 0
                ? "All covered!"
                : `${unclaimedCount} unclaimed`}
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
