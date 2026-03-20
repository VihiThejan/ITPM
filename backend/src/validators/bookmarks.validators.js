import { z } from "zod";

export const upsertBookmarkSchema = z.object({
  listingId: z.string().length(24, "Invalid listing id")
});
