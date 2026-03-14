import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold text-xl hover:opacity-90 transition-opacity"
          >
            <span className="text-2xl" aria-hidden="true">
              🔥
            </span>
            <span>BarbecueParty</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/dashboard"
              className="text-white font-medium px-3 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm sm:text-base"
            >
              My BBQs
            </Link>
            <Link
              href="/bbq/new"
              className="bg-white text-orange-600 font-semibold px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm sm:text-base shadow-sm min-h-[44px] flex items-center"
            >
              + Create BBQ
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
