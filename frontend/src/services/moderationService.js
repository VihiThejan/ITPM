import { apiClient } from "./apiClient";

export const getPendingListings = async () => {
  const response = await apiClient.get("/admin/moderation/listings/pending");
  return response.data;
};

export const moderateListing = async (listingId, status) => {
  const response = await apiClient.patch(`/admin/moderation/listings/${listingId}`, { status });
  return response.data;
};

export const getPendingReviews = async () => {
  const response = await apiClient.get("/admin/moderation/reviews/pending");
  return response.data;
};

export const moderateReview = async (reviewId, status) => {
  const response = await apiClient.patch(`/admin/moderation/reviews/${reviewId}`, { status });
  return response.data;
};

export const getPendingRoommatePosts = async () => {
  const response = await apiClient.get("/admin/moderation/roommates/pending");
  return response.data;
};

export const moderateRoommatePost = async (postId, status) => {
  const response = await apiClient.patch(`/admin/moderation/roommates/${postId}`, { status });
  return response.data;
};
