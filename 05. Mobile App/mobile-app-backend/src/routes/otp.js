import express from "express";
import { login, signup, request, verify } from "../controllers/otp/otp.js";

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.post("/request", request);

router.post("/verify", verify);

export default router;
