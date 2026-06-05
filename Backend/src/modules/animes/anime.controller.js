import {
  getAllAnimes,
  getAnimeById,
  createAnimeService,
  updateAnimeService,
  deleteAnimeService,
} from "./anime.service.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

import {
  createAnimeSchema,
  updateAnimeSchema,
} from "../../validations/anime.validation.js";

export const getAnimes = async (req, res) => {
  try {
    const animes = await getAllAnimes();

    return successResponse(res, animes);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getAnime = async (req, res) => {
  try {
    const anime = await getAnimeById(Number(req.params.id));

    return successResponse(res, anime);
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

export const createAnimeController = async (req, res) => {
  try {
    const validated = createAnimeSchema.parse(req.body);

    const anime = await createAnimeService(validated);

    return successResponse(res, anime, "Anime created", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const updateAnimeController = async (req, res) => {
  try {
    const validated = updateAnimeSchema.parse(req.body);

    const anime = await updateAnimeService(Number(req.params.id), validated);

    return successResponse(res, anime, "Anime updated");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const deleteAnimeController = async (req, res) => {
  try {
    const anime = await deleteAnimeService(Number(req.params.id));

    return successResponse(res, anime, "Anime deleted");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
