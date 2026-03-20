import { Button, Rating, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      rating,
      comment
    });
    setComment("");
    setRating(4);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={1.5}>
        <Typography variant="h6">Write a Review</Typography>
        <Rating
          name="rating"
          value={rating}
          onChange={(_, value) => setRating(value || 1)}
        />
        <TextField
          multiline
          minRows={3}
          value={comment}
          required
          inputProps={{ minLength: 10, maxLength: 1000 }}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share your experience with this boarding"
        />
        <Button type="submit" variant="contained">
          Submit Review
        </Button>
      </Stack>
    </form>
  );
}

export default ReviewForm;
