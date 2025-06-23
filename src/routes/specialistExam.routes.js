import express from "express"
import{ createSpecialistExam, getALLSpeciaListExamRecord, getSpecialExam, updateSpecialExam } from "../controllers/specialistexam.controller.js";

const router = express.Router();


// lấy toàn bộ chuyên khoa

router.get('/special-exam',getALLSpeciaListExamRecord);

// lấy info toàn bộ của một chuyên khoa

router.get('/special-exam/:id',getSpecialExam);

// thêm mới một chuyên khoa

router.post('/special-exam',createSpecialistExam);

// delete một chuyên khoa (set is_deleted = true)

// update thông tin của một chuyên khoa 

router.patch('/special-exam/:id',updateSpecialExam); // Truyền vào Spe_id



export default router;