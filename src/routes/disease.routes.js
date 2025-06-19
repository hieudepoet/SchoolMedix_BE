// routes/disease.routes.js
import express from "express";
import {
  createDisease,
  getAllDiseases,
  updateDisease,
  deleteDisease,
} from "../controllers/disease.controller.js";

const router = express.Router();

router.post("/disease", createDisease);
router.get("/diseases", getAllDiseases);
router.put("/disease/:id", updateDisease);
router.delete("/disease/:id", deleteDisease);

export default router;
