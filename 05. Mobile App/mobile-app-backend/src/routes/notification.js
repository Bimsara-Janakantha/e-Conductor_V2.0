import express from "express";
import ReqMessages from "../controllers/notification/reqMessages.js";

const router = express.Router();

router.post("/reqMessages", ReqMessages);

export default router;
