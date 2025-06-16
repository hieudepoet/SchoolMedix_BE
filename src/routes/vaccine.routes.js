// routes/vaccination.routes.js
import express from "express";
import {
  createVaccine,
  getAllVaccines,
} from "../controllers/vaccine.controller.js";

const router = express.Router();

router.post("/vaccine", createVaccine);
router.get("/vaccine", getAllVaccines);

export default router;
