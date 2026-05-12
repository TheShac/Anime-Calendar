import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id:        serial("id").primaryKey(),
  username:  varchar("username", { length: 100 }).notNull().unique(),
  password:  varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});