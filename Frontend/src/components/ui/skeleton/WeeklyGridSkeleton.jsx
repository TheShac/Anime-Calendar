import AnimeCardSkeleton from "./AnimeCardSkeleton";

const DAYS = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

export default function WeeklyGridSkeleton() {
  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-7
        gap-4
      "
    >
      {DAYS.map((day) => (
        <div
          key={day}
          className="
            bg-zinc-950
            border
            border-zinc-800
            rounded-3xl
            p-4
            min-h-screen
          "
        >
          <div className="
            h-6
            w-24
            bg-zinc-800
            rounded
            mb-5
            animate-pulse
          " />

          <div className="space-y-5">
            <AnimeCardSkeleton />
            <AnimeCardSkeleton />
          </div>
        </div>
      ))}
    </div>
  );
}