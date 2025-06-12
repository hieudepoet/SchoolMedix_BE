// index.js

import express from "express";
import userRoutes from "./users.routes.js";
import sendDrugRequestRoutes from "./sendDrugRequest.routes.js";
import checkUpRoutes from "./checkUp.routes.js";
import diseaseRoutes from "./disease.routes.js";
import vaccinationRoutes from "./vaccine.routes.js";
import classRoutes from "./class.routes.js";

const router = express.Router();

router.use("/", userRoutes);
router.use("/", sendDrugRequestRoutes);
router.use("/", checkUpRoutes);
router.use("/", diseaseRoutes);
router.use("/", vaccinationRoutes);
router.use("/", classRoutes);

export default router;
