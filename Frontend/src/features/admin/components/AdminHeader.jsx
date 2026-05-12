export default function AdminHeader({ title }) {
  return (
    <div
      className="flex items-center"
      style={{
        padding: "24px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "#0a0a0a",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <h1
        className="font-black tracking-tight"
        style={{ fontSize: "30px", color: "#f0f0f0" }}
      >
        {title}
      </h1>
    </div>
  );
}