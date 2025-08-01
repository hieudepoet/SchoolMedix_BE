import express from "express";
import {
  getInfoOfGrades,
  getClassesInfoOfGradeByID,
  getInfoOfClasses,
  getClassInfoOfAStudent,
  getAllStudentsOfAClass,
} from "../controllers/class.controller.js";

const router = express.Router();

router.get("/grade", getInfoOfGrades);
router.get("/grade/:grade_id/class", getClassesInfoOfGradeByID);
router.get("/class", getInfoOfClasses);
router.get("/student/:student_id/class", getClassInfoOfAStudent);
router.get("/students/:class_id", getAllStudentsOfAClass);
export default router;
