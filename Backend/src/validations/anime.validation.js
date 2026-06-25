import { z } from "zod";

export const createAnimeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.string().url("Invalid image URL"),
  description: z.string().min(1, "Description is required"),
  status: z.string().min(1, "Status is required"),
  malId: z.number().int().positive().optional().nullable(),
});

export const updateAnimeSchema = createAnimeSchema.partial();
