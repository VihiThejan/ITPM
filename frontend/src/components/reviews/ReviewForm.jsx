import { Button, Rating, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

function ReviewForm({ onSubmit, isSubmitting = false }) {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSubmit({
        rating,
        comment
      });
      setComment("");
      setRating(4);
    } catch (error) {
      // Parent handles error alerts; keep user input for retry.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={1.5}>
        <Typography variant="h6">Write a Review</Typography>
        <Rating
          name="rating"
          value={rating}
          onChange={(_, value) => setRating(value || 1)}
          disabled={isSubmitting}
        />
        <TextField
          multiline
          minRows={3}
          value={comment}
          required
          inputProps={{ minLength: 10, maxLength: 1000 }}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share your experience with this boarding"
          disabled={isSubmitting}
        />
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </Stack>
    </form>
  );
}

export default ReviewForm;
