import express from "express";
import {
     getMedicalItemById,
     getAllMedicalSupplies,
     getAllMedications,
     updateMedicalItem,
     createNewMedication,
     createNewMedicalSupply,
     getAllSuppliers,
     getSupplierById,
     createSupplier,
     updateSupplier,
} from "../controllers/medicalItem.controller.js";

const router = express.Router();

// quan ly thuoc vat tu
router.get('/medical-item/:id', getMedicalItemById);  // Get item by ID, may be medical supply or medication
router.get('/medical-supply', getAllMedicalSupplies);       // Get all medical supplies
router.get('/medication', getAllMedications);        // Get all medications
router.patch('/medical-item/:id', updateMedicalItem);     // Update name, unit, description, exp_date
router.post('/medication', createNewMedication);        // Create medication with quantity = 0
router.post('/medical-supply', createNewMedicalSupply);   // Create supply with quantity = 0

// quan ly ncc, tiem thuoc, vat tu...
router.get('/supplier', getAllSuppliers); // get all suppliers with their info
router.get('/supplier/:id', getSupplierById); // get info relating to a supplier
router.post('/supplier', createSupplier); // create a new supplier with all needed fields and status is defaultly 'ACTIVE'
router.put('/supplier/:id', updateSupplier); // update fields with all need fields

export default router;
