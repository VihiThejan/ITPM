import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { resendOtpCode, sendOtpCode } from "../services/authService";

function OtpVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp } = useAuth();
  const searchParams = new URLSearchParams(location.search);

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) return;
    sendOtpCode({ email }).catch(() => {
      // Avoid blocking page load if auto-send fails.
    });
  }, [email]);

  const handleVerify = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      setMessage("");

      await verifyOtp({ email, otp });
      setMessage("OTP verified successfully.");
      setTimeout(() => navigate("/home"), 700);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setError("");
      const response = await resendOtpCode({ email });
      setMessage(response.message || "OTP resent.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <Card sx={{ maxWidth: 540, mx: "auto", mt: 4 }}>
      <CardContent>
        <Stack spacing={2} component="form" onSubmit={handleVerify}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Verify OTP
          </Typography>

          <Typography color="text.secondary">
            Enter the 6-digit OTP sent to your email.
          </Typography>

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputProps={{ maxLength: 6 }}
            required
          />

          {error ? <Alert severity="error">{error}</Alert> : null}
          {message ? <Alert severity="success">{message}</Alert> : null}

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </Button>
          <Button onClick={handleResend}>Resend OTP</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default OtpVerificationPage;
