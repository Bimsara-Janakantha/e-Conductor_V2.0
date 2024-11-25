import express from "express";
import Sdl1 from "../controllers/schedule/sdl1.js";
import Sdl2 from "../controllers/schedule/sdl2.js";

const router = express.Router();

router.post("/sdl1", Sdl1);

router.post("/sdl2", Sdl2);

export default router;
