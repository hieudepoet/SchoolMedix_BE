// routes/disease.routes.js
import express from "express";
import {
  createDisease,
  getAllDiseases,
  updateDisease,
  deleteDisease,
  createDiseaseRecord,
  updateDiseaseRecord,
  getAllDiseaseRecords,
  getDiseaseRecordsByCategory,
  deleteDiseaseRecord,
} from "../controllers/disease.controller.js";

const router = express.Router();

router.post("/create/disease", createDisease);
router.get("/read/disease/:id", getAllDiseases);
router.put("/update/disease/:id", updateDisease);
router.delete("/delete/disease/:id", deleteDisease);
router.post("/create/disease-record", createDiseaseRecord);
router.put("/update/disease-record/:id", updateDiseaseRecord);
router.get("/read/disease-records", getAllDiseaseRecords);
router.get(
  "/read/disease-records/:student_id/:disease_category",
  getDiseaseRecordsByCategory
);
router.delete("/delete/disease-record/:id", deleteDiseaseRecord);

export default router;
