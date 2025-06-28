// routes/vaccination.routes.js
import express from "express";
import {
  createVaccine,
  getAllVaccines,
  getVaccine,
  updateVaccine,
  deleteVaccine,
  getDiseasesByVaccine,
} from "../controllers/vaccine.controller.js";

const router = express.Router();

router.post("/vaccine", createVaccine);
router.get("/vaccines", getAllVaccines);
router.patch("/vaccine/:id", updateVaccine);
router.delete("/vaccine:id", deleteVaccine);
router.get("/vaccines/:id/diseases", getDiseasesByVaccine);
router.get("/vaccine/:id", getVaccine);

export default router;
