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
     getAllMedicalItems,
     getAllInventoryTransactions,
     getInventoryTransactionById,
     getInventoryTransactionsBySupplier,
     getTransactionsForDailyHealthRecords,
     checkAdequateQuantityForAItem,
     createInventoryTransaction,
     updateInventoryTransaction,
     getInventoryTransactionsByPurposeID,
     getAllTransactionPurpose,
     deleteAMedicalItemByID,
     deleteSupplier,
     deleteATransaction,
     getAllDeletedInventoryTransaction,
     getAllExportTransactionPurpose,
     getAllImportTransaction,
     getAllImportTransactionPurpose,
     getAllExportTransaction,
     deletePermanentlyATransaction,
     restoreTransactionFromSoftDelete
} from "../controllers/medicalItem.controller.js";

const router = express.Router();

// quan ly thuoc vat tu
router.get('/medical-item/:id', getMedicalItemById);  // Get item by ID, may be medical supply or medication
router.get('/medical-item', getAllMedicalItems); // get all items
router.get('/medical-supply', getAllMedicalSupplies);       // Get all medical supplies
router.get('/medication', getAllMedications);        // Get all medications
router.patch('/medical-item/:id', updateMedicalItem);     // Update name, unit, description, exp_date
router.post('/medication', createNewMedication);        // Create medication with quantity = 0
router.post('/medical-supply', createNewMedicalSupply);   // Create supply with quantity = 0
router.delete('/medical-item/:id', deleteAMedicalItemByID);

// quan ly ncc, tiem thuoc, vat tu...
router.get('/supplier', getAllSuppliers); // get all suppliers with their info
router.get('/supplier/:id', getSupplierById); // get info relating to a supplier
router.post('/supplier', createSupplier); // create a new supplier with all needed fields and status is defaultly 'ACTIVE'
router.put('/supplier/:id', updateSupplier); // update fields with all need fields
router.delete('/supplier/:id', deleteSupplier);

// inventory transaction
router.get("/inventory-transaction", getAllInventoryTransactions); // get all transactions
router.get("/inventory-transaction/:id", getInventoryTransactionById); // get  transaction by its id
router.get("/supplier/:id/inventory-transaction", getInventoryTransactionsBySupplier); // get all transactions related to a supplier
router.get("/daily-health-usage", getTransactionsForDailyHealthRecords); //get all transactions have purpose_id is 1
router.get("/inventory-transaction/purpose/:id", getInventoryTransactionsByPurposeID); // get by purpose
router.post("/check-quantity", checkAdequateQuantityForAItem); // get a bool to know that this item is availably adquete about number of quantity

router.post("/inventory-transaction", createInventoryTransaction); // create new transaction along with medical items
router.put("/inventory-transaction/:id", updateInventoryTransaction); // update transaction with new medical items
router.delete("/inventory-transaction/:id", deleteATransaction);
router.delete("/inventory-transaction/:id/permanent-delete", deletePermanentlyATransaction);

router.get('/deleted-inventory-transaction', getAllDeletedInventoryTransaction);

router.get("/export-inventory-transaction", getAllExportTransaction);
router.get("/import-inventory-transaction", getAllImportTransaction);
router.get('/inventory-transaction/:id/restore', restoreTransactionFromSoftDelete);

//transaction purpose
router.get("/transaction-purpose", getAllTransactionPurpose);
router.get("/transaction-purpose/export", getAllExportTransactionPurpose);
router.get("/transaction-purpose/import", getAllImportTransactionPurpose);

export default router;
