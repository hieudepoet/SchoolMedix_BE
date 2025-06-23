// routes/vaccination.routes.js
import express from "express";
import {
  createCampaign,
  getStudentEligibleForCampaign,
  createVaccinationRecord,
  createPreVaccinationRecord,
  updateVaccinationRecord,
  getVaccinationRecordByID,
  getAllCampaigns,
  getCampaignDetailByID,
  getVaccinationRecordsByStudentID,
  acceptRegister,
  refuseRegister,
  closeRegisterByCampaignID,
  cancelCampaignByID,
  startCampaign,
  completeCampaign,
  startRegistrationForCampaign,
  getAllRegistersOfAStudentWithCampaignID,
  getAllRegisteredRecords,
  completeRecord,
  getVaccinationRecordsOfAStudentBasedOnADisease,
  getCompletedDosesMergedByDisease

} from "../controllers/vaccinationCampaign.controller.js";

const router = express.Router();

router.post("/vaccination-campaign", createCampaign);
router.get("/vaccination-campaign", getAllCampaigns);
router.get("/vaccination-campaign/:campaign_id", getCampaignDetailByID);
// router.post("/vaccination-campaign/:campaign_id/register", createRegisterRequest); // this is wrong relating to the logic mate, when creating new campaign it simultaneously  creates multiple registration forms for student

router.patch(
  "/vaccination-campaign/:campaign_id/close-register",
  closeRegisterByCampaignID
);
router.patch("/vaccination-campaign/:campaign_id/cancel", cancelCampaignByID);
router.patch("/vaccination-campaign/:campaign_id/start", startCampaign);
router.patch("/vaccination-campaign/:campaign_id/complete", completeCampaign);
router.patch(
  "/vaccination-campaign/:campaign_id/start-register",
  startRegistrationForCampaign
);

router.get(
  "/student/:student_id/vaccination-record",
  getVaccinationRecordsByStudentID
);

router.get("/student/:student_id/completed-doses", getCompletedDosesMergedByDisease);
router.get("/student/:student_id/disease/:disease_id/vaccination-record", getVaccinationRecordsOfAStudentBasedOnADisease);

router.patch("/vaccination-register/:id/accept", acceptRegister);
router.patch("/vaccination-register/:id/refuse", refuseRegister);

router.get(
  "/vaccination-campaign/:campaign_id/student-eligible",
  getStudentEligibleForCampaign
);

router.post("/vaccination-record", createVaccinationRecord);
router.post("/pre-vaccination-record/:campaign_id", createPreVaccinationRecord);

router.patch("/vaccination-record/:record_id", updateVaccinationRecord);
router.patch("/vaccination-record/:record_id/complete", completeRecord);

router.get("/vaccination-record/:id", getVaccinationRecordByID);

router.get(
  "/student/:student_id/vaccination-campaign/:campaign_id/register",
  getAllRegistersOfAStudentWithCampaignID
);
router.get(
  "/vaccination-campaign/:campaign_id/registered-record",
  getAllRegisteredRecords
);

export default router;