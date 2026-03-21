import { apiClient } from "./apiClient";

export const getReviewsByListingId = async (listingId) => {
  const response = await apiClient.get("/reviews", {
    params: { listingId }
  });
  return response.data;
};

export const createReview = async (payload) => {
  const response = await apiClient.post("/reviews", payload);
  return response.data;
};
