// index.js

import express from "express";
import userRoutes from "./users.routes.js";
import sendDrugRequestRoutes from "./sendDrugRequest.routes.js";
import checkUpRoutes from "./checkUp.routes.js";
import diseaseRoutes from "./disease.routes.js";
import vaccinationRoutes from "./vaccine.routes.js";
import vaccinationCampaignRoutes from "./vaccinationCampaign.routes.js"
import classRoutes from "./class.routes.js";
import dailyHealthRecordRoutes from "./dailyHealthRecord.routes.js";

const router = express.Router();

router.use("/", userRoutes);
router.use("/", sendDrugRequestRoutes);
router.use("/", checkUpRoutes);
router.use("/", diseaseRoutes);
router.use("/", vaccinationRoutes);
router.use("/", vaccinationCampaignRoutes);
router.use("/", classRoutes);
router.use("/", dailyHealthRecordRoutes);


export default router;
