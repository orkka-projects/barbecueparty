"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createBbq, type BbqFormState } from "@/lib/actions/bbq";

const initialState: BbqFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-orange-300 text-white font-bold text-lg transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
    >
      {pending ? "Creating your BBQ…" : "🔥 Let's BBQ!"}
    </button>
  );
}

export default function CreateBbqForm() {
  const [state, formAction] = useActionState(createBbq, initialState);
  const [items, setItems] = useState<string[]>([""]);

  function handleItemChange(index: number, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, ""]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Event Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-orange-800 mb-1"
        >
          Event Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="e.g. Summer BBQ Bash"
          className="w-full rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent min-h-[44px]"
          aria-describedby={state.errors?.name ? "name-error" : undefined}
        />
        {state.errors?.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {state.errors.name}
          </p>
        )}
      </div>

      {/* Date */}
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-semibold text-orange-800 mb-1"
        >
          Date <span className="text-red-500">*</span>
        </label>
        <input
          id="date"
          name="date"
          type="date"
          className="w-full rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent min-h-[44px]"
          aria-describedby={state.errors?.date ? "date-error" : undefined}
        />
        {state.errors?.date && (
          <p id="date-error" className="mt-1 text-sm text-red-600">
            {state.errors.date}
          </p>
        )}
      </div>

      {/* Time */}
      <div>
        <label
          htmlFor="time"
          className="block text-sm font-semibold text-orange-800 mb-1"
        >
          Time <span className="text-red-500">*</span>
        </label>
        <input
          id="time"
          name="time"
          type="time"
          className="w-full rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent min-h-[44px]"
          aria-describedby={state.errors?.time ? "time-error" : undefined}
        />
        {state.errors?.time && (
          <p id="time-error" className="mt-1 text-sm text-red-600">
            {state.errors.time}
          </p>
        )}
      </div>

      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-semibold text-orange-800 mb-1"
        >
          Address <span className="text-red-500">*</span>
        </label>
        <input
          id="address"
          name="address"
          type="text"
          placeholder="e.g. 123 Grill St, Backyard City"
          className="w-full rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent min-h-[44px]"
          aria-describedby={state.errors?.address ? "address-error" : undefined}
        />
        {state.errors?.address && (
          <p id="address-error" className="mt-1 text-sm text-red-600">
            {state.errors.address}
          </p>
        )}
      </div>

      {/* Items */}
      <div>
        <fieldset>
          <legend className="block text-sm font-semibold text-orange-800 mb-2">
            What&apos;s needed? <span className="text-red-500">*</span>
          </legend>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  name="item"
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  placeholder={`Item ${index + 1} (e.g. Burgers, Beer, Tongs…)`}
                  className="flex-1 rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  className="px-3 py-2 rounded-lg border border-amber-300 bg-white text-orange-500 hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-orange-400"
                  aria-label={`Remove item ${index + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {state.errors?.items && (
            <p className="mt-1 text-sm text-red-600">{state.errors.items}</p>
          )}
          <button
            type="button"
            onClick={addItem}
            className="mt-3 flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors focus:outline-none focus:underline min-h-[44px]"
          >
            <span className="text-lg leading-none">+</span> Add another item
          </button>
        </fieldset>
      </div>

      <SubmitButton />
    </form>
  );
}
