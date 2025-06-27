import express from "express";
import {
      getAdminTemplate
} from "../../controllers/excel-controller/index.js";

const router = express.Router();

router.get("/admin-import-template", getAdminTemplate);


export default router;
