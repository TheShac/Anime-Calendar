import {
  findAllSeasons, findSeasonById, findActiveSeason, findNextSeason,
  insertSeason, updateSeasonById, deleteSeasonById,
  deactivateAllSeasons, deactivateAllNext,
} from "./season.model.js";

export async function getAllSeasonsService() {
  return await findAllSeasons();
}

export async function getActiveSeasonService() {
  return await findActiveSeason();
}

export async function getNextSeasonService() {
  return await findNextSeason();
}

export async function createSeasonService(data) {
  return await insertSeason(data);
}

export async function updateSeasonService(id, data) {
  const season = await findSeasonById(id);
  if (!season) throw new Error("Season not found");
  return await updateSeasonById(id, data);
}

export async function deleteSeasonService(id) {
  const season = await findSeasonById(id);
  if (!season) throw new Error("Season not found");
  return await deleteSeasonById(id);
}

export async function activateSeasonService(id) {
  const season = await findSeasonById(id);
  if (!season) throw new Error("Season not found");
  await deactivateAllSeasons();
  return await updateSeasonById(id, { isActive: true });
}

export async function markAsNextService(id) {
  const season = await findSeasonById(id);
  if (!season) throw new Error("Season not found");
  await deactivateAllNext();
  return await updateSeasonById(id, { isNext: true });
}

export async function unmarkAsNextService(id) {
  const season = await findSeasonById(id);
  if (!season) throw new Error("Season not found");
  return await updateSeasonById(id, { isNext: false });
}