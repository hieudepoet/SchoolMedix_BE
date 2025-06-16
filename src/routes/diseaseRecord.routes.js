import express from 'express';
import {
        recordDiseaseOfStudent,
        getDiseaseOfStudent,
        getAllInfectiousDiseaseRecords,
        getAllChronicDiseaseRecords,
        updateDiseaseRecord
}
        from '../controllers/diseaseRecord.controller.js';

const router = express.Router();

router.get("/infectious-record", getAllInfectiousDiseaseRecords) // lấy toàn bộ bệnh truyền nhiễm
router.get("/chronic-record", getAllChronicDiseaseRecords) // lấy toàn bộ bệnh mãn tính

router.post('/student/:student_id/disease-record', recordDiseaseOfStudent); // tạo mới bệnh cho cả truyền nhiễm và mãn tính
router.patch('/student/:student_id/disease-record', updateDiseaseRecord); // update disease record
router.get("/student/:student_id/disease-record", getDiseaseOfStudent); // list toàn bộ bệnh của một học sinh

export default router;
