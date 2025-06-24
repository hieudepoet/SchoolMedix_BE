// routes/vaccination.routes.js
import express from "express";
import {
  createVaccine,
  getAllVaccines,
  getVaccine,
  updateVaccine,
  deleteVaccine,
  getVaccinesOfDisease,
} from "../controllers/vaccine.controller.js";

const router = express.Router();

router.post("/vaccine", createVaccine);
router.get("/vaccines", getAllVaccines);
router.get("/vaccine/:id", getVaccine);
router.patch("/vaccine:id", updateVaccine);
router.delete("/vaccine:id", deleteVaccine);
router.get("disease/:id/vaccines", getVaccinesOfDisease);

export default router;
