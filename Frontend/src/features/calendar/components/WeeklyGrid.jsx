import { motion } from "framer-motion";
import DayColumn from "./DayColumn";
import DayRow from "./DayRow";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0  },
};

export default function WeeklyGrid({ days, onSelectAnime, viewMode }) {
  if (viewMode === "weekly") {
    const entries = Object.entries(days);
    const cols = entries.length;

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mt-6"
        style={{
          display: "grid",
          gap: "12px",
          // móvil: 2 columnas, tablet: 3-4, desktop: 7
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {entries.map(([day, animes]) => (
          <motion.div key={day} variants={itemVariants}>
            <DayColumn day={day} animes={animes} onSelectAnime={onSelectAnime} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mt-6"
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      {Object.entries(days).map(([day, animes]) => (
        <motion.div key={day} variants={itemVariants}>
          <DayRow day={day} animes={animes} onSelectAnime={onSelectAnime} />
        </motion.div>
      ))}
    </motion.div>
  );
}