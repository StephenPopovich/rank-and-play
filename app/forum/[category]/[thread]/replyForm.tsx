import { reply } from "./serverActions";

export default function ReplyForm({ threadId }: { threadId: string }) {
  return (
    <form action={reply} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
      <input type="hidden" name="threadId" value={threadId} />
      <div className="text-base font-semibold">Reply</div>
      <textarea name="body" required className="min-h-[150px] w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800" />
      <button className="rounded bg-zinc-800 px-4 py-2 font-semibold hover:bg-zinc-700" type="submit">Post reply</button>
    </form>
  );
}
