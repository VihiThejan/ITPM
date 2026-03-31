import { apiClient } from "./apiClient";

export const getRecentlyViewed = async (limit = 5) => {
  const response = await apiClient.get("/history/viewed", {
    params: { limit }
  });
  return response.data;
};

export const trackRecentlyViewed = async (listingId) => {
  const response = await apiClient.post("/history/viewed", { listingId });
  return response.data;
};

export const clearRecentlyViewed = async () => {
  await apiClient.delete("/history/viewed");
};
