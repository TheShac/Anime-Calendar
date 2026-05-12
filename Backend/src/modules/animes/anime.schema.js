import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const animes = pgTable("animes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }),
});