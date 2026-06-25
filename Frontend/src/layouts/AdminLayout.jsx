import { useState, createContext, useContext } from "react";
import Sidebar from "../features/admin/components/Sidebar";
import { Menu, X } from "lucide-react";

const SidebarContext = createContext();
export const useSidebarMobile = () => useContext(SidebarContext);

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex" }}>

        {/* overlay móvil */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.7)", zIndex: 30,
            }}
          />
        )}

        {/* sidebar fijo — mismo comportamiento en móvil y desktop */}
        <aside
          style={{
            position: "fixed", left: 0, top: 0, bottom: 0,
            width: "260px", zIndex: 40,
            transform: sidebarOpen ? "translateX(0)" : "translateX(-260px)",
            transition: "transform 0.3s ease",
          }}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* espaciador desktop — empuja el main cuando el sidebar está abierto */}
        <div
          className="hidden md:block flex-shrink-0"
          style={{
            width: sidebarOpen ? "260px" : "0",
            transition: "width 0.3s ease",
          }}
        />

        {/* contenido principal */}
        <main style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
          {children}
        </main>

        {/* botón toggle */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
          style={{
            position: "fixed",
            top: "16px",
            left: sidebarOpen ? "276px" : "16px",
            transition: "left 0.3s ease",
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            width: "40px", height: "40px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#f0f0f0", cursor: "pointer",
            zIndex: 50,
            backdropFilter: "blur(4px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </SidebarContext.Provider>
  );
}
