import {
  findAllSeasons,
  findSeasonById,
  findActiveSeason,
  insertSeason,
  updateSeasonById,
  deleteSeasonById,
  deactivateAllSeasons,
} from "./season.model.js";

/**
 * GET ALL
 */
export async function getAllSeasonsService() {
  return await findAllSeasons();
}

/**
 * GET ACTIVE
 */
export async function getActiveSeasonService() {
  return await findActiveSeason();
}

/**
 * CREATE
 */
export async function createSeasonService(data) {
  return await insertSeason(data);
}

/**
 * UPDATE
 */
export async function updateSeasonService(id, data) {
  const season = await findSeasonById(id);

  if (!season) {
    throw new Error("Season not found");
  }

  return await updateSeasonById(id, data);
}

/**
 * DELETE
 */
export async function deleteSeasonService(id) {
  const season = await findSeasonById(id);

  if (!season) {
    throw new Error("Season not found");
  }

  return await deleteSeasonById(id);
}

/**
 * ACTIVATE
 */
export async function activateSeasonService(id) {
  const season = await findSeasonById(id);

  if (!season) {
    throw new Error("Season not found");
  }

  await deactivateAllSeasons();

  return await updateSeasonById(id, {
    isActive: true,
  });
}
