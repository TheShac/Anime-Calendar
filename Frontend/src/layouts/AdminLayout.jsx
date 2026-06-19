import { useState, createContext, useContext } from "react";
import Sidebar from "../features/admin/components/Sidebar";
import { Menu, X } from "lucide-react";

const SidebarContext = createContext();

export const useSidebarMobile = () => useContext(SidebarContext);

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="flex" style={{ minHeight: "100vh", background: "#0a0a0a" }}>
        {/* Overlay móvil */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              zIndex: 30,
            }}
            className="md:hidden"
          />
        )}

        {/* Sidebar - relative en desktop, fixed en móvil */}
        <aside
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 40,
            width: "260px",
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease",
          }}
          className="md:relative md:transform-none md:transition-none md:z-auto md:flex-shrink-0"
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* Main */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            width: "100%",
            position: "relative",
          }}
        >
          {children}
        </main>

        {/* Botón menú */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "fixed",
            top: "16px",
            left: sidebarOpen ? "276px" : "16px",
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f0f0f0",
            cursor: "pointer",
            zIndex: 50,
            backdropFilter: "blur(4px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            transition: "left 0.3s ease",
          }}
          title={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <style>{`
        @media (min-width: 768px) {
          aside {
            position: relative !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </SidebarContext.Provider>
  );
}