import express from "express";
import IncomeTotal from "../controllers/bus/incomeTotal.js";
import IncomeIndividual from "../controllers/bus/incomeIndi.js";
import MyBuses from "../controllers/bus/myBuses.js";
import Rating from "../controllers/bus/rating.js";
import Reports from "../controllers/bus/report.js";
import Report from "../controllers/bus/report.js";

const router = express.Router();

router.post("/incomeTotal", IncomeTotal);

router.post("/incomeIndie", IncomeIndividual);

router.post("/myBuses", MyBuses);

router.post("/rating", Rating);

router.post("/report", Report);

export default router;
