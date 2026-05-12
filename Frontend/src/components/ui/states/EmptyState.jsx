export default function EmptyState({
  title = "Sin contenido",
  description = "No hay datos disponibles",
}) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        py-20
        text-center
      "
    >
      <h2 className="
        text-3xl
        font-bold
        mb-3
      ">
        {title}
      </h2>

      <p className="text-zinc-400">
        {description}
      </p>
    </div>
  );
}