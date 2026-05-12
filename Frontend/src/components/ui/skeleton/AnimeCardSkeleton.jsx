export default function AnimeCardSkeleton() {
  return (
    <div
      className="
        animate-pulse
        bg-zinc-900
        rounded-2xl
        overflow-hidden
        border
        border-zinc-800
      "
    >
      <div className="h-[320px] bg-zinc-800" />

      <div className="p-4">
        <div className="
          h-4
          bg-zinc-800
          rounded
          mb-3
        " />

        <div className="
          h-3
          w-20
          bg-zinc-800
          rounded
        " />
      </div>
    </div>
  );
}