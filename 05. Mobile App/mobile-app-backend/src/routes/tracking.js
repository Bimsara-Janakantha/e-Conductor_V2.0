import express from "express";
import Trk1 from "../controllers/tracking/trk1.js";
import Trk2 from "../controllers/tracking/trk2.js";

const router = express.Router();

router.get("/trk1", Trk1);

router.post("/trk2", Trk2);

export default router;
