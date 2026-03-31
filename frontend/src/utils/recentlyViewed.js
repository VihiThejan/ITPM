const STORAGE_KEY = "boardme_recently_viewed";
const MAX_ITEMS = 5;

const toStoredListing = (listing) => ({
  _id: listing._id,
  title: listing.title || listing.name || "Boarding Listing",
  locationText: listing.locationText || listing.location || "",
  rent: Number(listing.rent || 0),
  roomType: listing.roomType || "",
  facilities: listing.facilities || [],
  photos: listing.photos || [],
  distanceFromSliitKm: listing.distanceFromSliitKm,
  averageRating: Number(listing.averageRating || 0),
  reviewCount: Number(listing.reviewCount || 0),
  viewedAt: new Date().toISOString()
});

export const getLocalRecentlyViewed = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

export const saveLocalRecentlyViewed = (listing) => {
  if (!listing?._id) {
    return;
  }

  const nextItem = toStoredListing(listing);
  const current = getLocalRecentlyViewed();
  const deduped = current.filter((item) => item._id !== nextItem._id);
  const next = [nextItem, ...deduped].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};

export const clearLocalRecentlyViewed = () => {
  localStorage.removeItem(STORAGE_KEY);
};
