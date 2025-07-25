import express from "express";
import {
     getMedicalItemById,
     getAllMedicalSupplies,
     getAllMedications,
     updateMedicalItem,
     createNewMedication,
     createNewMedicalSupply,
} from "../controllers/medicalItem.controller.js";

const router = express.Router();

// quan ly thuoc vat tu
router.get('/medical-item/:id', getMedicalItemById);  // Get item by ID
router.get('/medical-supply', getAllMedicalSupplies);       // Get all medical supplies
router.get('/medication', getAllMedications);        // Get all medications
router.patch('/medical-item/:id', updateMedicalItem);     // Update name, unit, description, exp_date
router.post('/medication', createNewMedication);        // Create medication with quantity = 0
router.post('/medical-supply', createNewMedicalSupply);   // Create supply with quantity = 0

// quan ly ncc, tiem thuoc, vat tu...


export default router;
