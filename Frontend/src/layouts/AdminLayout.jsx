import Sidebar from "../features/admin/components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex" style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}