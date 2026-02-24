import { submitPostComment } from "./serverActions";

export default function PostCommentForm({ postId }: { postId: string }) {
  return (
    <form action={submitPostComment} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
      <input type="hidden" name="postId" value={postId} />
      <div className="text-base font-semibold">Add a comment</div>
      <textarea
        name="body"
        required
        maxLength={2000}
        className="min-h-[120px] w-full rounded bg-zinc-950 p-2 ring-1 ring-zinc-800"
        placeholder="Be respectful and useful."
      />
      <button className="rounded bg-zinc-800 px-4 py-2 font-semibold hover:bg-zinc-700" type="submit">
        Post comment
      </button>
    </form>
  );
}
