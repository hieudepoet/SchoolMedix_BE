// routes/vaccination.routes.js
import express from "express";
import {
  createVaccinationRecord,
  updateVaccinationRecord,
  getVaccinationRecordByID,
  getVaccinationRecordsByStudentID,
  getVaccinationRecordsOfAStudentBasedOnADisease,
  acceptVaccinationRecord,
  refuseVaccinationRecord,
  getVaccinationRecordsRequestedByStudentID,
  getAllVaccinationRecordsRequested,
  getAllMedicalRecordsRequestedBuStudentID,
  getAllMedicalRecordsRequested,
} from "../controllers/vaccinationRecord.controller.js";

const router = express.Router();

router.get(
  "/student/:student_id/vaccination-record",
  getVaccinationRecordsByStudentID
);
router.get(
  "/student/:student_id/disease/:disease_id/vaccination-record",
  getVaccinationRecordsOfAStudentBasedOnADisease // get detail of vaccination records of a student based on a disease
);
router.post("/vaccination-record", createVaccinationRecord);
// router.patch("/vaccination-record/:record_id", updateVaccinationRecord);
router.get("/vaccination-record/:id", getVaccinationRecordByID);

router.patch("/vaccination-record/:id/accept", acceptVaccinationRecord);
router.patch("/vaccination-record/:id/refuse", refuseVaccinationRecord);
router.get(
  "/parent/vaccination-record/:student_id/requests",
  getVaccinationRecordsRequestedByStudentID
);
router.get("/vaccination-record/requests", getAllVaccinationRecordsRequested);
router.get("/:student_id/requests", getAllMedicalRecordsRequestedBuStudentID);
router.get("/requests", getAllMedicalRecordsRequested);

export default router;
