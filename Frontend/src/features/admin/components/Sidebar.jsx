import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Tv2, CalendarDays, Leaf, LogOut } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";

const NAV_ITEMS = [
  { to: "/admin",        icon: LayoutDashboard, label: "Dashboard"   },
  { to: "/admin/animes", icon: Tv2,             label: "Animes"      },
  { to: "/admin/calendar", icon: CalendarDays,  label: "Calendario"  },
  { to: "/admin/seasons",  icon: Leaf,          label: "Temporadas"  },
];

export default function Sidebar() {
  const logout   = useAuthStore((state) => state.logout);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside
      className="flex flex-col"
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#111111",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        padding: "28px 16px",
        flexShrink: 0,
      }}
    >
      {/* logo */}
      <div className="flex items-center gap-3" style={{ marginBottom: "36px", paddingLeft: "8px" }}>
        <div
          className="flex items-center justify-center rounded-xl font-mono font-black flex-shrink-0"
          style={{ width: "38px", height: "38px", border: "2px solid #10b981", color: "#10b981", fontSize: "18px" }}
        >
          ア
        </div>
        <div>
          <p className="font-black" style={{ fontSize: "15px", color: "#f0f0f0" }}>AniCalendar</p>
          <p style={{ fontSize: "11px", color: "#52525b" }}>Panel de administración</p>
        </div>
      </div>

      {/* nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-xl transition-colors"
              style={{
                padding: "10px 14px",
                background: active ? "rgba(16,185,129,0.12)" : "transparent",
                color: active ? "#10b981" : "#71717a",
                fontWeight: active ? 700 : 500,
                fontSize: "14px",
                border: active ? "1px solid rgba(16,185,129,0.2)" : "1px solid transparent",
                textDecoration: "none",
              }}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-xl transition-colors"
        style={{
          padding: "10px 14px",
          background: "transparent",
          border: "1px solid rgba(239,68,68,0.2)",
          color: "#f87171",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          width: "100%",
        }}
      >
        <LogOut size={16} aria-hidden="true" />
        Cerrar sesión
      </button>
    </aside>
  );
}