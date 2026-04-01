import { Router } from "express";

import { resendOtp, sendOtp, verifyOtp } from "../controllers/otp.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { otpEmailSchema, otpVerifySchema } from "../validators/auth.validators.js";

const router = Router();

router.post("/send", validateRequest(otpEmailSchema), sendOtp);
router.post("/verify", validateRequest(otpVerifySchema), verifyOtp);
router.post("/resend", validateRequest(otpEmailSchema), resendOtp);

export default router;
