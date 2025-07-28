import express from "express";
import { getResponseFromAI } from "../controllers/aiChat.controller.js";


const router = express.Router();

router.post('/ai-response', getResponseFromAI);

export default router;

