import { apiClient } from "./apiClient";

export const getListings = async (params) => {
  const response = await apiClient.get("/listings", { params });
  return response.data;
};

export const getListingById = async (listingId) => {
  const response = await apiClient.get(`/listings/${listingId}`);
  return response.data;
};
