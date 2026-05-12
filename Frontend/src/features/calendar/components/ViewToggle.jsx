import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { LayoutGrid, Rows } from "lucide-react";

export default function ViewToggle({ viewMode, setViewMode, onResetDay }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const Btn = ({ mode, Icon, label }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        setViewMode(mode);
        if (mode === "weekly" && onResetDay) {
          onResetDay("todos");
        }
      }}
      className="flex items-center gap-2 px-6 py-2 rounded-full text-[15px] border transition-colors"
      style={{
        background: viewMode === mode ? "#10b981" : isDark ? "#1a1a1a" : "#ffffff",
        color: viewMode === mode ? "#000000" : isDark ? "#a1a1aa" : "#6b7280",
        borderColor: viewMode === mode ? "#10b981" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        fontWeight: viewMode === mode ? 700 : 500,
        minWidth: "120px",
        justifyContent: "center",
      }}
    >
      <Icon size={16} aria-hidden="true" />
      {label}
    </motion.button>
  );

  return (
    <div className="flex gap-2">
      <Btn mode="weekly" Icon={LayoutGrid} label="Semanal" />
      <Btn mode="daily"  Icon={Rows}       label="Por día"  />
    </div>
  );
}