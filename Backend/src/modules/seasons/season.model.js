import { db } from "../../config/db.js";
import { seasons } from "./season.schema.js";
import { eq } from "drizzle-orm";

export async function findAllSeasons() {
  return await db.select().from(seasons);
}

export async function findSeasonById(id) {
  const [season] = await db.select().from(seasons).where(eq(seasons.id, id));
  return season;
}

export async function findActiveSeason() {
  const [season] = await db.select().from(seasons).where(eq(seasons.isActive, true));
  return season;
}

export async function findNextSeason() {
  const [season] = await db.select().from(seasons).where(eq(seasons.isNext, true));
  return season;
}

export async function insertSeason(data) {
  const [season] = await db.insert(seasons).values(data).returning();
  return season;
}

export async function updateSeasonById(id, data) {
  const [season] = await db.update(seasons).set(data).where(eq(seasons.id, id)).returning();
  return season;
}

export async function deleteSeasonById(id) {
  const [season] = await db.delete(seasons).where(eq(seasons.id, id)).returning();
  return season;
}

export async function deactivateAllSeasons() {
  return await db.update(seasons).set({ isActive: false });
}

export async function deactivateAllNext() {
  return await db.update(seasons).set({ isNext: false });
}