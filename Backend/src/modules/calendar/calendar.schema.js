import { pgTable, serial, integer, varchar, time, timestamp, } from "drizzle-orm/pg-core";
import { animes } from "../animes/anime.schema.js";
import { seasons } from "../seasons/season.schema.js";

export const calendarEntries = pgTable("calendar_entries", {
  id: serial("id").primaryKey(),

  animeId: integer("anime_id")
    .references(() => animes.id, { onDelete: "cascade" })
    .notNull(),

  seasonId: integer("season_id")
    .references(() => seasons.id)
    .notNull(),

  dayOfWeek: varchar("day_of_week", {length: 20}).notNull(),
  time: varchar("time", { length: 5 }).notNull(), 
  createdAt: timestamp("created_at").defaultNow(),
});