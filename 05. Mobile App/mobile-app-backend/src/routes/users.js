import express from "express";
import Req1 from "../controllers/users/req1.js";
import Req2 from "../controllers/users/req2.js";
import Req3 from "../controllers/users/req3.js";
import Req4 from "../controllers/users/req4.js";
import Req5 from "../controllers/users/req5.js";
import Req6 from "../controllers/users/req6.js";
import Req7 from "../controllers/users/req7.js";
import Req8 from "../controllers/users/req8.js";

const router = express.Router();

router.post("/req1", Req1);

router.post("/req2", Req2);

router.post("/req3", Req3);

router.post("/req4", Req4);

router.post("/req5", Req5);

router.post("/req6", Req6);

router.post("/req7", Req7);

router.post("/req8", Req8);

export default router;
