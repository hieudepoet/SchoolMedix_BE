import express from "express";
import { getResponseFromAI } from "../controllers/aiChat.controller.js";
import { verifyAndAuthorize } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post('/ai-response', verifyAndAuthorize(["student", "parent"]), getResponseFromAI);

export default router;

