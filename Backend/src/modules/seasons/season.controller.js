import {
  getAllSeasonsService, getActiveSeasonService, getNextSeasonService,
  createSeasonService, updateSeasonService, deleteSeasonService,
  activateSeasonService, markAsNextService, unmarkAsNextService,
} from "./season.service.js";

export async function getAllSeasons(req, res, next) {
  try {
    const seasons = await getAllSeasonsService();
    res.json({ success: true, data: seasons });
  } catch (error) { next(error); }
}

export async function getActiveSeason(req, res, next) {
  try {
    const season = await getActiveSeasonService();
    res.json({ success: true, data: season });
  } catch (error) { next(error); }
}

export async function getNextSeason(req, res, next) {
  try {
    const season = await getNextSeasonService();
    res.json({ success: true, data: season });
  } catch (error) { next(error); }
}

export async function createSeason(req, res, next) {
  try {
    const season = await createSeasonService(req.body);
    res.status(201).json({ success: true, message: "Season created", data: season });
  } catch (error) { next(error); }
}

export async function updateSeason(req, res, next) {
  try {
    const season = await updateSeasonService(Number(req.params.id), req.body);
    res.json({ success: true, message: "Season updated", data: season });
  } catch (error) { next(error); }
}

export async function deleteSeason(req, res, next) {
  try {
    const season = await deleteSeasonService(Number(req.params.id));
    res.json({ success: true, message: "Season deleted", data: season });
  } catch (error) { next(error); }
}

export async function activateSeason(req, res, next) {
  try {
    const season = await activateSeasonService(Number(req.params.id));
    res.json({ success: true, message: "Season activated", data: season });
  } catch (error) { next(error); }
}

export async function markAsNext(req, res, next) {
  try {
    const season = await markAsNextService(Number(req.params.id));
    res.json({ success: true, message: "Season marked as next", data: season });
  } catch (error) { next(error); }
}

export async function unmarkAsNext(req, res, next) {
  try {
    const season = await unmarkAsNextService(Number(req.params.id));
    res.json({ success: true, message: "Season unmarked as next", data: season });
  } catch (error) { next(error); }
}