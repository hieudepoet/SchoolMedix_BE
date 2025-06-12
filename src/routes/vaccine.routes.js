// routes/vaccination.routes.js
import express from "express";
import {
  createVaccine,
  createCampaign,
  createRegisterRequest,
  updateRegisterStatus,
  getStudentEligibleForCampaign,
  createVaccinationRecord,
  createPreVaccinationRecord,
  updateVaccinationRecord,
  getVaccinationRecord,
} from "../controllers/vaccine.controller.js";

const router = express.Router();

router.post("/vaccine", createVaccine);
router.post("/campaign", createCampaign);
router.post("/register-request", createRegisterRequest);
router.patch("/register-request/:id", updateRegisterStatus);
router.get(
  "/student-eligible-for-campaign/:campaignId",
  getStudentEligibleForCampaign
);
router.post("/vaccination-record", createVaccinationRecord);
router.post("/pre-vaccination-record/:id", createPreVaccinationRecord);
router.patch("/vaccination-record/:id", updateVaccinationRecord);
router.get("/vaccination-record/:id", getVaccinationRecord);

export default router;
