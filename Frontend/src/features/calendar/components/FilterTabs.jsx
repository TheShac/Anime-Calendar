import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";

const DAYS = ["todos","lunes","martes","miercoles","jueves","viernes","sabado","domingo"];

export default function FilterTabs({ selectedDay, onChangeDay }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex flex-wrap gap-2">
      {DAYS.map((day) => {
        const active = selectedDay === day;
        return (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={day}
            onClick={() => onChangeDay(day)}
            className="rounded-full capitalize border transition-colors"
            style={{
              padding: "6px 14px",
              fontSize: "13px",
              background: active ? "#10b981" : isDark ? "#1a1a1a" : "#ffffff",
              color: active ? "#000000" : isDark ? "#a1a1aa" : "#6b7280",
              borderColor: active ? "#10b981" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              fontWeight: active ? 700 : 500,
            }}
          >
            {day}
          </motion.button>
        );
      })}
    </div>
  );
}