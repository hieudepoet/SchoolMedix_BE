import express from 'express';
import templateRoutes from './template.routes.js';

const router = express.Router();

router.use('/', templateRoutes);

export default router;