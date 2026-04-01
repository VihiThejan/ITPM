import { apiClient } from "./apiClient";

export const getRoommatePosts = async () => {
  const response = await apiClient.get("/roommates");
  return response.data;
};

export const createRoommatePost = async (payload) => {
  const response = await apiClient.post("/roommates", payload);
  return response.data;
};
