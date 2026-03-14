import type { Metadata } from "next";
import CreateBbqForm from "./CreateBbqForm";

export const metadata: Metadata = {
  title: "Create a BBQ — BarbecueParty",
  description: "Set up your BBQ event and share the invite link with friends.",
};

export default function NewBbqPage() {
  return (
    <main className="min-h-screen bg-amber-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <span className="text-5xl" aria-hidden="true">
            🔥
          </span>
          <h1 className="mt-3 text-3xl font-bold text-orange-700">
            Fire up a BBQ!
          </h1>
          <p className="mt-2 text-orange-600">
            Fill in the details and share the invite link with your crew.
          </p>
        </div>
        <CreateBbqForm />
      </div>
    </main>
  );
}
