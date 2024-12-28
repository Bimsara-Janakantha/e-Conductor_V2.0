import express from "express";
import Trans1 from "../controllers/transactions/trans1.js";
import Trans2 from "../controllers/transactions/trans2.js";

const router = express.Router();

router.get("/trans1", Trans1);

router.post("/trans2", Trans2);

export default router;
