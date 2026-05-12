import { db } from "../../config/db.js";
import { animes } from "./anime.schema.js";
import { eq, desc } from "drizzle-orm";

/**
 * GET ALL
 */
export const findAllAnimes =
  async () => {
    return await db
      .select()
      .from(animes)
      .orderBy(desc(animes.id));
  };

/**
 * GET ONE
 */
export const findAnimeById =
  async (id) => {
    const [anime] = await db
      .select()
      .from(animes)
      .where(eq(animes.id, id));

    return anime;
  };

/**
 * CREATE
 */
export const createAnime =
  async (data) => {
    const [anime] = await db
      .insert(animes)
      .values(data)
      .returning();

    return anime;
  };

/**
 * UPDATE
 */
export const updateAnime =
  async (id, data) => {
    const [anime] = await db
      .update(animes)
      .set(data)
      .where(eq(animes.id, id))
      .returning();

    return anime;
  };

/**
 * DELETE
 */
export const deleteAnime =
  async (id) => {
    const [anime] = await db
      .delete(animes)
      .where(eq(animes.id, id))
      .returning();

    return anime;
  };