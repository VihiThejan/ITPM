import { z } from "zod";

const toNumberOrUndefined = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? value : numberValue;
};

export const historyQuerySchema = z.object({
  limit: z.preprocess(toNumberOrUndefined, z.number().int().min(1).max(20).default(5))
});

export const trackViewedSchema = z.object({
  listingId: z.string().length(24, "Invalid listing id")
});
