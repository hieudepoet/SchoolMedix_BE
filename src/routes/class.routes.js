import express from "express";
import {
      getInfoOfGrades,
      getClassesInfoOfGradeByID,
      getInfoOfClasses,
      getClassInfoOfAStudent
} from "../controllers/class.controller.js";

const router = express.Router();

router.get("/grade", getInfoOfGrades);
router.get("/grade/:grade_id/class", getClassesInfoOfGradeByID);
router.get("/class", getInfoOfClasses);
router.get("/student/:student_id/class", getClassInfoOfAStudent);

export default router;
