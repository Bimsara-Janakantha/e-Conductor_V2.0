import express from "express";
import Tkt1 from "../controllers/tickets/tkt1.js";
import Tkt3 from "../controllers/tickets/tkt3.js";
import Tkt4 from "../controllers/tickets/tkt4.js";
import Tkt5 from "../controllers/tickets/tkt5.js";
import Tkt2 from "../controllers/tickets/tkt2.js";
import Tkt6 from "../controllers/tickets/tkt6.js";

const router = express.Router();

router.post("/tkt1", Tkt1);

router.get("/tkt2", Tkt2);

router.post("/tkt3", Tkt3);

router.post("/tkt4", Tkt4);

router.post("/tkt5", Tkt5);

router.get("/tkt6", Tkt6);

export default router;
