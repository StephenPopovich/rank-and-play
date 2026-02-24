import { clsx } from "clsx";

export default function Card(props: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={clsx("rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 shadow-sm", props.className)}>
      <h2 className="mb-2 text-base font-semibold">{props.title}</h2>
      {props.children}
    </section>
  );
}
