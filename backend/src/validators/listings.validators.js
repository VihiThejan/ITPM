import { z } from "zod";

const toNumberOrUndefined = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? value : numberValue;
};

const toTrimmedStringOrUndefined = (value) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const normalized = String(value).trim();
  return normalized === "" ? undefined : normalized;
};

export const listingQuerySchema = z.object({
  page: z.preprocess(toNumberOrUndefined, z.number().int().min(1).default(1)),
  limit: z.preprocess(toNumberOrUndefined, z.number().int().min(1).max(50).default(12)),
  location: z.preprocess(toTrimmedStringOrUndefined, z.string().optional()),
  minPrice: z.preprocess(toNumberOrUndefined, z.number().min(0).optional()),
  maxPrice: z.preprocess(toNumberOrUndefined, z.number().min(0).optional()),
  roomType: z.preprocess(
    toTrimmedStringOrUndefined,
    z.enum(["single", "shared"]).optional()
  ),
  facilities: z
    .preprocess(
      (value) => {
        if (typeof value === "string") {
          return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
        return value;
      },
      z.array(z.string()).optional()
    )
    .optional(),
  sortBy: z.enum(["newest", "price_asc", "price_desc", "rating_desc"]).default("newest")
});

export const listingIdParamsSchema = z.object({
  listingId: z.string().length(24, "Invalid listing id")
});
