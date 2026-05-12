import {
  findAllAnimes,
  findAnimeById,
  createAnime,
  updateAnime,
  deleteAnime,
} from "./anime.model.js";

export const getAllAnimes =
  async () => {
    return await findAllAnimes();
  };

export const getAnimeById =
  async (id) => {
    const anime =
      await findAnimeById(id);

    if (!anime) {
      throw new Error(
        "Anime not found"
      );
    }

    return anime;
  };

export const createAnimeService =
  async (data) => {
    return await createAnime(data);
  };

export const updateAnimeService =
  async (id, data) => {
    const anime =
      await findAnimeById(id);

    if (!anime) {
      throw new Error(
        "Anime not found"
      );
    }

    return await updateAnime(id, data);
  };

export const deleteAnimeService =
  async (id) => {
    const anime =
      await findAnimeById(id);

    if (!anime) {
      throw new Error(
        "Anime not found"
      );
    }

    return await deleteAnime(id);
  };