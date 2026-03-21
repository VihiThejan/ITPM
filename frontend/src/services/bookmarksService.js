import { apiClient } from "./apiClient";

export const getBookmarks = async () => {
  const response = await apiClient.get("/bookmarks");
  return response.data;
};

export const addBookmark = async (listingId) => {
  const response = await apiClient.post("/bookmarks", { listingId });
  return response.data;
};

export const removeBookmark = async (listingId) => {
  await apiClient.delete(`/bookmarks/${listingId}`);
};
