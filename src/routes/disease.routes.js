// routes/disease.routes.js
import express from "express";
import {
  createDisease,
  getAllDiseases,
  updateDisease,
  deleteDisease,
  getVaccinesByDisease,
  getSetOfDisease,
} from "../controllers/disease.controller.js";

const router = express.Router();

router.post("/disease", createDisease);
router.get("/vaccine-disease", getSetOfDisease);
router.get("/diseases", getAllDiseases);
router.put("/disease/:id", updateDisease);
router.delete("/disease/:id", deleteDisease);
router.get("/diseases/vaccines", (req, res) => {
  const { diseaseId } = req.query;
  console.log(diseaseId);
  // 5. Gọi hàm xử lý chính
  getVaccinesByDisease(req, res, diseaseId);
});

export default router;
