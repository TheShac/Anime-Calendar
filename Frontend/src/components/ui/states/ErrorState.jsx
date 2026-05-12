export default function ErrorState({ message = "Algo salió mal" }) {
  return (
    <div
      className="
        flex
        items-center
        justify-center
        min-h-screen
      "
    >
      <div
        className="
          bg-red-500/10
          border
          border-red-500/30
          rounded-3xl
          p-10
          text-center
        "
      >
        <h2
          className="
          text-3xl
          font-bold
          mb-4
          text-red-400
        "
        >
          Error
        </h2>

        <p className="text-zinc-300">{message}</p>
      </div>
    </div>
  );
}
