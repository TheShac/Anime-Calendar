const stats = [
  {
    title: "Total Animes",
    value: "24",
  },
  {
    title: "Temporadas",
    value: "4",
  },
  {
    title: "Emisiones",
    value: "89",
  },
];

export default function DashboardStats() {
  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      "
    >
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="
            bg-zinc-950
            border
            border-zinc-800
            rounded-3xl
            p-6
          "
        >
          <p className="text-zinc-400">{stat.title}</p>

          <h2
            className="
              text-5xl
              font-black
              mt-4
            "
          >
            {stat.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
