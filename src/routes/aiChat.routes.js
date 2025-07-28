import express from "express";
import {
    getAIChatResponse
} from "../controllers/aiChat.controller.js";


const router = express.Router();

router.get('/blog-type');

export default router;

