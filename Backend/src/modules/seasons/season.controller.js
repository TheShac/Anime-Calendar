import {
  getAllSeasonsService,
  getActiveSeasonService,
  createSeasonService,
  updateSeasonService,
  deleteSeasonService,
  activateSeasonService,
} from "./season.service.js";

/**
 * GET ALL
 */
export async function getAllSeasons(req, res, next) {
  try {
    const seasons = await getAllSeasonsService();

    res.json({
      success: true,
      data: seasons,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET ACTIVE
 */
export async function getActiveSeason(req, res, next) {
  try {
    const season = await getActiveSeasonService();

    res.json({
      success: true,
      data: season,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * CREATE
 */
export async function createSeason(req, res, next) {
  try {
    const season = await createSeasonService(req.body);

    res.status(201).json({
      success: true,
      message: "Season created",
      data: season,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * UPDATE
 */
export async function updateSeason(req, res, next) {
  try {
    const season = await updateSeasonService(Number(req.params.id), req.body);

    res.json({
      success: true,
      message: "Season updated",
      data: season,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE
 */
export async function deleteSeason(req, res, next) {
  try {
    const season = await deleteSeasonService(Number(req.params.id));

    res.json({
      success: true,
      message: "Season deleted",
      data: season,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ACTIVATE
 */
export async function activateSeason(req, res, next) {
  try {
    const season = await activateSeasonService(Number(req.params.id));

    res.json({
      success: true,
      message: "Season activated",
      data: season,
    });
  } catch (error) {
    next(error);
  }
}
