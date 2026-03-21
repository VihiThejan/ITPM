import { Avatar, Card, CardContent, Rating, Stack, Typography } from "@mui/material";

function ReviewList({ reviews }) {
  if (!reviews.length) {
    return <Typography color="text.secondary">No reviews yet for this boarding.</Typography>;
  }

  return (
    <Stack spacing={1.5}>
      {reviews.map((review) => (
        <Card key={review._id} variant="outlined">
          <CardContent>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <Avatar>{(review.studentName || "A").charAt(0)}</Avatar>
              <div>
                <Typography variant="subtitle2">{review.studentName}</Typography>
                <Rating value={review.rating} precision={0.5} readOnly size="small" />
              </div>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {review.comment}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

export default ReviewList;
