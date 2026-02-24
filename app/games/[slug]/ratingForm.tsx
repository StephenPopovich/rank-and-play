import { submitRating } from "./serverActions";

export default function RatingForm({ gameId }: { gameId: string }) {
  return (
    <form action={submitRating} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
      <input type="hidden" name="gameId" value={gameId} />
      <div className="text-base font-semibold">Rate this game (1-5)</div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {["gameplay","immersion","fun","story","graphics","sound","replay"].map((k) => (
          <label key={k} className="space-y-1">
            <span className="capitalize text-zinc-300">{k}</span>
            <input
              name={k}
              type="number"
              min={1}
              max={5}
              defaultValue={3}
              className="w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800"
              required
            />
          </label>
        ))}
      </div>

      <button className="rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500" type="submit">
        Submit rating
      </button>

      <p className="text-xs text-zinc-500">
        Only logged in users can submit. Anti spam bot check should be enabled with Turnstile in production.
      </p>
    </form>
  );
}
