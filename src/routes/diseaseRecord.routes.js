import express from 'express';
import {
        recordDiseaseOfStudent,
        getDiseaseOfStudent,
        getAllInfectiousDiseaseRecords,
        getAllChronicDiseaseRecords
}
        from '../controllers/diseaseRecord.controller.js';

const router = express.Router();

router.get("/infectious-record", getAllInfectiousDiseaseRecords) // lấy toàn bộ bệnh truyền nhiễm
router.get("/chronic-record", getAllChronicDiseaseRecords) // lấy toàn bộ bệnh mãn tính

router.post("/student/:student_id/infectious-record") // tạo mới bệnh truyền nhiễm cho học sinh
router.post("/student/:student_id/chronic-record") // tạo mới bệnh mãn tính cho học sinh

router.post('/student/:student_id/disease-record', recordDiseaseOfStudent); // tạo mới bệnh
// router.patch('/') // add sau
router.get("/student/:student_id/disease-record", getDiseaseOfStudent); // list toàn bộ bệnh của một học sinh

export default router;
