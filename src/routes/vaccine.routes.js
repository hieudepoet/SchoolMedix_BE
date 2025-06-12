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

router.post("/create/vaccine", createVaccine);
router.post("/create/campaign", createCampaign);
router.post("/create/register-request", createRegisterRequest);
router.patch("/update/register-request/:id", updateRegisterStatus);
router.get(
  "/get/student-eligible-for-campaign/:campaignId",
  getStudentEligibleForCampaign
);
router.post("/create/vaccination-record", createVaccinationRecord);
router.post("/create/pre-vaccination-record/:id", createPreVaccinationRecord);
router.patch("/update/vaccination-record/:id", updateVaccinationRecord);
router.get("/get/vaccination-record/:id", getVaccinationRecord);

export default router;
