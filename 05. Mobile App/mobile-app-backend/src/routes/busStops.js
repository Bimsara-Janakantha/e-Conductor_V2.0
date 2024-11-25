import express from "express";
import BusStopLocations from "../controllers/busStops/locations.js";
import BusStopNames from "../controllers/busStops/names.js";

const router = express.Router();

router.get("/locations", BusStopLocations);

router.get("/names", BusStopNames);

export default router;
