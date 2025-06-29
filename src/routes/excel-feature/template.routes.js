import express from "express";
import {
      getAdminTemplate,
      getNurseTemplate,
      getParentTemplate,
      getStudentTemplate,
      getStudentParentTemplate,
} from "../../controllers/excel-controller/index.js";

const router = express.Router();

// Route cho từng loại template
router.get("/admin-import-template", getAdminTemplate);
router.get("/nurse-import-template", getNurseTemplate);
router.get("/parent-import-template", getParentTemplate);
router.get("/student-import-template", getStudentTemplate);
router.get("/student-parent-import-template", getStudentParentTemplate);

export default router;
