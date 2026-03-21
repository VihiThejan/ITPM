import { z } from "zod";

export const createReviewSchema = z.object({
  listingId: z.string().length(24, "Invalid listing id"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(1000)
});

export const reviewQuerySchema = z.object({
  listingId: z.string().length(24, "Invalid listing id")
});
