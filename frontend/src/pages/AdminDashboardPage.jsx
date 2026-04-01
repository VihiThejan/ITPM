import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";

import { getAllHostelOwners, getAllStudents } from "../services/authService";
import {
  getPendingListings,
  getPendingRoommatePosts,
  getPendingReviews,
  moderateListing,
  moderateRoommatePost,
  moderateReview
} from "../services/moderationService";

function AdminDashboardPage() {
  const [students, setStudents] = useState([]);
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingListings, setPendingListings] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [pendingRoommatePosts, setPendingRoommatePosts] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsResponse, ownersResponse, listingsResponse, reviewsResponse, roommatePostsResponse] =
        await Promise.all([
          getAllStudents(),
          getAllHostelOwners(),
          getPendingListings(),
          getPendingReviews(),
          getPendingRoommatePosts()
        ]);

      setStudents(studentsResponse.data || []);
      setOwners(ownersResponse.data || []);
      setPendingListings(listingsResponse.items || []);
      setPendingReviews(reviewsResponse.items || []);
      setPendingRoommatePosts(roommatePostsResponse.items || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleListingModeration = async (listingId, status) => {
    try {
      await moderateListing(listingId, status);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to moderate listing.");
    }
  };

  const handleReviewModeration = async (reviewId, status) => {
    try {
      await moderateReview(reviewId, status);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to moderate review.");
    }
  };

  const handleRoommateModeration = async (postId, status) => {
    try {
      await moderateRoommatePost(postId, status);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to moderate roommate post.");
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Admin Dashboard
      </Typography>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {loading ? <Alert severity="info">Refreshing moderation data...</Alert> : null}

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Students
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Verified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.isVerifiedStudent ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Hostel Owners
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Verified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {owners.map((owner) => (
                <TableRow key={owner.id}>
                  <TableCell>{owner.name}</TableCell>
                  <TableCell>{owner.email}</TableCell>
                  <TableCell>{owner.isVerified ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Pending Listings
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Rent</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingListings.map((listing) => (
                <TableRow key={listing._id}>
                  <TableCell>{listing.title}</TableCell>
                  <TableCell>{listing.locationText}</TableCell>
                  <TableCell>LKR {Number(listing.rent || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip size="small" label={listing.moderationStatus} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="contained" onClick={() => handleListingModeration(listing._id, "approved")}>Approve</Button>
                      <Button size="small" color="warning" onClick={() => handleListingModeration(listing._id, "rejected")}>Reject</Button>
                      <Button size="small" color="error" onClick={() => handleListingModeration(listing._id, "deactivated")}>Deactivate</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Pending Reviews
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Listing</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingReviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell>{review.listingId?.title || "-"}</TableCell>
                  <TableCell>{review.studentName || "Anonymous"}</TableCell>
                  <TableCell>{review.rating}</TableCell>
                  <TableCell>{review.comment}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="contained" onClick={() => handleReviewModeration(review._id, "approved")}>Approve</Button>
                      <Button size="small" color="warning" onClick={() => handleReviewModeration(review._id, "rejected")}>Reject</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Pending Roommate Posts
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingRoommatePosts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.preferredLocation || "-"}</TableCell>
                  <TableCell>
                    LKR {Number(post.budgetMin || 0).toLocaleString()} - {Number(post.budgetMax || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="contained" onClick={() => handleRoommateModeration(post._id, "approved")}>Approve</Button>
                      <Button size="small" color="warning" onClick={() => handleRoommateModeration(post._id, "rejected")}>Reject</Button>
                      <Button size="small" color="error" onClick={() => handleRoommateModeration(post._id, "deactivated")}>Deactivate</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default AdminDashboardPage;
