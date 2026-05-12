import { db } from "../../config/db.js";

import { seasons } from "./season.schema.js";

import { eq } from "drizzle-orm";

/**
 * Obtener todas las seasons
 */
export async function findAllSeasons() {
  return await db.select().from(seasons);
}

/**
 * Obtener season por ID
 */
export async function findSeasonById(id) {
  const [season] = await db.select().from(seasons).where(eq(seasons.id, id));

  return season;
}

/**
 * Obtener season activa
 */
export async function findActiveSeason() {
  const [season] = await db
    .select()
    .from(seasons)
    .where(eq(seasons.isActive, true));

  return season;
}

/**
 * Crear season
 */
export async function insertSeason(data) {
  const [season] = await db.insert(seasons).values(data).returning();

  return season;
}

/**
 * Actualizar season
 */
export async function updateSeasonById(id, data) {
  const [season] = await db
    .update(seasons)
    .set(data)
    .where(eq(seasons.id, id))
    .returning();

  return season;
}

/**
 * Eliminar season
 */
export async function deleteSeasonById(id) {
  const [season] = await db
    .delete(seasons)
    .where(eq(seasons.id, id))
    .returning();

  return season;
}

/**
 * Desactivar todas
 */
export async function deactivateAllSeasons() {
  return await db.update(seasons).set({
    isActive: false,
  });
}
