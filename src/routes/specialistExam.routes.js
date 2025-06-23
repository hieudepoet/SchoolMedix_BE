import express from "express"
import{ getALLSpeciaListExamRecord } from "../controllers/specialistexam.controller.js";

const router = express.Router();


// lấy toàn bộ chuyên khoa

router.get('/special-exam-list',getALLSpeciaListExamRecord);

// lấy info toàn bộ của một chuyên khoa

// thêm mới một chuyên khoa

// delete một chuyên khoa (set is_deleted = true)

// update thông tin của một chuyên khoa 



export default router;