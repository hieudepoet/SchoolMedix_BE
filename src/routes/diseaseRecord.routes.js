import express from 'express';
import {
        recordDiseaseOfStudent,
        getDiseaseOfStudent
}
        from '../controllers/diseaseRecord.controller.js';

const router = express.Router();

router.post('/student/:student_id/disease-record', recordDiseaseOfStudent); // tạo mới bệnh
// router.patch('/') // add sau
router.get("/student/:student_id/disease-record", getDiseaseOfStudent); // list toàn bộ bệnh của một học sinh

export default router;
